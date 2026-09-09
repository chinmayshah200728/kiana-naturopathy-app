import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { products } from "@/data/products";

const FREE_SHIPPING_OVER = 999;
const SHIPPING_FLAT = 59;

const placeOrderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  address: z.string().trim().min(5).max(600),
  city: z.string().trim().min(2).max(80),
  pincode: z.string().trim().min(4).max(12),
  preferredItems: z.string().trim().max(600).optional().or(z.literal("")),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
  paymentMethod: z.enum(["cod", "upi"]),
  items: z
    .array(z.object({ slug: z.string().min(1), qty: z.number().int().min(1).max(50) }))
    .min(1)
    .max(30),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const lines = data.items.map((item) => {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) throw new Error(`Unknown product: ${item.slug}`);
      return {
        product_slug: product.slug,
        product_name: product.name,
        unit_price_inr: product.price,
        quantity: item.qty,
        line_total_inr: product.price * item.qty,
      };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.line_total_inr, 0);
    const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    const total = subtotal + shipping;
    const orderNumber = `KN-${Date.now().toString(36).toUpperCase()}`;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: data.name,
          phone: data.phone,
          email: data.email || null,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          preferred_items: data.preferredItems || null,
          notes: data.notes || null,
          payment_method: data.paymentMethod,
          payment_status: data.paymentMethod === "cod" ? "pending" : "awaiting_verification",
          subtotal_inr: subtotal,
          shipping_inr: shipping,
          total_inr: total,
        })
        .select("id, order_number, total_inr")
        .single();

      if (!error && order) {
        await supabaseAdmin
          .from("order_items")
          .insert(lines.map((line) => ({ ...line, order_id: order.id })));

        try {
          const { notifyNewOrder } = await import("@/lib/order-email.server");
          await notifyNewOrder({
            orderNumber: order.order_number,
            customerName: data.name,
            phone: data.phone,
            email: data.email || null,
            address: `${data.address}, ${data.city} ${data.pincode}`,
            paymentMethod: data.paymentMethod,
            lines: lines.map((l) => ({ name: l.product_name, qty: l.quantity, amount: l.line_total_inr })),
            subtotal,
            shipping,
            total,
            notes: data.notes || null,
          });
        } catch {
          /* email notification optional */
        }
      }
    } catch (err) {
      console.warn("Local fallback order processing:", err instanceof Error ? err.message : err);
    }

    return { orderNumber, total };
  });


async function assertAdmin(context: { supabase: ReturnType<typeof Object>; userId: string }) {
  const supabase = context.supabase as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };
  const { data } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (data !== true) throw new Error("Forbidden");
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);

    const { data: orders, error } = await context.supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, phone, email, city, pincode, address, payment_method, payment_status, status, subtotal_inr, shipping_inr, total_inr, notes, created_at, order_items(product_name, quantity, unit_price_inr, line_total_inr)",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);

    const list = orders ?? [];
    const revenue = list.reduce((sum, o) => sum + (o.total_inr ?? 0), 0);
    const today = new Date().toISOString().slice(0, 10);

    return {
      orders: list,
      stats: {
        orders: list.length,
        revenue,
        avgOrder: list.length ? Math.round(revenue / list.length) : 0,
        todayOrders: list.filter((o) => (o.created_at ?? "").slice(0, 10) === today).length,
        cod: list.filter((o) => o.payment_method === "cod").length,
        online: list.filter((o) => o.payment_method !== "cod").length,
      },
    };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.enum(["new", "packed", "shipped", "delivered", "cancelled"]).optional(),
        paymentStatus: z.enum(["pending", "awaiting_verification", "paid", "refunded"]).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const patch: { status?: string; payment_status?: string } = {};
    if (data.status) patch.status = data.status;
    if (data.paymentStatus) patch.payment_status = data.paymentStatus;
    if (Object.keys(patch).length === 0) return { ok: true };

    const { error } = await context.supabase.from("orders").update(patch).eq("id", data.orderId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: data === true };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { granted: false };

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insertError) throw new Error(insertError.message);
    return { granted: true };
  });
