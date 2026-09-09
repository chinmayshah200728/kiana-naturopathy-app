import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { products } from "@/data/products";
import { formatINR, useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

const POPULAR_SEARCHES = ["Detox", "Ashwagandha", "Honey", "Tea", "Acne", "Immunity", "Joint Pain"];

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useECommerce();
  const { add } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.short.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="modal-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <header className="search-modal-header">
          <span style={{ fontSize: "1.2rem", opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search products, ingredients, or health concerns (e.g. Detox, Honey, Stress)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            className="btn-icon"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            ✕
          </button>
        </header>

        <div className="search-modal-body">
          {!query && (
            <div className="popular-searches-box">
              <span className="muted" style={{ fontSize: ".85rem", fontWeight: 600 }}>
                Popular Searches:
              </span>
              <div className="search-tags">
                {POPULAR_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    className="search-tag-chip"
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="search-results-box">
              <div className="search-results-count">
                Found {results.length} result{results.length === 1 ? "" : "s"} for "{query}"
              </div>

              {results.length === 0 ? (
                <div className="search-empty">
                  <p>No products match your search query.</p>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate({ to: "/shop" });
                    }}
                  >
                    Browse all products
                  </button>
                </div>
              ) : (
                <div className="search-results-grid">
                  {results.slice(0, 6).map((p) => (
                    <div key={p.slug} className="search-result-card">
                      <img src={p.image} alt={p.name} className="search-result-img" />
                      <div className="search-result-info">
                        <span className="tag">{p.category}</span>
                        <Link
                          to="/shop/$slug"
                          params={{ slug: p.slug }}
                          onClick={() => setIsSearchOpen(false)}
                          className="search-result-name"
                        >
                          {p.name}
                        </Link>
                        <div className="price">{formatINR(p.price)}</div>
                      </div>
                      <div className="search-result-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setQuickViewProduct(p);
                            setIsSearchOpen(false);
                          }}
                        >
                          Quick View
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            add({
                              slug: p.slug,
                              name: p.name,
                              price: p.price,
                              image: p.image,
                            })
                          }
                        >
                          Add 🛒
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
