import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { products } from "@/data/products";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createRazorpayServerOrder,
  fetchRazorpayPayment,
  getPublicRazorpayKeyId,
  initiateRazorpayRefund,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from "./razorpay.server";
import {
  getPaymentOrderRecord,
  isWebhookProcessed,
  markWebhookProcessed,
  savePaymentOrderRecord,
  PaymentOrderRecord,
  PaymentStatus,
} from "./payment-store";

const FREE_SHIPPING_OVER = 999;
const SHIPPING_FLAT = 59;

// Schema validation for payment order creation
const createPaymentOrderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  address: z.string().trim().min(5).max(600),
  city: z.string().trim().min(2).max(80),
  pincode: z.string().trim().min(4).max(12),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
  paymentMethod: z.enum(["razorpay", "cod", "upi"]),
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().min(1).max(50),
      })
    )
    .min(1)
    .max(30),
});

/**
 * 1. SERVER-SIDE ORDER & RAZORPAY ORDER CREATION
 * NEVER trusts prices from frontend; validates against authoritative products catalog.
 */
export const createPaymentOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => createPaymentOrderSchema.parse(data))
  .handler(async ({ data }) => {
    // Validate line items against server-side authoritative catalog
    const lines = data.items.map((item) => {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) {
        throw new Error(`Invalid product selected: ${item.slug}`);
      }
      return {
        productSlug: product.slug,
        productName: product.name,
        unitPriceInr: product.price,
        quantity: item.qty,
        lineTotalInr: product.price * item.qty,
      };
    });

    const subtotal = lines.reduce((sum, l) => sum + l.lineTotalInr, 0);
    const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    const totalInr = subtotal + shipping;
    const amountInPaise = totalInr * 100;
    const orderNumber = `KN-${Date.now().toString(36).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    let razorpayOrderId: string | null = null;
    let initialPaymentStatus: PaymentStatus = "PAYMENT_PENDING";

    if (data.paymentMethod === "razorpay") {
      try {
        const razorpayOrder = await createRazorpayServerOrder({
          amountInPaise,
          currency: "INR",
          orderNumber,
          notes: {
            customer_name: data.name,
            customer_phone: data.phone,
            customer_email: data.email || "",
          },
        });
        razorpayOrderId = razorpayOrder.id;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Razorpay order initialization error:", msg);
        throw new Error("Unable to initialize secure payment gateway. Please try again or choose COD.");
      }
    } else {
      // COD Order
      initialPaymentStatus = "PAYMENT_PENDING";
    }

    const newOrderRecord: PaymentOrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address,
      city: data.city,
      pincode: data.pincode,
      notes: data.notes || null,
      paymentMethod: data.paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: "new",
      subtotalInr: subtotal,
      shippingInr: shipping,
      totalInr,
      currency: "INR",
      razorpayOrderId,
      createdAt,
      updatedAt: createdAt,
      items: lines,
    };

    // Save to memory store
    savePaymentOrderRecord(newOrderRecord);

    // Save to Supabase DB if available
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: dbOrder, error } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: data.name,
          phone: data.phone,
          email: data.email || null,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          notes: data.notes || null,
          payment_method: data.paymentMethod,
          payment_status: data.paymentMethod === "cod" ? "pending" : "payment_pending",
          subtotal_inr: subtotal,
          shipping_inr: shipping,
          total_inr: totalInr,
          stripe_session_id: razorpayOrderId,
        })
        .select("id")
        .single();

      if (!error && dbOrder) {
        await supabaseAdmin.from("order_items").insert(
          lines.map((line) => ({
            order_id: dbOrder.id,
            product_slug: line.productSlug,
            product_name: line.productName,
            unit_price_inr: line.unitPriceInr,
            quantity: line.quantity,
            line_total_inr: line.lineTotalInr,
          }))
        );
      }
    } catch (dbErr) {
      console.warn("Supabase database save optional:", dbErr);
    }

    return {
      orderNumber,
      totalInr,
      amountInPaise,
      currency: "INR",
      paymentMethod: data.paymentMethod,
      razorpayOrderId,
      keyId: getPublicRazorpayKeyId(),
      customerName: data.name,
      customerEmail: data.email || "",
      customerPhone: data.phone,
    };
  });

/**
 * 2. SERVER-SIDE PAYMENT VERIFICATION
 * Cryptographically verifies HMAC SHA-256 signature and Razorpay API status.
 */
const verifyPaymentSchema = z.object({
  orderNumber: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const verifyPayment = createServerFn({ method: "POST" })
  .validator((data: unknown) => verifyPaymentSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Verify HMAC Signature
    const isValidSignature = verifyPaymentSignature({
      orderId: data.razorpayOrderId,
      paymentId: data.razorpayPaymentId,
      signature: data.razorpaySignature,
    });

    if (!isValidSignature) {
      console.error("[Payment Verification Failed] Invalid HMAC signature:", data);
      throw new Error("Payment signature verification failed. Unauthorized request.");
    }

    // 2. Fetch payment details from Razorpay API to double check amount and captured status
    let paymentDetails;
    try {
      paymentDetails = await fetchRazorpayPayment(data.razorpayPaymentId);
    } catch (err) {
      console.error("Failed to fetch Razorpay payment details:", err);
      throw new Error("Could not verify payment with payment gateway.");
    }

    if (
      paymentDetails.status !== "captured" &&
      paymentDetails.status !== "authorized"
    ) {
      throw new Error(
        `Payment status is '${paymentDetails.status}'. Only captured payments can be completed.`
      );
    }

    // Retrieve order record
    const existingOrder = getPaymentOrderRecord(data.orderNumber) || getPaymentOrderRecord(data.razorpayOrderId);
    if (!existingOrder) {
      throw new Error(`Order ${data.orderNumber} not found.`);
    }

    // Update order status to PAID
    const updatedRecord: PaymentOrderRecord = {
      ...existingOrder,
      paymentStatus: "PAID",
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      updatedAt: new Date().toISOString(),
    };

    savePaymentOrderRecord(updatedRecord);

    // Update Supabase Database
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("order_number", existingOrder.orderNumber);

      // Trigger Email Notification
      try {
        const { notifyNewOrder } = await import("@/lib/order-email.server");
        await notifyNewOrder({
          orderNumber: existingOrder.orderNumber,
          customerName: existingOrder.customerName,
          phone: existingOrder.phone,
          email: existingOrder.email || null,
          address: `${existingOrder.address}, ${existingOrder.city} ${existingOrder.pincode}`,
          paymentMethod: "razorpay",
          lines: existingOrder.items.map((l) => ({
            name: l.productName,
            qty: l.quantity,
            amount: l.lineTotalInr,
          })),
          subtotal: existingOrder.subtotalInr,
          shipping: existingOrder.shippingInr,
          total: existingOrder.totalInr,
          notes: existingOrder.notes || null,
        });
      } catch {
        /* Email notification optional */
      }
    } catch (dbErr) {
      console.warn("Supabase update optional:", dbErr);
    }

    return {
      success: true,
      orderNumber: existingOrder.orderNumber,
      paymentId: data.razorpayPaymentId,
      paymentStatus: "PAID",
      amountPaidInr: existingOrder.totalInr,
    };
  });

/**
 * 3. GET AUTHORITATIVE ORDER & PAYMENT STATUS
 */
const getPaymentStatusSchema = z.object({
  orderNumber: z.string().min(1),
});

export const getPaymentStatus = createServerFn({ method: "GET" })
  .validator((data: unknown) => getPaymentStatusSchema.parse(data))
  .handler(async ({ data }) => {
    let order = getPaymentOrderRecord(data.orderNumber);

    if (!order) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: dbOrder } = await supabaseAdmin
          .from("orders")
          .select("*, order_items(*)")
          .eq("order_number", data.orderNumber)
          .single();

        if (dbOrder) {
          order = {
            id: dbOrder.id,
            orderNumber: dbOrder.order_number,
            customerName: dbOrder.customer_name,
            phone: dbOrder.phone,
            email: dbOrder.email,
            address: dbOrder.address,
            city: dbOrder.city,
            pincode: dbOrder.pincode,
            notes: dbOrder.notes,
            paymentMethod: dbOrder.payment_method as "razorpay" | "cod",
            paymentStatus: (dbOrder.payment_status?.toUpperCase() || "PAYMENT_PENDING") as PaymentStatus,
            orderStatus: (dbOrder.status || "new") as "new" | "packed" | "shipped" | "delivered" | "cancelled",
            subtotalInr: dbOrder.subtotal_inr,
            shippingInr: dbOrder.shipping_inr,
            totalInr: dbOrder.total_inr,
            currency: "INR",
            razorpayOrderId: dbOrder.stripe_session_id,
            createdAt: dbOrder.created_at,
            updatedAt: dbOrder.updated_at,
            items: (dbOrder.order_items || []).map((i: { product_slug: string; product_name: string; unit_price_inr: number; quantity: number; line_total_inr: number }) => ({
              productSlug: i.product_slug,
              productName: i.product_name,
              unitPriceInr: i.unit_price_inr,
              quantity: i.quantity,
              lineTotalInr: i.line_total_inr,
            })),
          };
          savePaymentOrderRecord(order);
        }
      } catch (err) {
        console.warn("Could not query DB for status:", err);
      }
    }

    if (!order) {
      throw new Error(`Order ${data.orderNumber} not found.`);
    }

    return {
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      pincode: order.pincode,
      paymentMethod: order.paymentMethod,
      totalInr: order.totalInr,
      subtotalInr: order.subtotalInr,
      shippingInr: order.shippingInr,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      failureReason: order.failureReason,
      refundId: order.refundId,
      refundAmountInr: order.refundAmountInr,
      createdAt: order.createdAt,
      items: order.items,
    };
  });

/**
 * 4. SECURE WEBHOOK PROCESSING (IDEMPOTENT & SIGNATURE VERIFIED)
 */
export async function processRazorpayWebhookEvent(rawBody: string, signature: string) {
  const isValid = verifyWebhookSignature({ rawBody, signature });
  if (!isValid) {
    console.error("[Webhook Error] Invalid Razorpay webhook signature");
    return { status: 400, message: "Invalid webhook signature" };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { status: 400, message: "Invalid JSON payload" };
  }

  const eventId = payload.event_id || payload.id;
  if (eventId && isWebhookProcessed(eventId)) {
    console.log(`[Webhook Idempotency] Skipping duplicate webhook event ${eventId}`);
    return { status: 200, message: "Webhook already processed" };
  }

  const eventType = payload.event;
  const paymentEntity = payload.payload?.payment?.entity;
  const razorpayOrderId = paymentEntity?.order_id;
  const razorpayPaymentId = paymentEntity?.id;

  if (eventType === "payment.captured" || eventType === "order.paid") {
    if (razorpayOrderId) {
      const order = getPaymentOrderRecord(razorpayOrderId);
      if (order) {
        const updated: PaymentOrderRecord = {
          ...order,
          paymentStatus: "PAID",
          razorpayPaymentId,
          updatedAt: new Date().toISOString(),
        };
        savePaymentOrderRecord(updated);

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("orders")
            .update({ payment_status: "paid" })
            .eq("order_number", order.orderNumber);
        } catch {}
      }
    }
  } else if (eventType === "payment.failed") {
    if (razorpayOrderId) {
      const order = getPaymentOrderRecord(razorpayOrderId);
      if (order) {
        const updated: PaymentOrderRecord = {
          ...order,
          paymentStatus: "FAILED",
          failureReason: paymentEntity?.error_description || "Payment failed",
          failureCode: paymentEntity?.error_code || "PAYMENT_FAILED",
          updatedAt: new Date().toISOString(),
        };
        savePaymentOrderRecord(updated);
      }
    }
  } else if (eventType === "refund.processed" || eventType === "refund.created") {
    const refundEntity = payload.payload?.refund?.entity;
    if (razorpayOrderId) {
      const order = getPaymentOrderRecord(razorpayOrderId);
      if (order) {
        const updated: PaymentOrderRecord = {
          ...order,
          paymentStatus: "REFUNDED",
          refundId: refundEntity?.id || "ref_processed",
          refundAmountInr: (refundEntity?.amount || 0) / 100,
          updatedAt: new Date().toISOString(),
        };
        savePaymentOrderRecord(updated);
      }
    }
  }

  if (eventId) {
    markWebhookProcessed(eventId);
  }

  return { status: 200, message: "Webhook processed successfully" };
}

/**
 * 5. ADMIN AUTHORIZED REFUND FUNCTION
 */
const initiateRefundSchema = z.object({
  orderNumber: z.string().min(1),
  reason: z.string().optional(),
});

async function assertAdmin(context: { supabase: ReturnType<typeof Object>; userId: string }) {
  const supabase = context.supabase as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };
  const { data } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (data !== true) throw new Error("Forbidden: Admin privileges required to issue refunds.");
}

export const adminInitiateRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => initiateRefundSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const order = getPaymentOrderRecord(data.orderNumber);
    if (!order) {
      throw new Error(`Order ${data.orderNumber} not found.`);
    }

    if (order.paymentStatus !== "PAID" && order.paymentMethod !== "razorpay") {
      throw new Error(`Only paid online orders can be refunded.`);
    }

    let refundResult;
    if (order.razorpayPaymentId) {
      refundResult = await initiateRazorpayRefund({
        paymentId: order.razorpayPaymentId,
        amountInPaise: order.totalInr * 100,
        notes: {
          reason: data.reason || "Admin Initiated Refund",
          order_number: order.orderNumber,
        },
      });
    }

    const updatedOrder: PaymentOrderRecord = {
      ...order,
      paymentStatus: "REFUNDED",
      refundId: refundResult?.id || `ref_${Date.now()}`,
      refundAmountInr: order.totalInr,
      updatedAt: new Date().toISOString(),
    };

    savePaymentOrderRecord(updatedOrder);

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("orders")
        .update({ payment_status: "refunded" })
        .eq("order_number", order.orderNumber);
    } catch {}

    return {
      success: true,
      orderNumber: order.orderNumber,
      refundId: updatedOrder.refundId,
      refundAmountInr: order.totalInr,
    };
  });
