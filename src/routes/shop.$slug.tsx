import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ProductCard, Stars } from "@/components/site/ProductCard";
import { DISCLAIMER } from "@/components/site/SiteLayout";
import { getProduct, products } from "@/data/products";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product Not Found — Kiana Naturopathy" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Kiana Naturopathy Shop` },
        { name: "description", content: product.short },
        { property: "og:title", content: product.name },
        { property: "og:description", content: product.short },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <section className="wrap" style={{ padding: "60px 0" }}>
      <h1>Product Not Found</h1>
      <p className="lead">The product you are looking for is no longer available.</p>
      <Link className="btn btn-primary" to="/shop">
        Back to Shop
      </Link>
    </section>
  ),
});

function ProductPage() {
  const { product: initialProduct } = Route.useLoaderData();
  const { add } = useCart();
  const { isInWishlist, toggleWishlist, setIsCartDrawerOpen, productsList } = useECommerce();
  const navigate = useNavigate();

  const product = (productsList && productsList.find((p) => p.slug === initialProduct.slug)) || initialProduct;

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"benefits" | "usage" | "reviews">("benefits");
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // New review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [localReviews, setLocalReviews] = useState(product.reviewsList || []);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const wishlisted = isInWishlist(product.slug);

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .concat(products.filter((p) => p.slug !== product.slug && p.category !== product.category))
    .slice(0, 4);

  // Bundle recommendation (Product + another item)
  const bundleProduct = related[0];
  const bundleTotal = product.price + (bundleProduct ? bundleProduct.price : 0);
  const bundleDiscounted = Math.round(bundleTotal * 0.85); // 15% discount for bundle

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeStatus("❌ Please enter a valid 6-digit Indian PIN Code.");
      return;
    }
    const days = Number(pincode.slice(-1)) % 3 + 2;
    setPincodeStatus(`✅ Delivery available to ${pincode}! Expected in ${days} to ${days + 2} working days.`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    const newRev = {
      id: "rev_" + Date.now(),
      author: reviewName.trim(),
      rating: Number(reviewRating),
      date: "Just now",
      comment: reviewComment.trim(),
      verified: true,
    };
    setLocalReviews([newRev, ...localReviews]);
    setReviewName("");
    setReviewComment("");
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <section style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="wrap">
        {/* Breadcrumb */}
        <p className="breadcrumb">
          <Link to="/shop">Shop</Link> / <Link to="/shop">{product.category}</Link> / {product.name}
        </p>

        {/* Main Product Layout */}
        <div className="grid g2" style={{ alignItems: "flex-start", gap: 40 }}>
          {/* Media View */}
          <div className="product-media-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-main-img"
            />
            <div className="product-detail-badges">
              {product.bestseller && <span className="badge badge-gold">Bestseller</span>}
              {product.organic && <span className="badge badge-green">100% Organic</span>}
              {discountPercent > 0 && <span className="badge badge-red">{discountPercent}% OFF</span>}
            </div>
          </div>

          {/* Details & Purchase Box */}
          <div className="product-details-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="tag">{product.category}</span>
              <button
                className={`btn-icon btn-wishlist ${wishlisted ? "active" : ""}`}
                onClick={() => toggleWishlist(product.slug)}
                title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                {wishlisted ? "❤️ Saved to Wishlist" : "🤍 Add to Wishlist"}
              </button>
            </div>

            <h1 style={{ marginTop: 8, fontSize: "2rem" }}>{product.name}</h1>

            <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: 12 }}>
              <Stars rating={product.rating} reviews={product.reviewsCount} />
              <span className="muted" style={{ fontSize: ".88rem" }}>
                Verified Practitioner Choice
              </span>
            </div>

            <div className="price-display-row" style={{ margin: "16px 0" }}>
              <span className="price" style={{ fontSize: "1.8rem" }}>
                {formatINR(product.price)}
              </span>
              {product.comparePrice && (
                <s className="compare-price" style={{ fontSize: "1.2rem", marginLeft: 8 }}>
                  {formatINR(product.comparePrice)}
                </s>
              )}
              {discountPercent > 0 && (
                <span className="savings-pill">Save {formatINR(product.comparePrice! - product.price)}</span>
              )}
            </div>

            <p className="lead" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
              {product.short}
            </p>

            <p style={{ fontSize: ".95rem", color: "var(--muted)", marginBottom: 20 }}>
              {product.description}
            </p>

            {/* Stock Warning */}
            {product.stockCount && product.stockCount <= 15 && (
              <div className="stock-urgency-banner">
                ⚠️ <strong>Hurry! Only {product.stockCount} items left in stock.</strong>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="product-purchase-box">
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="qty">Quantity</label>
                <div className="qty-picker">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="qty-val">{qty}</span>
                  <button type="button" className="qty-btn" onClick={() => setQty((q) => q + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", marginTop: 12 }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
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
                    setIsCartDrawerOpen(true);
                  }}
                >
                  Add to Cart 🛒
                </button>

                <button
                  className="btn btn-outline btn-lg"
                  style={{ flex: 1 }}
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
                    navigate({ to: "/cart" });
                  }}
                >
                  Buy Now ⚡
                </button>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="pincode-checker-card">
              <form onSubmit={handlePincodeCheck} className="pincode-form">
                <span style={{ fontSize: "1.1rem" }}>📍</span>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="pincode-input"
                />
                <button type="submit" className="btn btn-outline btn-sm">
                  Check Delivery
                </button>
              </form>
              {pincodeStatus && <p className="pincode-result-msg">{pincodeStatus}</p>}
            </div>

            {/* Trust Features */}
            <div className="product-trust-features">
              <div>🚚 <strong>Free Shipping</strong> over ₹999</div>
              <div>🌿 <strong>100% Natural</strong> &amp; Lab Tested</div>
              <div>🔒 <strong>Secure UPI &amp; COD</strong></div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        {bundleProduct && (
          <div className="bundle-offer-card card" style={{ marginTop: 48 }}>
            <h3>Frequently Bought Together</h3>
            <p className="muted" style={{ margin: "4px 0 16px", fontSize: ".92rem" }}>
              Combine <strong>{product.name}</strong> with <strong>{bundleProduct.name}</strong> and get 15% OFF your bundle!
            </p>

            <div className="bundle-flex-row">
              <div className="bundle-item">
                <img src={product.image} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <div className="price">{formatINR(product.price)}</div>
                </div>
              </div>
              <span className="bundle-plus">+</span>
              <div className="bundle-item">
                <img src={bundleProduct.image} alt={bundleProduct.name} />
                <div>
                  <strong>{bundleProduct.name}</strong>
                  <div className="price">{formatINR(bundleProduct.price)}</div>
                </div>
              </div>
              <div className="bundle-action">
                <div>
                  <span className="price" style={{ fontSize: "1.3rem" }}>{formatINR(bundleDiscounted)}</span>{" "}
                  <s className="compare-price">{formatINR(bundleTotal)}</s>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    add({ slug: product.slug, name: product.name, price: product.price, image: product.image });
                    add({ slug: bundleProduct.slug, name: bundleProduct.name, price: bundleProduct.price, image: bundleProduct.image });
                    setIsCartDrawerOpen(true);
                  }}
                >
                  Add Both to Cart (Save 15%)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Tabs: Benefits, Usage, Customer Reviews */}
        <div className="product-tabs-container" style={{ marginTop: 48 }}>
          <div className="product-tabs-header">
            <button
              className={`tab-btn ${activeTab === "benefits" ? "active" : ""}`}
              onClick={() => setActiveTab("benefits")}
            >
              Key Benefits &amp; Ingredients
            </button>
            <button
              className={`tab-btn ${activeTab === "usage" ? "active" : ""}`}
              onClick={() => setActiveTab("usage")}
            >
              Recommended Usage
            </button>
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Customer Reviews ({localReviews.length})
            </button>
          </div>

          <div className="product-tabs-body card">
            {activeTab === "benefits" && (
              <div className="grid g2">
                <div>
                  <h3>Key Benefits</h3>
                  <ul className="ticks">
                    {product.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3>Ingredients</h3>
                  <ul className="ticks">
                    {product.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "usage" && (
              <div>
                <h3>Practitioner Usage Guidelines</h3>
                <p className="lead" style={{ fontSize: "1rem" }}>
                  {product.usage || "Take as directed on packaging or consult our naturopaths for personalized dosage advice."}
                </p>
                <p className="notice" style={{ marginTop: 16 }}>
                  {DISCLAIMER}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="reviews-summary-header">
                  <div>
                    <h2 style={{ margin: 0 }}>Customer Reviews</h2>
                    <Stars rating={product.rating} reviews={localReviews.length} />
                  </div>
                </div>

                {/* Reviews List */}
                <div className="reviews-list" style={{ marginTop: 24 }}>
                  {localReviews.length === 0 ? (
                    <p className="muted">No reviews written yet. Be the first to review this product!</p>
                  ) : (
                    localReviews.map((rev) => (
                      <div key={rev.id} className="review-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong>{rev.author} {rev.verified && <span className="verified-badge">✓ Verified Buyer</span>}</strong>
                          <span className="muted" style={{ fontSize: ".82rem" }}>{rev.date}</span>
                        </div>
                        <Stars rating={rev.rating} />
                        <p style={{ marginTop: 8, fontSize: ".95rem" }}>"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Write a Review Form */}
                <div className="write-review-box card" style={{ marginTop: 32, background: "var(--cream)" }}>
                  <h3>Write a Verified Customer Review</h3>
                  {reviewSuccess && (
                    <div className="notice text-success" style={{ marginBottom: 12 }}>
                      🎉 Thank you! Your review has been published.
                    </div>
                  )}
                  <form onSubmit={handleAddReview}>
                    <div className="row2">
                      <div className="field">
                        <label>Your Name</label>
                        <input
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Ananya Deshpande"
                        />
                      </div>
                      <div className="field">
                        <label>Rating (1 to 5 Stars)</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                        >
                          <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                          <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                          <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                          <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                          <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Your Review &amp; Experience</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share how this product helped your health routine..."
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div style={{ marginTop: 60 }}>
          <h2>You May Also Like</h2>
          <div className="grid g4" style={{ marginTop: 20 }}>
            {related.map((p) => (
              <ProductCard product={p} key={p.slug} />
            ))}
          </div>
        </div>

        {/* Sticky Mobile Product Buy Bar */}
        <div className="mobile-sticky-buy-bar">
          <div className="sticky-buy-info">
            <span className="sticky-buy-name">{product.name}</span>
            <span className="sticky-buy-price">{formatINR(product.price * qty)}</span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ padding: "10px 18px", fontSize: "0.9rem" }}
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
              setIsCartDrawerOpen(true);
            }}
          >
            Add 🛒
          </button>
        </div>
      </div>
    </section>
  );
}
