/**
 * Order notification email service.
 * Sends confirmation emails to customer and admin notifications to kianaturopathy@gmail.com.
 */

export type OrderEmailPayload = {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  paymentMethod: string;
  lines: { name: string; qty: number; amount: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  notes: string | null;
};

export function generateCustomerEmailHtml(order: OrderEmailPayload): string {
  const itemsHtml = order.lines
    .map(
      (l) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${l.name}</strong> × ${l.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${l.amount.toLocaleString("en-IN")}</td>
    </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Confirmation #${order.orderNumber}</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #D4AF37; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0F3822, #175233); padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; color: #F3E5AB;">🌿 Kiana Naturopathy</h1>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Order Confirmation #${order.orderNumber}</p>
      </div>

      <div style="padding: 30px; color: #111B15;">
        <h2 style="color: #0F3822; margin-top: 0;">Thank you for your order, ${order.customerName}!</h2>
        <p style="color: #576B5F; font-size: 15px; line-height: 1.5;">
          We have received your request and our naturopathy practitioner team is preparing your wellness shipment.
        </p>

        <div style="background: #F3EEE5; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <strong style="color: #0F3822;">Delivery Address:</strong>
          <p style="margin: 4px 0 0; font-size: 14px;">${order.address}<br>Phone: ${order.phone}</p>
          <p style="margin: 8px 0 0; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        </div>

        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #0F3822; color: #ffffff; text-align: left;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right; font-size: 15px;">
          <p style="margin: 4px 0;">Subtotal: <strong>₹${order.subtotal.toLocaleString("en-IN")}</strong></p>
          <p style="margin: 4px 0;">Shipping: <strong>${order.shipping === 0 ? "FREE" : "₹" + order.shipping}</strong></p>
          <h3 style="color: #0F3822; margin: 8px 0;">Total Payable: ₹${order.total.toLocaleString("en-IN")}</h3>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 13px; color: #8FA197; text-align: center;">
          Have questions? Reply to this email or contact us at <a href="mailto:kianaturopathy@gmail.com" style="color: #0F3822;">kianaturopathy@gmail.com</a> | +91 98765 43210
        </p>
      </div>
    </div>
  </body>
  </html>`;
}

export function generateAdminEmailHtml(order: OrderEmailPayload): string {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; padding: 20px; color: #111B15;">
    <h2 style="color: #0F3822;">🚨 NEW ORDER REQUEST #${order.orderNumber}</h2>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Phone:</strong> ${order.phone}</p>
    <p><strong>Email:</strong> ${order.email || "N/A"}</p>
    <p><strong>Address:</strong> ${order.address}</p>
    <p><strong>Total Amount:</strong> ₹${order.total.toLocaleString("en-IN")} (${order.paymentMethod.toUpperCase()})</p>
    <p><strong>Items:</strong></p>
    <ul>
      ${order.lines.map((l) => `<li>${l.name} × ${l.qty} (₹${l.amount})</li>`).join("")}
    </ul>
    ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ""}
  </body>
  </html>`;
}

export async function notifyNewOrder(order: OrderEmailPayload) {
  console.log("=================================================");
  console.log(`[ORDER EMAIL] Processing Confirmation #${order.orderNumber}`);
  console.log(`[CUSTOMER RECIPIENT]: ${order.email || "No email provided"}`);
  console.log(`[ADMIN NOTIFICATION]: kianaturopathy@gmail.com`);
  console.log("=================================================");

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      if (order.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Kiana Naturopathy <orders@kiananaturopathy.in>",
            to: [order.email],
            subject: `🌿 Order Confirmation #${order.orderNumber}`,
            html: generateCustomerEmailHtml(order),
          }),
        });
      }

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Kiana Naturopathy Alerts <orders@kiananaturopathy.in>",
          to: ["kianaturopathy@gmail.com"],
          subject: `🚨 NEW ORDER REQUEST #${order.orderNumber}`,
          html: generateAdminEmailHtml(order),
        }),
      });
    } catch (err) {
      console.error("Resend API email error:", err);
    }
  }

  return {
    sent: true,
    customerEmail: order.email,
    adminEmail: "kianaturopathy@gmail.com",
    orderNumber: order.orderNumber,
  };
}
