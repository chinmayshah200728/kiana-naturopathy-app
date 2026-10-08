import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { PageHead } from "@/components/site/SiteLayout";
import { formatINR } from "@/lib/cart";
import { getPaymentStatus } from "@/lib/payment.functions";

export const Route = createFileRoute("/payment/success")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Kiana Naturopathy" },
      { name: "description", content: "Your payment has been verified and your order is confirmed." },
    ],
  }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const fetchStatus = useServerFn(getPaymentStatus);
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const orderIdParam = searchParams.get("orderId") || searchParams.get("order_number") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Awaited<ReturnType<typeof fetchStatus>> | null>(null);

  useEffect(() => {
    if (!orderIdParam) {
      setLoading(false);
      setError("No order identifier provided.");
      return;
    }

    setLoading(true);
    fetchStatus({ data: { orderNumber: orderIdParam } })
      .then((data) => {
        setOrder(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load order payment status.");
      })
      .finally(() => setLoading(false));
  }, [orderIdParam]);

  if (loading) {
    return (
      <>
        <PageHead eyebrow="Verifying Payment" title="Confirming Your Transaction..." />
        <section style={{ padding: "60px 0 100px", textAlign: "center" }}>
          <div className="wrap">
            <div className="card" style={{ maxWidth: 540, margin: "0 auto", padding: 40 }}>
              <div className="spinner" style={{ fontSize: "2.5rem", marginBottom: 16 }}>
                ⏳
              </div>
              <h3>Communicating with Razorpay Server...</h3>
              <p className="muted">
                Please wait while we verify your cryptographic payment signature and order status. Do not close this browser window.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <PageHead eyebrow="Order Lookup" title="Payment Verification Status" />
        <section style={{ padding: "60px 0 100px", textAlign: "center" }}>
          <div className="wrap" style={{ maxWidth: 580 }}>
            <div className="card" style={{ padding: 36, border: "2px solid #FCA5A5" }}>
              <span style={{ fontSize: "3rem" }}>⚠️</span>
              <h2 style={{ marginTop: 12 }}>Unable to Verify Order</h2>
              <p className="muted" style={{ margin: "10px 0 20px" }}>
                {error || "We could not locate the details for this payment reference."}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Link className="btn btn-primary" to="/account">
                  Check Order History in Account
                </Link>
                <Link className="btn btn-outline" to="/shop">
                  Return to Shop
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const isVerifiedPaid = order.paymentStatus === "PAID";

  return (
    <>
      <PageHead eyebrow="Payment Verified 🎉" title={`Thank You, ${order.customerName}!`} />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="card order-receipt-card" style={{ padding: 36, textAlign: "center" }}>
            <div
              className="receipt-success-badge"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#D1FAE5",
                color: "#059669",
                display: "grid",
                placeItems: "center",
                fontSize: "2.2rem",
                margin: "0 auto 20px",
              }}
            >
              ✓
            </div>

            <h2>Order #{order.orderNumber} Confirmed</h2>
            <p className="lead" style={{ fontSize: "1rem", margin: "10px 0 20px" }}>
              Your server-verified payment of <strong>{formatINR(order.totalInr)}</strong> was completed successfully!
            </p>

            {/* Authoritative Server Verification Badge */}
            <div
              style={{
                background: isVerifiedPaid ? "#ECFDF5" : "#FFFBEB",
                border: `1px solid ${isVerifiedPaid ? "#10B981" : "#F59E0B"}`,
                borderRadius: 12,
                padding: "16px 20px",
                margin: "20px 0",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: "1.2rem" }}>{isVerifiedPaid ? "🛡️" : "⏳"}</span>
                <strong style={{ fontSize: "1rem", color: isVerifiedPaid ? "#065F46" : "#92400E" }}>
                  {isVerifiedPaid
                    ? "Payment Server-Verified via Razorpay API"
                    : `Current Payment Status: ${order.paymentStatus}`}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: ".86rem", color: isVerifiedPaid ? "#047857" : "#B45309" }}>
                {isVerifiedPaid
                  ? `Razorpay Payment ID: ${order.razorpayPaymentId || "Verified"} | Order Reference: ${order.razorpayOrderId || order.orderNumber}`
                  : "Your transaction is being processed. Status updates will reflect automatically in your account."}
              </p>
            </div>

            {/* Delivery Address & Contact */}
            <div
              style={{
                background: "var(--cream-100)",
                border: "1px solid var(--line-gold)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              <h4 style={{ margin: "0 0 8px" }}>Shipping & Delivery Details</h4>
              <p style={{ margin: 0, fontSize: ".9rem" }}>
                <strong>{order.customerName}</strong> ({order.phone})
                <br />
                {order.address}, {order.city} - {order.pincode}
                {order.email && (
                  <>
                    <br />
                    <span>Email: {order.email}</span>
                  </>
                )}
              </p>
            </div>

            {/* Items Summary Table */}
            <div className="receipt-items-list" style={{ textAlign: "left", marginBottom: 24 }}>
              <h3 style={{ marginBottom: 12 }}>Purchased Items</h3>
              {order.items.map((item) => (
                <div
                  key={item.productSlug}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px dashed var(--line-gold)",
                  }}
                >
                  <div>
                    <strong>{item.productName}</strong>
                    <div className="muted" style={{ fontSize: ".84rem" }}>
                      {formatINR(item.unitPriceInr)} × {item.quantity}
                    </div>
                  </div>
                  <strong>{formatINR(item.lineTotalInr)}</strong>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div
              style={{
                background: "var(--emerald-950)",
                color: "#fff",
                padding: "16px 20px",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: "1.05rem" }}>Total Amount Paid:</span>
              <strong style={{ fontSize: "1.4rem", color: "var(--gold-400)" }}>{formatINR(order.totalInr)}</strong>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-primary" to="/account">
                View My Account & Orders →
              </Link>
              <a
                className="btn btn-outline"
                href={`https://wa.me/919876543210?text=Hello%20Kiana%20Naturopathy%2C%20I%20have%20placed%20order%20%23${order.orderNumber}.`}
                target="_blank"
                rel="noreferrer"
              >
                📱 Track Order on WhatsApp
              </a>
              <button className="btn btn-outline" onClick={() => window.print()}>
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
