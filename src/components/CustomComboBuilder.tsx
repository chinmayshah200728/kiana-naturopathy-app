import { useState, useMemo } from "react";
import { useECommerce } from "@/lib/ecommerce-context";
import { useCart, formatINR } from "@/lib/cart";
import type { Product } from "@/data/products";
import {
  calculateComboDiscount,
  getNextTierBonus,
  saveCustomComboToStorage,
  type CustomCombo,
} from "@/data/custom-combos";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onComboSaved?: () => void;
};

export function CustomComboBuilder({ isOpen, onClose, onComboSaved }: Props) {
  const { productsList, categoriesList, setIsCartDrawerOpen } = useECommerce();
  const { add } = useCart();

  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [comboTitle, setComboTitle] = useState("My Custom Health Combo");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Filter catalog products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [productsList, selectedCategory, searchQuery]);

  // Calculations
  const rawSubtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const { discountPercent, discountAmount, finalPrice } = calculateComboDiscount(
    selectedItems.length,
    rawSubtotal
  );
  const nextTier = getNextTierBonus(selectedItems.length);

  const toggleSelectProduct = (product: Product) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.slug === product.slug);
      if (exists) {
        return prev.filter((item) => item.slug !== product.slug);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      setNoticeMessage("⚠️ Please select at least 1 product for your combo.");
      setTimeout(() => setNoticeMessage(null), 2500);
      return;
    }

    const titleToUse = comboTitle.trim() || "Custom Health Combo";
    const itemsDescription = selectedItems.map((i) => i.name).join(" + ");
    
    // Add custom bundle to cart as a bundled item with discounted total
    add(
      {
        slug: `custom-combo-${Date.now()}`,
        name: `🎨 ${titleToUse} (${selectedItems.length} Items: ${itemsDescription})`,
        price: finalPrice > 0 ? finalPrice : rawSubtotal,
        image: selectedItems[0]?.image || "/images/products/detox-kit.jpg",
      },
      1
    );

    // Save combo recipe automatically
    saveCustomComboToStorage({
      id: `combo-${Date.now()}`,
      title: titleToUse,
      items: selectedItems.map((i) => ({
        slug: i.slug,
        name: i.name,
        price: i.price,
        image: i.image,
        category: i.category,
      })),
      createdAt: new Date().toISOString(),
    });

    if (onComboSaved) onComboSaved();

    // Close builder & open cart drawer
    onClose();
    setIsCartDrawerOpen(true);
  };

  const handleSaveRecipeOnly = () => {
    if (selectedItems.length === 0) {
      setNoticeMessage("⚠️ Select products before saving your combo.");
      setTimeout(() => setNoticeMessage(null), 2500);
      return;
    }

    const titleToUse = comboTitle.trim() || "Custom Health Combo";
    saveCustomComboToStorage({
      id: `combo-${Date.now()}`,
      title: titleToUse,
      items: selectedItems.map((i) => ({
        slug: i.slug,
        name: i.name,
        price: i.price,
        image: i.image,
        category: i.category,
      })),
      createdAt: new Date().toISOString(),
    });

    if (onComboSaved) onComboSaved();
    setNoticeMessage(`✅ Combo "${titleToUse}" saved successfully!`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(6, 78, 59, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card shadow-xl"
        style={{
          width: "100%",
          maxWidth: 920,
          maxHeight: "92vh",
          backgroundColor: "#ffffff",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "2px solid var(--gold-400, #E2E8F0)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #064E3B 0%, #047857 100%)",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontSize: ".75rem",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#FDE68A",
                fontWeight: 700,
              }}
            >
              Mix & Match Health Bundles
            </span>
            <h2 style={{ margin: "2px 0 0", fontSize: "1.4rem", color: "#ffffff" }}>
              🎨 Build Your Own Custom Combo
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#ffffff",
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tier Discount Status Bar */}
        <div
          style={{
            padding: "14px 24px",
            backgroundColor: "var(--cream-100, #FDFBF7)",
            borderBottom: "1px solid var(--line-gold, #E2E8F0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span
              className={`badge ${selectedItems.length >= 2 ? "badge-green" : "badge-gold"}`}
              style={{ fontWeight: selectedItems.length === 2 ? 800 : 500 }}
            >
              2 Items = 15% OFF
            </span>
            <span
              className={`badge ${selectedItems.length >= 3 ? "badge-green" : "badge-gold"}`}
              style={{ fontWeight: selectedItems.length === 3 ? 800 : 500 }}
            >
              3 Items = 20% OFF
            </span>
            <span
              className={`badge ${selectedItems.length >= 4 ? "badge-green" : "badge-gold"}`}
              style={{ fontWeight: selectedItems.length >= 4 ? 800 : 500 }}
            >
              4+ Items = 25% OFF 🔥
            </span>
          </div>

          <div style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--emerald-900)" }}>
            {discountPercent > 0 ? (
              <span style={{ color: "#047857" }}>
                🎉 {discountPercent}% Discount Applied! Saved {formatINR(discountAmount)}
              </span>
            ) : nextTier ? (
              <span style={{ color: "#D97706" }}>
                💡 Pick {nextTier.itemsNeeded} item{nextTier.itemsNeeded > 1 ? "s" : ""} to unlock {nextTier.nextDiscountPercent}% OFF!
              </span>
            ) : (
              <span>Pick items below to start building your combo</span>
            )}
          </div>
        </div>

        {noticeMessage && (
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: noticeMessage.includes("✅") ? "#ECFDF5" : "#FEF2F2",
              color: noticeMessage.includes("✅") ? "#065F46" : "#991B1B",
              fontSize: ".9rem",
              fontWeight: 600,
            }}
          >
            {noticeMessage}
          </div>
        )}

        {/* Selected Items & Combo Title Bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8F0", backgroundColor: "#FAFAFA" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <label style={{ fontSize: ".85rem", fontWeight: 700, color: "var(--charcoal)", whiteSpace: "nowrap" }}>
              Combo Name:
            </label>
            <input
              type="text"
              value={comboTitle}
              onChange={(e) => setComboTitle(e.target.value)}
              placeholder="e.g. My Morning Detox & Energy Kit"
              className="input"
              style={{ padding: "6px 12px", fontSize: ".9rem", flex: 1 }}
            />
          </div>

          {/* Selected items tray */}
          {selectedItems.length > 0 ? (
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
              {selectedItems.map((item) => (
                <div
                  key={item.slug}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 10px 4px 6px",
                    background: "#ffffff",
                    border: "1px solid var(--emerald-800, #047857)",
                    borderRadius: 30,
                    fontSize: ".82rem",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span>{item.name}</span>
                  <span className="muted">({formatINR(item.price)})</span>
                  <button
                    onClick={() => toggleSelectProduct(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#EF4444",
                      cursor: "pointer",
                      fontWeight: 700,
                      padding: "0 2px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted" style={{ fontSize: ".85rem", fontStyle: "italic" }}>
              No products selected yet. Click "+ Add to Combo" on any item below!
            </div>
          )}
        </div>

        {/* Product Catalog Grid Body */}
        <div style={{ padding: "16px 24px", flex: 1, overflowY: "auto" }}>
          {/* Search & Category Filter */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <input
              type="text"
              placeholder="🔍 Search items for combo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ flex: 1, minWidth: 200, padding: "8px 14px" }}
            />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                className={`btn btn-sm ${selectedCategory === "All" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setSelectedCategory("All")}
              >
                All ({productsList.length})
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Cards */}
          <div className="grid g3" style={{ gap: 14 }}>
            {filteredProducts.map((product) => {
              const isSelected = selectedItems.some((i) => i.slug === product.slug);
              return (
                <div
                  key={product.slug}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: isSelected ? "2px solid #047857" : "1px solid #E2E8F0",
                    background: isSelected ? "#F0FDF4" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.15s ease",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: ".9rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </h4>
                    <span className="muted" style={{ fontSize: ".78rem" }}>
                      {product.category}
                    </span>
                    <div style={{ fontWeight: 700, color: "var(--emerald-900)", fontSize: ".9rem", marginTop: 2 }}>
                      {formatINR(product.price)}
                    </div>
                  </div>

                  <button
                    className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => toggleSelectProduct(product)}
                    style={{
                      padding: "6px 12px",
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                      backgroundColor: isSelected ? "#047857" : undefined,
                    }}
                  >
                    {isSelected ? "✓ Selected" : "+ Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "2px solid #E2E8F0",
            backgroundColor: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: ".85rem" }}>
              Selected: <strong>{selectedItems.length} Items</strong>
              {rawSubtotal > 0 && (
                <span className="muted" style={{ marginLeft: 8 }}>
                  (Subtotal: <del>{formatINR(rawSubtotal)}</del>)
                </span>
              )}
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--emerald-900)" }}>
              Combo Total: {formatINR(finalPrice)}
              {discountPercent > 0 && (
                <span className="badge badge-green" style={{ marginLeft: 8, fontSize: ".8rem" }}>
                  Save {discountPercent}% ({formatINR(discountAmount)})
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={handleSaveRecipeOnly} style={{ padding: "10px 16px" }}>
              💾 Save Combo
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              style={{
                padding: "10px 24px",
                background: "linear-gradient(135deg, #064E3B 0%, #047857 100%)",
                fontWeight: 700,
              }}
            >
              🛒 Add Custom Combo to Cart ({formatINR(finalPrice)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
