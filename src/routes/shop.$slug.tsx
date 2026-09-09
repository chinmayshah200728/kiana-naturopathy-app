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
  const { isInWishlist, toggleWishlist, setIsCartDrawerOpen, productsList, reviewsMap, addReview } = useECommerce();
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
  const [reviewPhoto, setReviewPhoto] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Combine initial product reviews with customer persisted reviews from reviewsMap
  const persistedReviews = useMemo(() => reviewsMap[product.slug] || [], [reviewsMap, product.slug]);
  const allReviews = useMemo(() => {
    const defaultRevs = product.reviewsList || [];
    return [...persistedReviews, ...defaultRevs];
  }, [persistedReviews, product.reviewsList]);

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
    const daysToAdd = Number(pincode.slice(-1)) % 2 === 0 ? 2 : 3;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + daysToAdd);
    const dateStr = estDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
    setPincodeStatus(`🚚 Delivers to PIN ${pincode} by ${dateStr} (Express Air Courier | Cash on Delivery Available)`);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    const newRev = {
      id: "rev_" + Date.now(),
      author: reviewName.trim(),
      rating: Number(reviewRating),
      date: "Just now",
      comment: reviewComment.trim(),
      verified: true,
      photo: reviewPhoto || undefined,
    };
    addReview(product.slug, newRev);
    setReviewName("");
    setReviewComment("");
    setReviewPhoto("");
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3500);
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
              Customer Reviews ({allReviews.length})
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
                    <Stars rating={product.rating} reviews={allReviews.length} />
                  </div>
                </div>

                {/* Reviews List */}
                <div className="reviews-list" style={{ marginTop: 24 }}>
                  {allReviews.length === 0 ? (
                    <p className="muted">No reviews written yet. Be the first to review this product!</p>
                  ) : (
                    allReviews.map((rev) => (
                      <div key={rev.id} className="review-card" style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong>{rev.author} {rev.verified && <span className="verified-badge">✓ Verified Buyer</span>}</strong>
                          <span className="muted" style={{ fontSize: ".82rem" }}>{rev.date}</span>
                        </div>
                        <Stars rating={rev.rating} />
                        <p style={{ marginTop: 8, fontSize: ".95rem", lineHeight: "1.5" }}>"{rev.comment}"</p>

                        {/* Customer Uploaded Unboxing Photo Thumbnail */}
                        {rev.photo && (
                          <div style={{ marginTop: 10 }}>
                            <img
                              src={rev.photo}
                              alt="Customer product photo"
                              style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8, border: "2px solid var(--line-gold)", cursor: "pointer" }}
                              onClick={() => window.open(rev.photo, "_blank")}
                              title="Click to view full unboxing photo"
                            />
                            <span style={{ display: "block", fontSize: ".76rem", color: "var(--muted)", marginTop: 2 }}>
                              📷 Verified Customer Unboxing Photo
                            </span>
                          </div>
                        )}
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
                  <form onSubmit={handleAddReviewSubmit}>
                    <div className="row2">
                      <div className="field">
                        <label>Your Name *</label>
                        <input
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Ananya Deshpande"
                        />
                      </div>
                      <div className="field">
                        <label>Rating (1 to 5 Stars) *</label>
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
                      <label>Your Review &amp; Health Experience *</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share how this product helped your health routine..."
                      />
                    </div>

                    <div className="field">
                      <label style={{ fontWeight: 700 }}>Upload Unboxing / Product Photo (Optional)</label>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
                        {reviewPhoto ? (
                          <div style={{ position: "relative" }}>
                            <img
                              src={reviewPhoto}
                              alt="Uploaded photo preview"
                              style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8, border: "2px solid var(--line-gold)" }}
                            />
                            <button
                              type="button"
                              style={{ position: "absolute", top: -6, right: -6, background: "#EF4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: "10px", lineHeight: "1" }}
                              onClick={() => setReviewPhoto("")}
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="btn btn-outline btn-sm" style={{ cursor: "pointer", background: "#ffffff" }}>
                            📷 Choose Photo File...
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    if (evt.target?.result) setReviewPhoto(evt.target.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                        <span className="muted" style={{ fontSize: ".82rem" }}>
                          {reviewPhoto ? "✓ Photo attached!" : "Add a photo of your package or unboxing."}
                        </span>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>
                      Submit Verified Review
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
