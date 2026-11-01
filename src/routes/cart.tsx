import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { PageHead } from "@/components/site/SiteLayout";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";
import { createPaymentOrder } from "@/lib/payment.functions";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart & Secure Checkout — Kiana Naturopathy" },
      {
        name: "description",
        content:
          "Review your wellness order, checkout securely via Cash on Delivery or Instant UPI. Free express shipping on orders over ₹999.",
      },
      { property: "og:title", content: "Your Cart & Checkout — Kiana Naturopathy" },
      { property: "og:description", content: "Secure Cash on Delivery & UPI Checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

const FREE_SHIPPING_THRESHOLD = 999;

function CartPage() {
  const navigate = useNavigate();
  const { lines, subtotal, shipping, setQty, remove, clear } = useCart();
  const {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addOrderToHistory,
    customerUser,
    loginCustomer,
    logoutCustomer,
  } = useECommerce();

  const initPaymentOrderServer = useServerFn(createPaymentOrder);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [upiRef, setUpiRef] = useState("");

  // Customer Auth Sign-In States
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCustomerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authEmail.trim() || !authPhone.trim()) {
      setError("Please fill in your full name, email address, and mobile phone to sign in.");
      return;
    }
    setError(null);
    loginCustomer({
      name: authName.trim(),
      email: authEmail.trim(),
      phone: authPhone.trim(),
    });
  };

  // Free shipping progress calculation
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount > 0) {
      discountAmount = Math.min(subtotal, appliedCoupon.flatDiscount);
    }
  }

  const isFreeShippingUnlocked = appliedCoupon?.freeShipping || shipping === 0;
  const finalShipping = isFreeShippingUnlocked ? 0 : shipping;
  const finalTotal = Math.max(0, subtotal - discountAmount + finalShipping);

  async function handleSubmitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!customerUser) {
      setError("Customer Sign-In Required! Please sign in or create your customer account to place your order.");
      return;
    }

    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setBusy(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const city = String(form.get("city") ?? "").trim();
    const pincode = String(form.get("pincode") ?? "").trim();
    const notes = String(form.get("notes") ?? "").trim();

    try {
      // 1. Create Server Order (prices validated server-side)
      const orderRes = await initPaymentOrderServer({
        data: {
          name,
          phone,
          email,
          address,
          city,
          pincode,
          notes: notes
            ? paymentMethod === "upi" && upiRef.trim()
              ? `${notes} (UPI Ref: ${upiRef.trim()})`
              : notes
            : paymentMethod === "upi" && upiRef.trim()
            ? `UPI Ref: ${upiRef.trim()}`
            : "",
          paymentMethod,
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        },
      });

      // Update customer profile with delivery details
      loginCustomer({ name, email, phone, address: `${address}, ${city} ${pincode}`, city, pincode });

      // Direct Order Confirmation (Cash on Delivery or Instant UPI)
      addOrderToHistory({
        id: "ord_" + Date.now(),
        orderNumber: orderRes.orderNumber,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        items: lines.map((l) => ({ slug: l.slug, name: l.name, price: l.price, qty: l.qty, image: l.image })),
        subtotal,
        discount: discountAmount,
        shipping: finalShipping,
        total: finalTotal,
        status: paymentMethod === "cod" ? "Order Placed (COD)" : "Order Placed (UPI Confirmed)",
        paymentMethod,
        address: `${address}, ${city} ${pincode}`,
        customerName: name,
        phone,
      });

      clear();
      navigate({ to: "/payment/success", search: { orderId: orderRes.orderNumber } });
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Order checkout failed. Please try again.");
    }
  }

  return (
    <>
      <PageHead
        eyebrow="Shopping Cart"
        title="Checkout & Payment"
        lead="Review your items, apply promo codes, choose your payment option, and confirm your delivery address."
      />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap">
          {lines.length === 0 ? (
            <div className="center" style={{ padding: "60px 0" }}>
              <span style={{ fontSize: "3rem" }}>🛒</span>
              <h2 style={{ marginTop: 16 }}>Your cart is empty</h2>
              <p className="lead" style={{ margin: "10px 0 24px" }}>
                Browse our shop for practitioner-selected supplements, oils, and natural remedies.
              </p>
              <Link className="btn btn-primary" to="/shop">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div>
              {/* Free Shipping Meter Banner */}
              <div className="shipping-meter card" style={{ marginBottom: 24 }}>
                {amountNeededForFreeShipping > 0 ? (
                  <p style={{ margin: "0 0 8px" }}>
                    Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more to get{" "}
                    <strong className="text-primary">FREE Express Shipping!</strong>
                  </p>
                ) : (
                  <p className="unlocked-text" style={{ margin: "0 0 8px" }}>
                    🎉 You unlocked <strong>FREE Express Shipping!</strong>
                  </p>
                )}
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>

              <div className="cart-checkout-grid">
                {/* Left Column: Cart Table + Delivery Details Form */}
                <div>
                  <div className="card" style={{ overflowX: "auto", marginBottom: 24 }}>
                    <h3>Selected Items ({lines.reduce((a, b) => a + b.qty, 0)})</h3>
                    <table className="cart">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Amount</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {lines.map((line) => (
                          <tr key={line.slug}>
                            <td>
                              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <img
                                  src={line.image}
                                  alt={line.name}
                                  width={56}
                                  height={56}
                                  style={{ borderRadius: 8, objectFit: "cover" }}
                                />
                                <div>
                                  <strong style={{ fontSize: ".95rem" }}>{line.name}</strong>
                                  <br />
                                  <span className="muted" style={{ fontSize: ".84rem" }}>
                                    {formatINR(line.price)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="qty-picker" style={{ scale: "0.9" }}>
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => setQty(line.slug, Math.max(1, line.qty - 1))}
                                >
                                  -
                                </button>
                                <span className="qty-val">{line.qty}</span>
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => setQty(line.slug, line.qty + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              <strong>{formatINR(line.price * line.qty)}</strong>
                            </td>
                            <td>
                              <button
                                className="btn-remove"
                                onClick={() => remove(line.slug)}
                                title="Remove item"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* STEP 1: Mandatory Customer Account Authentication */}
                  {!customerUser ? (
                    <div className="card" style={{ marginBottom: 24, border: "2px solid var(--line-gold)", background: "var(--cream-100)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <span style={{ fontSize: "1.6rem" }}>🔑</span>
                        <div>
                          <h3 style={{ margin: 0, color: "var(--emerald-900)" }}>Step 1: Customer Sign-In Required</h3>
                          <span className="muted" style={{ fontSize: ".86rem" }}>
                            Customer account sign-in is required to place your order and track invoices.
                          </span>
                        </div>
                      </div>

                      <form onSubmit={handleCustomerLoginSubmit} style={{ marginTop: 16 }}>
                        <div className="row2">
                          <div className="field">
                            <label>Full Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Radhika Sharma"
                              value={authName}
                              onChange={(e) => setAuthName(e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>Email Address *</label>
                            <input
                              type="email"
                              required
                              placeholder="radhika@example.com"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label>Mobile Phone *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                          />
                        </div>

                        <button className="btn btn-primary btn-block" type="submit" style={{ marginTop: 12 }}>
                          🔑 Sign In &amp; Continue to Delivery Address →
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#ECFDF5",
                        border: "1px solid #10B981",
                        borderRadius: 12,
                        padding: "14px 20px",
                        marginBottom: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: "1.3rem" }}>👤</span>
                        <div>
                          <strong style={{ color: "#065F46", fontSize: "1rem" }}>Logged in as {customerUser.name}</strong>
                          <span style={{ display: "block", fontSize: ".82rem", color: "#047857" }}>
                            {customerUser.email} • {customerUser.phone}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-link"
                        style={{ color: "#DC2626", fontWeight: 700, fontSize: ".84rem" }}
                        onClick={logoutCustomer}
                      >
                        Switch Account / Logout
                      </button>
                    </div>
                  )}

                  {/* STEP 2: Shipping Address & Payment Selection Form */}
                  <div className="card" style={!customerUser ? { opacity: 0.6, pointerEvents: "none" } : {}}>
                    <h3>Step 2: Shipping Address &amp; Payment Details</h3>
                    <form onSubmit={handleSubmitCheckout} id="checkout-form">
                      <div className="field">
                        <label htmlFor="o-name">Full Name *</label>
                        <input id="o-name" name="name" required key={customerUser?.name} defaultValue={customerUser?.name || ""} placeholder="e.g. Chinmay Deshmukh" />
                      </div>

                      <div className="row2">
                        <div className="field">
                          <label htmlFor="o-phone">Mobile Phone (For SMS/WhatsApp Updates) *</label>
                          <input id="o-phone" name="phone" required key={customerUser?.phone} defaultValue={customerUser?.phone || ""} placeholder="+91 98765 43210" />
                        </div>
                        <div className="field">
                          <label htmlFor="o-email">Email Address *</label>
                          <input id="o-email" name="email" type="email" required key={customerUser?.email} defaultValue={customerUser?.email || ""} placeholder="care@example.com" />
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="o-address">Street Address / House No. *</label>
                        <textarea id="o-address" name="address" rows={2} required placeholder="Flat / Building / Area" />
                      </div>

                      <div className="row2">
                        <div className="field">
                          <label htmlFor="o-city">City *</label>
                          <input id="o-city" name="city" required placeholder="Mumbai" />
                        </div>
                        <div className="field">
                          <label htmlFor="o-pin">6-Digit PIN Code *</label>
                          <input id="o-pin" name="pincode" required placeholder="400001" maxLength={6} />
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="o-notes">Special Instructions or Health Notes</label>
                        <input id="o-notes" name="notes" placeholder="e.g. Leave package with security guard" />
                      </div>

                      {/* Payment Method Selection */}
                      <div className="field" style={{ marginTop: 24 }}>
                        <label style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                          Select Payment Method *
                        </label>

                        <div className="payment-method-tabs" style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <button
                            type="button"
                            className={`payment-tab ${paymentMethod === "cod" ? "active" : ""}`}
                            onClick={() => setPaymentMethod("cod")}
                            style={{ padding: "14px 16px", borderRadius: 12, textAlign: "left" }}
                          >
                            <strong style={{ display: "block", fontSize: "1rem" }}>💵 Cash on Delivery</strong>
                            <span style={{ fontSize: ".82rem", opacity: 0.85 }}>Pay cash or UPI upon package arrival</span>
                          </button>

                          <button
                            type="button"
                            className={`payment-tab ${paymentMethod === "upi" ? "active" : ""}`}
                            onClick={() => setPaymentMethod("upi")}
                            style={{ padding: "14px 16px", borderRadius: 12, textAlign: "left" }}
                          >
                            <strong style={{ display: "block", fontSize: "1rem" }}>📲 Instant UPI QR</strong>
                            <span style={{ fontSize: ".82rem", opacity: 0.85 }}>Scan &amp; pay via GPay, PhonePe, Paytm</span>
                          </button>
                        </div>

                        {/* COD Box */}
                        {paymentMethod === "cod" && (
                          <div className="payment-details-box card" style={{ marginTop: 14, background: "#F0FDF4", border: "1px solid #86EFAC" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                              <span style={{ fontSize: "1.4rem" }}>📦</span>
                              <h4 style={{ margin: 0, color: "#166534" }}>Cash on Delivery (COD) Selected</h4>
                            </div>
                            <p className="muted" style={{ fontSize: ".88rem", margin: 0, color: "#15803D" }}>
                              No advance online payment required! You can pay cash or scan the courier partner's UPI QR code when your parcel is delivered to your doorstep.
                            </p>
                          </div>
                        )}

                        {/* UPI Box */}
                        {paymentMethod === "upi" && (
                          <div className="payment-details-box card" style={{ marginTop: 14, background: "#F8FAFC", border: "1px solid #CBD5E1" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                              <span style={{ fontSize: "1.4rem" }}>📲</span>
                              <div>
                                <h4 style={{ margin: 0, color: "#0F172A" }}>Scan &amp; Pay via Direct UPI</h4>
                                <span style={{ fontSize: ".82rem", color: "#64748B" }}>GPay, PhonePe, Paytm, BHIM, Cred or any bank app</span>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", padding: 14, background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=kiananaturopathy@upi&pn=Kiana%20Naturopathy&am=${finalTotal}&cu=INR`)}`}
                                alt="UPI QR Code"
                                width={120}
                                height={120}
                                style={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
                              />
                              <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ fontSize: ".88rem", marginBottom: 4 }}>
                                  <strong>UPI ID:</strong> <code style={{ background: "#EEF2F6", padding: "2px 6px", borderRadius: 4, fontWeight: 700, color: "#0F172A" }}>kiananaturopathy@upi</code>
                                </div>
                                <div style={{ fontSize: ".88rem", marginBottom: 8 }}>
                                  <strong>Payable Amount:</strong> <span style={{ color: "#065F46", fontWeight: 700, fontSize: "1.05rem" }}>{formatINR(finalTotal)}</span>
                                </div>
                                <label htmlFor="upi-ref-input" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                                  UPI Transaction / UTR Ref Number (Optional):
                                </label>
                                <input
                                  id="upi-ref-input"
                                  type="text"
                                  value={upiRef}
                                  onChange={(e) => setUpiRef(e.target.value)}
                                  placeholder="e.g. 429381029384"
                                  style={{ width: "100%", padding: "7px 10px", fontSize: ".85rem", borderRadius: 6, border: "1px solid #CBD5E1" }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="notice" style={{ marginBottom: 14, background: "#FEF2F2", borderColor: "#FCA5A5", color: "#991B1B" }}>
                          ⚠️ {error}
                        </div>
                      )}

                      <button
                        className="btn btn-primary btn-block btn-lg"
                        type="submit"
                        disabled={busy}
                        style={{ marginTop: 20 }}
                      >
                        {busy
                          ? "Placing Your Order..."
                          : paymentMethod === "cod"
                          ? `Confirm Order with Cash on Delivery (${formatINR(finalTotal)}) →`
                          : `Confirm UPI Order (${formatINR(finalTotal)}) →`}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Column: Order Summary & Coupons */}
                <div>
                  <div className="card sticky-summary-card">
                    <h3>Order Summary</h3>

                    {/* Promo Coupon Box */}
                    <div className="coupon-box" style={{ margin: "16px 0" }}>
                      {appliedCoupon ? (
                        <div className="coupon-applied-badge">
                          <span>
                            🏷️ <strong>{appliedCoupon.code}</strong> applied!
                          </span>
                          <button className="btn-link" onClick={removeCoupon}>
                            Remove
                          </button>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const code = new FormData(form).get("code") as string;
                            const res = applyCoupon(code);
                            if (!res.success) alert(res.message);
                            form.reset();
                          }}
                          className="coupon-form"
                        >
                          <input
                            name="code"
                            placeholder="Enter Coupon Code"
                            className="coupon-input"
                          />
                          <button type="submit" className="btn btn-outline btn-sm">
                            Apply
                          </button>
                        </form>
                      )}
                      <p className="muted" style={{ fontSize: ".78rem", marginTop: 6 }}>
                        Available Codes: <strong>KIANA10</strong> (10% off) | <strong>FREESHIP</strong>
                      </p>
                    </div>

                    <div className="cart-summary-rows">
                      <div className="summary-row">
                        <span className="muted">Subtotal</span>
                        <strong>{formatINR(subtotal)}</strong>
                      </div>

                      {discountAmount > 0 && (
                        <div className="summary-row text-success">
                          <span>Promo Discount</span>
                          <strong>-{formatINR(discountAmount)}</strong>
                        </div>
                      )}

                      <div className="summary-row">
                        <span className="muted">Shipping</span>
                        <strong>
                          {isFreeShippingUnlocked ? (
                            <span className="text-success">FREE</span>
                          ) : (
                            formatINR(shipping)
                          )}
                        </strong>
                      </div>

                      <div
                        className="summary-row final-total-row"
                        style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 8 }}
                      >
                        <span>Total Payable</span>
                        <strong className="price" style={{ fontSize: "1.4rem" }}>
                          {formatINR(finalTotal)}
                        </strong>
                      </div>
                    </div>

                    <div className="trust-checkout-badges" style={{ marginTop: 20 }}>
                      <div>🛡️ 100% Safe &amp; Secure Checkout</div>
                      <div>⚡ 3–6 Working Days Delivery</div>
                      <div>🌿 Ayush &amp; GMP Standard Verified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
