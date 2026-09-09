import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { PageHead } from "@/components/site/SiteLayout";
import { products } from "@/data/products";
import { HEALTH_BUNDLES } from "@/data/bundles";
import { RemedyQuizModal } from "@/components/ecommerce/RemedyQuizModal";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Wellness Shop — Herbal Supplements, Teas, Oils & Kits | Kiana Naturopathy" },
      {
        name: "description",
        content:
          "Practitioner-selected herbal supplements, teas, essential oils, skin care and detox kits. Free shipping on orders over ₹999.",
      },
      { property: "og:title", content: "Wellness Shop — Kiana Naturopathy" },
      {
        property: "og:description",
        content: "Natural products, honestly described. Free shipping over ₹999.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { productsList, categoriesList, setIsCartDrawerOpen } = useECommerce();
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyOrganic, setOnlyOrganic] = useState<boolean>(false);
  const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [gridCols, setGridCols] = useState<"g4" | "g2">("g4");
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const displayProducts = useMemo(() => productsList || products, [productsList]);
  const activeCategoriesList = useMemo(() => categoriesList.length > 0 ? categoriesList : Array.from(new Set(displayProducts.map(p => p.category))), [categoriesList, displayProducts]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    let list = [...displayProducts];

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (onlyInStock) {
      list = list.filter((p) => p.inStock);
    }

    if (onlyOrganic) {
      list = list.filter((p) => p.organic);
    }

    if (onlyBestsellers) {
      list = list.filter((p) => p.bestseller);
    }

    list = list.filter((p) => p.price <= maxPrice);

    // Sorting
    list.sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "reviews") return b.reviewsCount - a.reviewsCount;
      return Number(b.featured) - Number(a.featured);
    });

    return list;
  }, [
    displayProducts,
    selectedCategory,
    searchQuery,
    sortOption,
    onlyInStock,
    onlyOrganic,
    onlyBestsellers,
    maxPrice,
  ]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortOption("featured");
    setOnlyInStock(false);
    setOnlyOrganic(false);
    setOnlyBestsellers(false);
    setMaxPrice(2000);
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    searchQuery !== "" ||
    onlyInStock ||
    onlyOrganic ||
    onlyBestsellers ||
    maxPrice < 2000;

  return (
    <>
      <PageHead
        eyebrow="Wellness Shop"
        title="Natural remedies, practitioner selected"
        lead="Pure herbal supplements, cold-pressed oils, organic honey, teas, and gentle detox kits. Free shipping on orders over ₹999."
      />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap">
          {/* Curated Health Bundles Showcase (Save 20%) */}
          <div style={{ marginBottom: 44, padding: "28px 32px", background: "var(--cream-100, #FDFBF7)", border: "2px solid var(--line-gold, #E2E8F0)", borderRadius: 16, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-500, #D4AF37)", fontWeight: 700 }}>1-Click Savings Bundles</span>
                <h2 style={{ margin: "4px 0 0", color: "var(--emerald-900, #064E3B)", fontSize: "1.5rem" }}>🔥 Curated Health Bundles (Save 20% OFF)</h2>
              </div>
              <span className="badge badge-gold" style={{ fontSize: ".9rem", padding: "6px 14px" }}>⚡ Limited Time Combos</span>
            </div>

            <div className="grid g3" style={{ gap: 20 }}>
              {HEALTH_BUNDLES.map((bundle) => {
                const rawTotal = bundle.items.reduce((sum, item) => sum + item.price, 0);
                const bundlePrice = Math.round(rawTotal * (1 - bundle.discountPercent / 100));

                return (
                  <div key={bundle.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid var(--line-gold)", background: "#ffffff" }}>
                    <div>
                      <span className="badge badge-green" style={{ marginBottom: 8, display: "inline-block" }}>{bundle.discountPercent}% OFF BUNDLE</span>
                      <h3 style={{ margin: "4px 0 6px", fontSize: "1.1rem" }}>{bundle.title}</h3>
                      <p className="muted" style={{ fontSize: ".84rem", lineHeight: "1.4", margin: "0 0 14px" }}>{bundle.tagline}</p>

                      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        {bundle.items.map((item) => (
                          <div key={item.slug} style={{ textAlign: "center", flex: 1 }}>
                            <img src={item.image} alt={item.name} style={{ width: "100%", height: 50, objectFit: "cover", borderRadius: 6, border: "1px solid var(--line-gold)" }} />
                            <span style={{ fontSize: ".72rem", display: "block", marginTop: 2, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                        <strong className="price" style={{ fontSize: "1.25rem" }}>{formatINR(bundlePrice)}</strong>
                        <s className="compare-price" style={{ fontSize: ".9rem" }}>{formatINR(rawTotal)}</s>
                        <span className="savings-pill" style={{ fontSize: ".76rem" }}>Save {formatINR(rawTotal - bundlePrice)}</span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-block btn-sm"
                        onClick={() => {
                          bundle.items.forEach((item) => {
                            add({ slug: item.slug, name: item.name, price: item.price, image: item.image }, 1);
                          });
                          setIsCartDrawerOpen(true);
                        }}
                      >
                        🛒 Add 3-Item Bundle to Cart →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Bar Controls */}
          <div className="shop-top-bar">
            {/* Search Input */}
            <div className="shop-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery("")}>
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Grid Toggle */}
            <div className="shop-sort-controls">
              <div className="field" style={{ margin: 0 }}>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="shop-select"
                >
                  <option value="featured">Featured / Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>

              <div className="grid-toggle-buttons">
                <button
                  className={`grid-btn ${gridCols === "g4" ? "active" : ""}`}
                  onClick={() => setGridCols("g4")}
                  title="4 Column Grid"
                >
                  田
                </button>
                <button
                  className={`grid-btn ${gridCols === "g2" ? "active" : ""}`}
                  onClick={() => setGridCols("g2")}
                  title="2 Column Grid"
                >
                  日
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="category-chips-scroll">
            <button
              className={`chip ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All")}
            >
              All Products ({displayProducts.length})
            </button>
            {activeCategoriesList.map((cat) => {
              const count = displayProducts.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  className={`chip ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Filters Row */}
          <div className="filters-bar-row">
            <div className="filter-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyBestsellers}
                  onChange={(e) => setOnlyBestsellers(e.target.checked)}
                />
                🔥 Bestsellers Only
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyOrganic}
                  onChange={(e) => setOnlyOrganic(e.target.checked)}
                />
                🌿 100% Organic
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
                In Stock Only
              </label>
            </div>

            <div className="price-slider-box">
              <span>Max Price: <strong>₹{maxPrice}</strong></span>
              <input
                type="range"
                min={200}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-range-slider"
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-filters-row">
              <span className="muted" style={{ fontSize: ".85rem" }}>
                Active Filters:
              </span>
              {selectedCategory !== "All" && (
                <span className="active-filter-tag">
                  Category: {selectedCategory}{" "}
                  <button onClick={() => setSelectedCategory("All")}>✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="active-filter-tag">
                  Query: "{searchQuery}" <button onClick={() => setSearchQuery("")}>✕</button>
                </span>
              )}
              {onlyBestsellers && (
                <span className="active-filter-tag">
                  Bestsellers <button onClick={() => setOnlyBestsellers(false)}>✕</button>
                </span>
              )}
              {onlyOrganic && (
                <span className="active-filter-tag">
                  Organic <button onClick={() => setOnlyOrganic(false)}>✕</button>
                </span>
              )}
              {onlyInStock && (
                <span className="active-filter-tag">
                  In Stock <button onClick={() => setOnlyInStock(false)}>✕</button>
                </span>
              )}
              {maxPrice < 2000 && (
                <span className="active-filter-tag">
                  Under ₹{maxPrice} <button onClick={() => setMaxPrice(2000)}>✕</button>
                </span>
              )}
              <button className="reset-all-btn" onClick={resetFilters}>
                Reset All
              </button>
            </div>
          )}

          {/* Results Info */}
          <div style={{ marginTop: 20, marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
            <span className="muted" style={{ fontSize: ".9rem" }}>
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="card center" style={{ padding: "60px 20px" }}>
              <span style={{ fontSize: "3rem" }}>🍃</span>
              <h3>No products found</h3>
              <p className="muted" style={{ margin: "10px 0 20px" }}>
                Try adjusting your search terms or resetting filters.
              </p>
              <button className="btn btn-primary" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`grid ${gridCols}`}>
              {filteredProducts.map((p) => (
                <ProductCard product={p} key={p.slug} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quiz Modal */}
      <RemedyQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
