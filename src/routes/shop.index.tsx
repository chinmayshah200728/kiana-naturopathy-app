import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { PageHead } from "@/components/site/SiteLayout";
import { products } from "@/data/products";
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
        lead="Pure herbal supplements, cold-pressed oils, pure & natural honey, teas, and gentle detox kits. Free shipping on orders over ₹999."
      />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap">
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
                🌿 100% Pure & Natural
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
                  Pure & Natural <button onClick={() => setOnlyOrganic(false)}>✕</button>
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
