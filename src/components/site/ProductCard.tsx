import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const full = Math.round(rating);
  return (
    <span className="stars">
      {"★".repeat(full)}
      {"☆".repeat(Math.max(0, 5 - full))}{" "}
      {reviews !== undefined && <span className="muted">({reviews})</span>}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { isInWishlist, toggleWishlist, setQuickViewProduct, setIsCartDrawerOpen } = useECommerce();

  const wishlisted = isInWishlist(product.slug);

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <article className="product-card">
      <div className="thumb-container">
        <Link className="thumb" to="/shop/$slug" params={{ slug: product.slug }}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {/* Product Badges */}
        <div className="card-badges">
          {!product.inStock && <span className="badge" style={{ background: "#DC2626", color: "#fff", fontWeight: 700 }}>Out of Stock</span>}
          {product.inStock && product.bestseller && <span className="badge badge-gold">Bestseller</span>}
          {product.inStock && product.organic && <span className="badge badge-green">Pure &amp; Natural</span>}
          {product.inStock && discountPercent > 0 && <span className="badge badge-red">{discountPercent}% OFF</span>}
        </div>

        {/* Wishlist Button Overlay */}
        <button
          className={`card-wishlist-btn ${wishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        {/* Quick View Hover Button */}
        <button
          className="card-quickview-btn"
          onClick={() => setQuickViewProduct(product)}
        >
          🔍 Quick View
        </button>
      </div>

      <div className="body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="tag">{product.category}</span>
          {!product.inStock ? (
            <span className="stock-warning" style={{ color: "#DC2626", fontWeight: 700 }}>Out of Stock</span>
          ) : product.stockCount && product.stockCount <= 10 ? (
            <span className="stock-warning">Only {product.stockCount} left</span>
          ) : null}
        </div>

        <Link className="name" to="/shop/$slug" params={{ slug: product.slug }}>
          {product.name}
        </Link>
        
        <Stars rating={product.rating} reviews={product.reviewsCount} />
        
        <p className="muted card-short-desc">
          {product.short}
        </p>

        <div className="card-footer">
          <div className="price-box">
            <span className="price">{formatINR(product.price)}</span>
            {product.comparePrice && <s className="compare-price">{formatINR(product.comparePrice)}</s>}
          </div>
          
          <button
            className="btn btn-primary btn-sm"
            disabled={!product.inStock}
            style={!product.inStock ? { opacity: 0.6, cursor: "not-allowed", background: "#9CA3AF" } : {}}
            onClick={() => {
              if (!product.inStock) return;
              add({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              });
              setIsCartDrawerOpen(true);
            }}
          >
            {product.inStock ? "Add 🛒" : "Sold Out"}
          </button>
        </div>
      </div>
    </article>
  );
}
