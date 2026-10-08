import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { PageHead } from "@/components/site/SiteLayout";
import { formatINR } from "@/lib/cart";
import { getPaymentStatus } from "@/lib/payment.functions";

export const Route = createFileRoute("/payment/pending")({
  head: () => ({
    meta: [
      { title: "Payment Processing — Kiana Naturopathy" },
      { name: "description", content: "Your payment is currently being authorized by your bank." },
    ],
  }),
  component: PaymentPendingPage,
});

function PaymentPendingPage() {
  const navigate = useNavigate();
  const fetchStatus = useServerFn(getPaymentStatus);
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const orderIdParam = searchParams.get("orderId") || searchParams.get("order_number") || "";

  const [order, setOrder] = useState<Awaited<ReturnType<typeof fetchStatus>> | null>(null);

  useEffect(() => {
    if (!orderIdParam) return;

    let intervalId: NodeJS.Timeout;

    const checkStatus = () => {
      fetchStatus({ data: { orderNumber: orderIdParam } })
        .then((data) => {
          setOrder(data);
          if (data.paymentStatus === "PAID") {
            navigate({ to: "/payment/success", search: { orderId: data.orderNumber } });
          } else if (data.paymentStatus === "FAILED" || data.paymentStatus === "CANCELLED") {
            navigate({ to: "/payment/failed", search: { orderId: data.orderNumber } });
          }
        })
        .catch(() => {});
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 3000);

    return () => clearInterval(intervalId);
  }, [orderIdParam, navigate]);

  return (
    <>
      <PageHead eyebrow="Payment Verification" title="Processing Payment..." />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <div className="card" style={{ padding: 36, textAlign: "center", border: "2px solid #F5D77F" }}>
            <div
              className="spinner"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#FFF7D6",
                color: "#8A6100",
                display: "grid",
                placeItems: "center",
                fontSize: "2.2rem",
                margin: "0 auto 20px",
              }}
            >
              ⏳
            </div>

            <h2>Payment Under Bank Verification</h2>
            <p className="lead" style={{ fontSize: "1rem", margin: "10px 0 20px" }}>
              Your bank or payment app is processing your transaction. We are automatically checking status with Razorpay servers every few seconds.
            </p>

            {order && (
              <div
                style={{
                  background: "var(--cream-100)",
                  border: "1px solid var(--line-gold)",
                  borderRadius: 12,
                  padding: 16,
                  margin: "20px 0",
                  textAlign: "left",
                }}
              >
                <div>
                  Order Number: <strong>#{order.orderNumber}</strong>
                </div>
                <div>
                  Amount: <strong>{formatINR(order.totalInr)}</strong>
                </div>
                <div>
                  Status: <strong>{order.paymentStatus}</strong>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <Link className="btn btn-outline" to="/account">
                Check My Account Orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
