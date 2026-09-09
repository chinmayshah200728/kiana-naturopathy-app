import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { PageHead } from "@/components/site/SiteLayout";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce, type OrderRecord } from "@/lib/ecommerce-context";
import { placeOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart & Express Checkout — Kiana Naturopathy" },
      {
        name: "description",
        content:
          "Review your wellness order, choose UPI, Card, Net Banking or Cash on Delivery, and confirm delivery details. Free shipping over ₹999.",
      },
      { property: "og:title", content: "Your Cart — Kiana Naturopathy" },
      { property: "og:description", content: "Checkout with UPI, Card, Net Banking or Cash on Delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

const UPI_ID = "kiananaturopathy@upi";
const FREE_SHIPPING_THRESHOLD = 999;

function CartPage() {
  const { lines, subtotal, shipping, total, setQty, remove, clear } = useCart();
  const {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addOrderToHistory,
    customerUser,
    loginCustomer,
    logoutCustomer,
  } = useECommerce();
  const submitOrder = useServerFn(placeOrder);

  const [payment, setPayment] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [upiTxnId, setUpiTxnId] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Customer Account Auth States
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  const handleCustomerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authEmail.trim() || !authPhone.trim()) {
      setError("Please fill in your name, email, and mobile phone to sign in.");
      return;
    }
    setError(null);
    loginCustomer({
      name: authName.trim(),
      email: authEmail.trim(),
      phone: authPhone.trim(),
    });
  };

  // Free shipping meter
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=${UPI_ID}&pn=Kiana Naturopathy&am=${finalTotal}&cu=INR`
  )}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!customerUser) {
      setError("Customer Sign-In Required! Please sign in or create your customer account above to place your order.");
      return;
    }

    if (payment === "upi" && !upiTxnId.trim()) {
      setError("Please enter the 12-digit UPI Reference / UTR Transaction ID after completing payment.");
      return;
    }

    setBusy(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const phone = String(form.get("phone") ?? "");
    const email = String(form.get("email") ?? "");
    const address = String(form.get("address") ?? "");
    const city = String(form.get("city") ?? "");
    const pincode = String(form.get("pincode") ?? "");
    const notes = String(form.get("notes") ?? "");

    try {
      const serverRes = await submitOrder({
        data: {
          name,
          phone,
          email,
          address,
          city,
          pincode,
          preferredItems: String(form.get("preferred_items") ?? ""),
          notes: notes + (payment === "upi" ? ` | UPI UTR: ${upiTxnId}` : ""),
          paymentMethod: payment === "cod" ? "cod" : "upi",
          items: lines.map((line) => ({ slug: line.slug, qty: line.qty })),
        },
      });

      const orderRecord: OrderRecord = {
        id: "ord_" + Date.now(),
        orderNumber: serverRes.orderNumber,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        items: lines.map((l) => ({ slug: l.slug, name: l.name, price: l.price, qty: l.qty, image: l.image })),
        subtotal,
        discount: discountAmount,
        shipping: finalShipping,
        total: finalTotal,
        status: "Order Placed",
        paymentMethod: payment === "cod" ? "cod" : payment === "card" ? "card" : "upi",
        address: `${address}, ${city} ${pincode}`,
        customerName: name,
        phone,
      };

      addOrderToHistory(orderRecord);
      setPlacedOrder(orderRecord);
      loginCustomer({
        name,
        email,
        phone,
        address: `${address}, ${city} ${pincode}`,
        city,
        pincode,
      });



      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place the order. Please try again.");
    } finally {
      setBusy(false);
    }
  }


  // Order Confirmed Receipt View
  if (placedOrder) {
    return (
      <>
        <PageHead eyebrow="Order Confirmed 🎉" title={`Thank You, ${placedOrder.customerName}!`} />
        <section style={{ padding: "40px 0 80px" }}>
          <div className="wrap" style={{ maxWidth: 720 }}>
            <div className="card order-receipt-card">
              <div className="receipt-success-badge">
                <span>✓</span>
              </div>
              <h2>Order #{placedOrder.orderNumber} Placed Successfully!</h2>
              <p className="lead" style={{ fontSize: "1rem", margin: "10px 0 16px" }}>
                We have received your order of <strong>{formatINR(placedOrder.total)}</strong>. Our team will process and dispatch your shipment shortly!
              </p>

              {/* Payment Verification Status Box */}
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #10B981",
                  borderRadius: 12,
                  padding: "14px 20px",
                  margin: "16px 0",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: "1.2rem" }}>✅</span>
                  <strong style={{ fontSize: "1rem", color: "#065F46" }}>
                    {placedOrder.paymentMethod === "cod"
                      ? "Cash on Delivery Order Confirmed"
                      : "Online Payment Reference Received & Verified ✓"}
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: ".86rem", color: "#047857" }}>
                  {placedOrder.paymentMethod === "cod"
                    ? "Payment will be collected by courier partner upon delivery."
                    : "Payment reference recorded. Confirmation receipt emailed to you and sent to kianaturopathy@gmail.com for fulfillment!"}
                </p>
              </div>

              {/* Order Tracking Progress Bar */}
              <div className="tracking-progress-box" style={{ margin: "24px 0" }}>
                <h4>Live Order Status</h4>
                <div className="tracking-steps">
                  <div className="track-step active">
                    <span className="dot" />
                    <span>Order Placed</span>
                  </div>
                  <div className="track-step">
                    <span className="dot" />
                    <span>Packed</span>
                  </div>
                  <div className="track-step">
                    <span className="dot" />
                    <span>In Transit</span>
                  </div>
                  <div className="track-step">
                    <span className="dot" />
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Items Summary Table */}
              <div className="receipt-items-list">
                <h3>Order Items</h3>
                {placedOrder.items.map((item) => (
                  <div className="receipt-item-row" key={item.slug}>
                    <img src={item.image} alt={item.name} width={50} height={50} style={{ borderRadius: 6 }} />
                    <div style={{ flex: 1, textAlign: "left", paddingLeft: 12 }}>
                      <strong>{item.name}</strong>
                      <div className="muted" style={{ fontSize: ".84rem" }}>
                        {formatINR(item.price)} × {item.qty}
                      </div>
                    </div>
                    <strong>{formatINR(item.price * item.qty)}</strong>
                  </div>
                ))}
              </div>

              <div className="receipt-totals-box">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatINR(placedOrder.subtotal)}</span>
                </div>
                {placedOrder.discount > 0 && (
                  <div className="summary-row text-success">
                    <span>Discount:</span>
                    <span>-{formatINR(placedOrder.discount)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{placedOrder.shipping === 0 ? "FREE" : formatINR(placedOrder.shipping)}</span>
                </div>
                <div className="summary-row final-total-row">
                  <span>Total Paid ({placedOrder.paymentMethod.toUpperCase()}):</span>
                  <span className="price">{formatINR(placedOrder.total)}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
                <Link className="btn btn-primary" to="/account">
                  View Order in My Account →
                </Link>
                <a
                  className="btn btn-outline"
                  href={`mailto:${customerUser?.email || ""}?subject=${encodeURIComponent(`Order Confirmation #${placedOrder.orderNumber} — Kiana Naturopathy`)}&body=${encodeURIComponent(`Dear ${placedOrder.customerName},\n\nThank you for your order #${placedOrder.orderNumber} with Kiana Naturopathy!\n\nORDER SUMMARY:\n${placedOrder.items.map((i) => `• ${i.name} x${i.qty} - ₹${i.price * i.qty}`).join("\n")}\n\nTotal Amount: ₹${placedOrder.total} (${placedOrder.paymentMethod.toUpperCase()})\nDelivery Address: ${placedOrder.address}\n\nTrack your live shipment status anytime at: https://kiananaturopathy.in/account\n\nWarm regards,\nKiana Naturopathy Team`)}`}
                >
                  📩 Email Copy of Receipt
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
                          <h3 style={{ margin: 0, color: "var(--emerald-900)" }}>Step 1: Customer Account Sign-In / Register Required</h3>
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

                        <div className="row2">
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
                          <div className="field">
                            <label>Account Password *</label>
                            <input
                              type="password"
                              required
                              placeholder="Create or enter password..."
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                            />
                          </div>
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

                  {/* Delivery & Payment Form */}
                  <div className="card" style={!customerUser ? { opacity: 0.6, pointerEvents: "none" } : {}}>
                    <h3>Step 2: Shipping Address &amp; Delivery Details</h3>
                    <form onSubmit={handleSubmit} id="checkout-form">
                      <div className="field">
                        <label htmlFor="o-name">Full Name *</label>
                        <input id="o-name" name="name" required key={customerUser?.name} defaultValue={customerUser?.name || ""} placeholder="e.g. Chinmay Deshmukh" />
                      </div>

                      <div className="row2">
                        <div className="field">
                          <label htmlFor="o-phone">Mobile Phone (For Order Updates) *</label>
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
                          <input id="o-city" name="city" required placeholder="Pune" />
                        </div>
                        <div className="field">
                          <label htmlFor="o-pin">6-Digit PIN Code *</label>
                          <input id="o-pin" name="pincode" required placeholder="411005" maxLength={6} />
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="o-notes">Special Instructions or Health Notes</label>
                        <input id="o-notes" name="notes" placeholder="e.g. Leave package with security guard" />
                      </div>

                      {/* Payment Method Selector Tabs */}
                      <div className="field" style={{ marginTop: 24 }}>
                        <label style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                          Select Payment Method *
                        </label>

                        <div className="payment-method-tabs" style={{ marginTop: 10 }}>
                          <button
                            type="button"
                            className={`payment-tab ${payment === "upi" ? "active" : ""}`}
                            onClick={() => setPayment("upi")}
                          >
                            📲 GPay / PhonePe / UPI
                          </button>

                          <button
                            type="button"
                            className={`payment-tab ${payment === "card" ? "active" : ""}`}
                            onClick={() => setPayment("card")}
                          >
                            💳 Credit / Debit Card
                          </button>

                          <button
                            type="button"
                            className={`payment-tab ${payment === "cod" ? "active" : ""}`}
                            onClick={() => setPayment("cod")}
                          >
                            💵 Cash on Delivery
                          </button>
                        </div>

                        {/* UPI Payment Box */}
                        {payment === "upi" && (
                          <div className="payment-details-box card">
                            <h4>Scan UPI QR Code with GPay, PhonePe, Paytm, or BHIM</h4>
                            <div className="qr-container">
                              <img
                                src={qrUrl}
                                alt="UPI QR code to pay Kiana Naturopathy"
                                width={200}
                                height={200}
                                className="qr-code-img"
                              />
                              <p className="upi-id-text">
                                Official UPI VPA: <strong>{UPI_ID}</strong>
                              </p>
                              <span className="price" style={{ fontSize: "1.2rem", color: "var(--brand)" }}>
                                Amount: {formatINR(finalTotal)}
                              </span>
                            </div>

                            <div className="field" style={{ marginTop: 14 }}>
                              <label htmlFor="upi-txnid">
                                Enter 12-Digit UPI Reference / UTR Transaction ID *
                              </label>
                              <input
                                id="upi-txnid"
                                placeholder="e.g. 324190854210"
                                value={upiTxnId}
                                onChange={(e) => setUpiTxnId(e.target.value)}
                              />
                              <p className="muted" style={{ fontSize: ".8rem", marginTop: 4 }}>
                                Find the 12-digit UTR/Ref No. in your UPI app payment receipt.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Card Payment Box */}
                        {payment === "card" && (
                          <div className="payment-details-box card">
                            <h4>Enter Card Information (256-Bit SSL Encrypted)</h4>
                            <div className="field">
                              <label>Cardholder Name</label>
                              <input
                                placeholder="Name as printed on card"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                              />
                            </div>
                            <div className="field">
                              <label>Card Number</label>
                              <input
                                placeholder="4532 •••• •••• 8910"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                            </div>
                            <div className="row2">
                              <div className="field">
                                <label>Expiry Date</label>
                                <input
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                />
                              </div>
                              <div className="field">
                                <label>CVV / CVC</label>
                                <input
                                  type="password"
                                  placeholder="123"
                                  maxLength={4}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* COD Box */}
                        {payment === "cod" && (
                          <div className="payment-details-box card">
                            <h4>Cash on Delivery (COD)</h4>
                            <p className="muted" style={{ fontSize: ".9rem", margin: 0 }}>
                              Pay with cash or UPI QR to the delivery partner when your package arrives.
                            </p>
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="notice" style={{ marginBottom: 14 }}>
                          {error}
                        </div>
                      )}

                      <button
                        className="btn btn-primary btn-block btn-lg"
                        type="submit"
                        disabled={busy}
                        style={{ marginTop: 20 }}
                      >
                        {busy ? "Placing Order..." : `Complete Order (${formatINR(finalTotal)}) →`}
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

                    <div className="trust-checkout-badges">
                      <div>🛡️ 100% Purchase Guarantee</div>
                      <div>⚡ 3–6 Working Days Delivery</div>
                      <div>🔄 Easy Returns &amp; Replacement</div>
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
