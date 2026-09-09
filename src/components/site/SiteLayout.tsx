import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";
import { RemedyQuizModal } from "../ecommerce/RemedyQuizModal";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "🎨 Custom Combos" },
  { to: "/naturopathy", label: "Naturopathy" },
  { to: "/conditions", label: "Conditions" },
  { to: "/blog", label: "Blog" },
  { to: "/testimonials", label: "Reviews" },
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQ" },
] as const;

export const DISCLAIMER =
  "Naturopathy supports overall wellness and complements a healthy lifestyle. Our programmes are not a replacement for medical diagnosis or prescribed treatment — please continue care with your treating doctor.";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const { count } = useCart();
  const { wishlistCount, setIsCartDrawerOpen, setIsSearchOpen, setIsBookingOpen, darkMode, toggleDarkMode } =
    useECommerce();

  return (
    <div className="site-body">
      {/* Top Ticker Bar */}
      <div className="top-announcement-bar">
        <span>
          🌿 <strong>FREE Shipping</strong> on all orders over ₹999 | Use Code <strong>KIANA10</strong> for 10% OFF!
        </span>
      </div>

      <header className="site">
        <div className="wrap bar">
          <Link className="brand" to="/">
            <span className="leaf">🌿</span> Kiana Naturopathy
          </Link>

          {/* Desktop Navigation & Mobile Fullscreen Overlay Nav */}
          <nav className={`main ${open ? "open" : ""}`}>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "active" }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mobile-only-drawer-actions">
              <button className="btn btn-gold btn-block" onClick={() => { setOpen(false); setIsBookingOpen(true); }}>
                🩺 Book Doctor Consultation
              </button>
              <a href="tel:+919876543210" className="btn btn-light btn-block" style={{ marginTop: 8 }}>
                📞 Call Helpline: +91 98765 43210
              </a>
            </div>
          </nav>

          <div className="head-actions" style={{ marginLeft: "auto" }}>
            {/* Dark Mode Toggle */}
            <button
              className="head-icon-btn"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Search Trigger */}
            <button
              className="head-icon-btn"
              onClick={() => setIsSearchOpen(true)}
              title="Search products"
              aria-label="Search products"
            >
              🔍
            </button>

            {/* Wishlist Link */}
            <Link
              className="head-icon-btn"
              to="/wishlist"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              🤍 {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
            </Link>

            {/* Account Link */}
            <Link
              className="head-icon-btn"
              to="/account"
              title="My Account & Orders"
              aria-label="Account"
            >
              👤
            </Link>

            {/* Book Doctor (Desktop) */}
            <button
              className="btn btn-gold btn-sm desktop-only-btn"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Doctor 🩺
            </button>

            {/* Cart Trigger */}
            <button
              className="cart-link"
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Open cart drawer"
            >
              🛒 <span className="cart-text">Cart</span> {count > 0 && <span className="cart-count">{count}</span>}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button className="menu-btn" aria-label="Toggle Menu" onClick={() => setOpen((v) => !v)}>
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Mobile Sticky Bottom Dock (Thumb-friendly 1-click access) */}
      <nav className="mobile-bottom-dock" aria-label="Mobile Navigation">
        <Link to="/" className="mobile-dock-item" activeOptions={{ exact: true }} activeProps={{ className: "mobile-dock-item active" }}>
          <span className="mobile-dock-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/shop" className="mobile-dock-item" activeProps={{ className: "mobile-dock-item active" }}>
          <span className="mobile-dock-icon">🌿</span>
          <span>Shop</span>
        </Link>
        <button type="button" className="mobile-dock-item" onClick={() => setIsSearchOpen(true)}>
          <span className="mobile-dock-icon">🔍</span>
          <span>Search</span>
        </button>
        <button type="button" className="mobile-dock-item" onClick={() => setIsCartDrawerOpen(true)}>
          <span className="mobile-dock-icon">
            🛒 {count > 0 && <span className="mobile-dock-badge">{count}</span>}
          </span>
          <span>Cart</span>
        </button>
        <Link to="/account" className="mobile-dock-item" activeProps={{ className: "mobile-dock-item active" }}>
          <span className="mobile-dock-icon">👤</span>
          <span>Account</span>
        </Link>
      </nav>

      {/* Floating WhatsApp CTA */}
      <a
        className="wa-float"
        href="https://wa.me/919876543210?text=Hello%20Kiana%20Naturopathy%2C%20I%20have%20a%20question%20about%20your%20products."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat with Naturopath on WhatsApp"
      >
        💬
      </a>

      {/* Footer */}
      <footer className="site">
        <div className="wrap">
          <div className="cols">
            <div>
              <h4>Kiana Naturopathy &amp; Wellness Centre</h4>
              <p style={{ fontSize: ".92rem" }}>
                Pure, practitioner-selected herbal supplements, teas, essential oils, and drug-free naturopathic health protocols.
              </p>
              <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="trust-badge-pill">🔒 100% Secure Checkout</span>
                <span className="trust-badge-pill">🚚 Pan-India Shipping</span>
                <span className="trust-badge-pill">🌿 GMP &amp; Ayush Standards</span>
              </div>
            </div>

            <div>
              <h4>E-Commerce Shop</h4>
              <ul>
                <li><Link to="/shop">Browse All Products</Link></li>
                <li><Link to="/wishlist">My Saved Wishlist</Link></li>
                <li><Link to="/cart">Cart &amp; Checkout</Link></li>
                <li><Link to="/account">My Orders &amp; Receipts</Link></li>
                <li>
                  <button className="btn-link-footer" onClick={() => setIsQuizOpen(true)}>
                    Remedy Finder Quiz
                  </button>
                </li>
                <li>
                  <button className="btn-link-footer" onClick={() => setIsBookingOpen(true)}>
                    Book Clinic Consultation
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4>Naturopathy &amp; Care</h4>
              <ul>
                <li><Link to="/naturopathy">Naturopathy Principles</Link></li>
                <li><Link to="/conditions">Conditions We Support</Link></li>
                <li><Link to="/blog">Wellness Blog</Link></li>
                <li><Link to="/testimonials">Client Reviews</Link></li>
                <li><Link to="/about">About Our Clinic</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4>Visit &amp; Contact Us</h4>
              <p style={{ fontSize: ".92rem" }}>
                2nd Floor, Green Leaf Arcade, FC Road, Shivajinagar, Pune 411005
                <br />
                Mon – Sat, 8:00 am – 7:00 pm
              </p>
              <p style={{ fontSize: ".92rem" }}>
                <a href="tel:+919876543210">+91 98765 43210</a>
                <br />
                <a href="mailto:kianaturopathy@gmail.com">kianaturopathy@gmail.com</a>
              </p>
            </div>
          </div>

          <p
            className="notice"
            style={{
              marginTop: 28,
              background: "rgba(255,255,255,.07)",
              color: "rgba(255,255,255,.75)",
              borderColor: "var(--gold-500)",
            }}
          >
            {DISCLAIMER}
          </p>

          <div className="legal">
            <span>© {new Date().getFullYear()} Kiana Naturopathy &amp; Wellness Centre. All rights reserved.</span>
            <span>Accepted Payments: GPay, PhonePe, Paytm, Cards, Net Banking, COD</span>
          </div>
        </div>
      </footer>

      {/* Remedy Quiz Modal */}
      <RemedyQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="page-head">
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  );
}
