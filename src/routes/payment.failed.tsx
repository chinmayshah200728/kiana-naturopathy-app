import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { PageHead } from "@/components/site/SiteLayout";
import { formatINR } from "@/lib/cart";
import { getPaymentStatus } from "@/lib/payment.functions";

export const Route = createFileRoute("/payment/failed")({
  head: () => ({
    meta: [
      { title: "Payment Unsuccessful — Kiana Naturopathy" },
      { name: "description", content: "Payment was not completed. You can retry safely without duplicate charges." },
    ],
  }),
  component: PaymentFailedPage,
});

function PaymentFailedPage() {
  const fetchStatus = useServerFn(getPaymentStatus);
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const orderIdParam = searchParams.get("orderId") || searchParams.get("order_number") || "";
  const failureReasonParam = searchParams.get("reason") || "Payment could not be processed by gateway or was cancelled by user.";

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Awaited<ReturnType<typeof fetchStatus>> | null>(null);

  useEffect(() => {
    if (orderIdParam) {
      setLoading(true);
      fetchStatus({ data: { orderNumber: orderIdParam } })
        .then((data) => setOrder(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderIdParam]);

  return (
    <>
      <PageHead eyebrow="Payment Status" title="Transaction Unsuccessful" />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <div className="card" style={{ padding: 36, textAlign: "center", border: "2px solid #FCA5A5" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#FEE2E2",
                color: "#DC2626",
                display: "grid",
                placeItems: "center",
                fontSize: "2.2rem",
                margin: "0 auto 20px",
              }}
            >
              ✕
            </div>

            <h2 style={{ color: "#991B1B" }}>Payment Not Completed</h2>
            <p className="lead" style={{ fontSize: "1rem", margin: "10px 0 20px" }}>
              Your order payment was not completed. No money was deducted, or any temporary authorization will be automatically reversed by your bank.
            </p>

            {/* Error Detail Box */}
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 12,
                padding: "16px 20px",
                margin: "20px 0",
                textAlign: "left",
              }}
            >
              <strong style={{ color: "#991B1B", fontSize: ".95rem", display: "block", marginBottom: 4 }}>
                Reason for Failure / Cancellation:
              </strong>
              <p style={{ margin: 0, fontSize: ".88rem", color: "#B91C1C" }}>
                {order?.failureReason || failureReasonParam}
              </p>
              {order && (
                <div style={{ marginTop: 8, fontSize: ".84rem", color: "#7F1D1D" }}>
                  Order Reference: <strong>#{order.orderNumber}</strong> | Amount: <strong>{formatINR(order.totalInr)}</strong>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" to="/cart">
                💳 Retry Payment in Cart
              </Link>
              <Link className="btn btn-outline" to="/shop">
                Return to Shop
              </Link>
              <a
                className="btn btn-light"
                href="tel:+919876543210"
              >
                📞 Call Support: +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
