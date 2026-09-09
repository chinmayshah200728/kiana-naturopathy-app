import { Link, useNavigate } from "@tanstack/react-router";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

const FREE_SHIPPING_THRESHOLD = 999;

export function CartDrawer() {
  const { isCartDrawerOpen, setIsCartDrawerOpen, appliedCoupon, applyCoupon, removeCoupon } =
    useECommerce();
  const { lines, subtotal, shipping, total, setQty, remove } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  // Shipping progress calculation
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Calculate discount if coupon applied
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount > 0) {
      discountAmount = Math.min(subtotal, appliedCoupon.flatDiscount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + (appliedCoupon?.freeShipping ? 0 : shipping));

  return (
    <div className="cart-drawer-backdrop" onClick={() => setIsCartDrawerOpen(false)}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="cart-drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.3rem" }}>🛒</span>
            <h2>Your Shopping Cart ({lines.reduce((acc, item) => acc + item.qty, 0)})</h2>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        {/* Free Shipping Meter */}
        <div className="shipping-meter">
          {amountNeededForFreeShipping > 0 ? (
            <p>
              Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more to get{" "}
              <strong className="text-primary">FREE Shipping!</strong>
            </p>
          ) : (
            <p className="unlocked-text">🎉 Congratulations! You unlocked <strong>FREE Shipping!</strong></p>
          )}
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-body">
          {lines.length === 0 ? (
            <div className="cart-empty-state">
              <span className="empty-icon">🌱</span>
              <h3>Your cart is empty</h3>
              <p>Explore our natural remedies and practitioner-selected shop!</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate({ to: "/shop" });
                }}
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <ul className="cart-drawer-list">
              {lines.map((item) => (
                <li key={item.slug} className="cart-drawer-item">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                  <div className="cart-item-info">
                    <Link
                      to="/shop/$slug"
                      params={{ slug: item.slug }}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="cart-item-name"
                    >
                      {item.name}
                    </Link>
                    <div className="cart-item-price">{formatINR(item.price)}</div>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => setQty(item.slug, item.qty + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="cart-item-line-total">
                      {formatINR(item.price * item.qty)}
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => remove(item.slug)}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer & Checkout */}
        {lines.length > 0 && (
          <footer className="cart-drawer-footer">
            {/* Promo Code Box */}
            <div className="coupon-box">
              {appliedCoupon ? (
                <div className="coupon-applied-badge">
                  <span>
                    🏷️ Coupon <strong>{appliedCoupon.code}</strong> applied!
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
                    placeholder="Promo Code (e.g. KIANA10)"
                    className="coupon-input"
                  />
                  <button type="submit" className="btn btn-outline btn-sm">
                    Apply
                  </button>
                </form>
              )}
            </div>

            <div className="cart-summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row text-success">
                  <span>Coupon Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {appliedCoupon?.freeShipping || shipping === 0 ? (
                    <strong className="text-success">FREE</strong>
                  ) : (
                    formatINR(shipping)
                  )}
                </span>
              </div>
              <div className="summary-row final-total-row">
                <span>Total Payable</span>
                <span className="price">{formatINR(finalTotal)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={() => {
                setIsCartDrawerOpen(false);
                navigate({ to: "/cart" });
              }}
            >
              Proceed to Checkout →
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
