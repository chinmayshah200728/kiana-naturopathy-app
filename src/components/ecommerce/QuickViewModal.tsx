import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Stars } from "@/components/site/ProductCard";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, isInWishlist, toggleWishlist, setIsCartDrawerOpen } =
    useECommerce();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isInWishlist(product.slug);

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-icon modal-close-btn"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="quickview-grid">
          <div className="quickview-media">
            <img src={product.image} alt={product.name} className="quickview-img" />
            <div className="quickview-badges">
              {product.bestseller && <span className="badge badge-gold">Bestseller</span>}
              {product.organic && <span className="badge badge-green">100% Pure &amp; Natural</span>}
              {product.isNew && <span className="badge badge-accent">New</span>}
            </div>
          </div>

          <div className="quickview-details">
            <span className="tag">{product.category}</span>
            <h2>{product.name}</h2>
            <div style={{ margin: "8px 0" }}>
              <Stars rating={product.rating} reviews={product.reviewsCount} />
            </div>

            <div className="quickview-price-row">
              <span className="price">{formatINR(product.price)}</span>
              {product.comparePrice && <s className="compare-price">{formatINR(product.comparePrice)}</s>}
              {product.comparePrice && (
                <span className="discount-pill">
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="lead" style={{ fontSize: ".95rem", margin: "12px 0" }}>
              {product.short}
            </p>

            {product.benefits && product.benefits.length > 0 && (
              <div className="quickview-benefits">
                <strong>Key Benefits:</strong>
                <ul>
                  {product.benefits.slice(0, 3).map((b, i) => (
                    <li key={i}>✓ {b}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="quickview-actions-row">
              <div className="qty-picker">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="qty-val">{qty}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  add(
                    {
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    },
                    qty
                  );
                  setQuickViewProduct(null);
                  setIsCartDrawerOpen(true);
                }}
              >
                Add to Cart 🛒
              </button>

              <button
                type="button"
                className={`btn-icon btn-wishlist ${wishlisted ? "active" : ""}`}
                onClick={() => toggleWishlist(product.slug)}
                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlisted ? "❤️" : "🤍"}
              </button>
            </div>

            <div className="quickview-footer-link">
              <Link
                to="/shop/$slug"
                params={{ slug: product.slug }}
                onClick={() => setQuickViewProduct(null)}
              >
                View Full Product Details &amp; Reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
