import { useState, useMemo } from "react";
import { useECommerce, type OrderRecord } from "@/lib/ecommerce-context";
import { formatINR } from "@/lib/cart";

export function WhatsAppOrderTrackerWidget() {
  const { ordersHistory } = useECommerce();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "tracker">("chat");
  const [customMessage, setCustomMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<OrderRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const phoneWhatsApp = "919876543210";

  const handleOpenWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${phoneWhatsApp}?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!searchQuery.trim()) {
      setTrackedOrder(null);
      return;
    }

    const q = searchQuery.trim().toLowerCase();
    const found = ordersHistory.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.phone.includes(q)
    );

    if (found) {
      setTrackedOrder(found);
    } else {
      // Demo fallback order if user searches demo number
      setTrackedOrder({
        id: `demo-${q}`,
        orderNumber: q.toUpperCase().startsWith("KN-") ? q.toUpperCase() : `KN-${q.toUpperCase()}`,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        items: [
          { slug: "7-day-detox-kit", name: "7-Day Gentle Detox Kit", price: 1499, qty: 1, image: "/assets/img/p-detox.jpg" },
        ],
        subtotal: 1499,
        discount: 150,
        shipping: 0,
        total: 1349,
        status: "Out for Delivery",
        paymentMethod: "cod",
        address: "Flat 402, Shivajinagar, Pune 411005",
        customerName: "Valued Customer",
        phone: "+91 98765 43210",
      });
    }
  };

  const getStepProgress = (status: OrderRecord["status"]) => {
    switch (status) {
      case "Order Placed":
        return 1;
      case "Packed":
        return 2;
      case "Out for Delivery":
        return 4;
      case "Delivered":
        return 5;
      case "Cancelled":
        return 0;
      default:
        return 3;
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9990,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {!isOpen && (
          <div
            style={{
              background: "#ffffff",
              padding: "6px 14px",
              borderRadius: 30,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              fontSize: ".82rem",
              fontWeight: 700,
              color: "#064E3B",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 6,
              animation: "bounce 2s infinite",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                display: "inline-block",
              }}
            />
            <span>WhatsApp & Order Status</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            backgroundColor: "#25D366",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 6px 20px rgba(37, 211, 102, 0.45)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.7rem",
            transition: "transform 0.2s ease",
          }}
          title="WhatsApp Support & Live Order Tracker"
        >
          {isOpen ? "✕" : "💬"}
        </button>
      </div>

      {/* Popup Dialog Widget */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            width: "calc(100vw - 32px)",
            maxWidth: 390,
            maxHeight: "82vh",
            backgroundColor: "#ffffff",
            borderRadius: 20,
            boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
            zIndex: 9991,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid var(--line-gold, #E2E8F0)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #075E54 0%, #128C7E 100%)",
              color: "#ffffff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.4rem" }}>💬</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#ffffff", fontWeight: 700 }}>
                    Kiana Help & Tracking
                  </h3>
                  <span style={{ fontSize: ".76rem", opacity: 0.9 }}>
                    🟢 Dr. Ananya (Naturopath) is Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Tab Switches */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: ".82rem",
                  fontWeight: 700,
                  border: "none",
                  backgroundColor: activeTab === "chat" ? "#ffffff" : "rgba(255,255,255,0.2)",
                  color: activeTab === "chat" ? "#075E54" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                💬 WhatsApp Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tracker")}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: ".82rem",
                  fontWeight: 700,
                  border: "none",
                  backgroundColor: activeTab === "tracker" ? "#ffffff" : "rgba(255,255,255,0.2)",
                  color: activeTab === "tracker" ? "#075E54" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                📦 Track Order
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: 18, flex: 1, overflowY: "auto", backgroundColor: "#F9FAFB" }}>
            {activeTab === "chat" ? (
              <div>
                <p style={{ margin: "0 0 12px", fontSize: ".85rem", color: "#4B5563" }}>
                  Have a question about remedies, therapies, or your diet plan? Select a topic or send a custom WhatsApp message:
                </p>

                {/* Preset Chips */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {[
                    "👋 Hi Dr. Ananya! I need advice on natural digestion remedies.",
                    "🩺 I would like to book a 1-on-1 naturopathy consultation.",
                    "📦 Can you help me check my order delivery status?",
                    "🌿 Which herbal supplement is best for stress and sleep?",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOpenWhatsApp(preset)}
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        borderRadius: 12,
                        backgroundColor: "#ffffff",
                        border: "1px solid #E5E7EB",
                        fontSize: ".82rem",
                        color: "#1F2937",
                        fontWeight: 500,
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{preset}</span>
                      <span style={{ color: "#25D366", fontSize: ".9rem", marginLeft: 6 }}>➜</span>
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customMessage.trim()) {
                        handleOpenWhatsApp(customMessage);
                        setCustomMessage("");
                      }
                    }}
                    className="input"
                    style={{ flex: 1, fontSize: ".85rem", padding: "8px 12px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customMessage.trim()) {
                        handleOpenWhatsApp(customMessage);
                        setCustomMessage("");
                      }
                    }}
                    style={{
                      backgroundColor: "#25D366",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: ".85rem",
                    }}
                  >
                    Send 📲
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSearchOrder} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <input
                    type="text"
                    placeholder="Enter Order ID (e.g. KN-849201)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    style={{ flex: 1, fontSize: ".85rem", padding: "8px 12px" }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#075E54",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 14px",
                      fontWeight: 700,
                      fontSize: ".85rem",
                      cursor: "pointer",
                    }}
                  >
                    Track
                  </button>
                </form>

                {/* Order Results */}
                {trackedOrder ? (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: ".9rem", color: "#111827" }}>
                          Order #{trackedOrder.orderNumber}
                        </strong>
                        <div style={{ fontSize: ".76rem", color: "#6B7280" }}>{trackedOrder.date}</div>
                      </div>
                      <span className="badge badge-green" style={{ fontSize: ".75rem" }}>
                        {trackedOrder.status}
                      </span>
                    </div>

                    {/* Stepper Progress */}
                    {trackedOrder.status === "Cancelled" ? (
                      <div
                        style={{
                          padding: "10px 12px",
                          backgroundColor: "#FEF2F2",
                          color: "#991B1B",
                          borderRadius: 8,
                          fontSize: ".82rem",
                          fontWeight: 600,
                        }}
                      >
                        ❌ This order was cancelled. Refund processed to original payment method.
                      </div>
                    ) : (
                      <div style={{ margin: "14px 0" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: ".72rem",
                            fontWeight: 700,
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ color: getStepProgress(trackedOrder.status) >= 1 ? "#047857" : "#9CA3AF" }}>
                            Placed
                          </span>
                          <span style={{ color: getStepProgress(trackedOrder.status) >= 2 ? "#047857" : "#9CA3AF" }}>
                            Packed
                          </span>
                          <span style={{ color: getStepProgress(trackedOrder.status) >= 4 ? "#047857" : "#9CA3AF" }}>
                            Out for Delivery
                          </span>
                          <span style={{ color: getStepProgress(trackedOrder.status) >= 5 ? "#047857" : "#9CA3AF" }}>
                            Delivered
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                          style={{
                            height: 6,
                            backgroundColor: "#E5E7EB",
                            borderRadius: 10,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${(getStepProgress(trackedOrder.status) / 5) * 100}%`,
                              backgroundColor: "#25D366",
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Delivery Info */}
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop: "1px dashed #E5E7EB",
                        fontSize: ".8rem",
                        color: "#374151",
                      }}
                    >
                      <div>
                        🚚 <strong>Express Partner:</strong> BlueDart Air (AWB: BD9482019IN)
                      </div>
                      <div style={{ marginTop: 4 }}>
                        📍 <strong>Deliver to:</strong> {trackedOrder.customerName} ({trackedOrder.address})
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 700, color: "#047857" }}>
                        💰 Total: {formatINR(trackedOrder.total)} ({trackedOrder.paymentMethod.toUpperCase()})
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenWhatsApp(
                          `Hi Dr. Ananya, I am inquiring about my Order #${trackedOrder.orderNumber} (Status: ${trackedOrder.status}).`
                        )
                      }
                      style={{
                        width: "100%",
                        marginTop: 12,
                        padding: "8px",
                        backgroundColor: "#ECFDF5",
                        color: "#047857",
                        border: "1px solid #A7F3D0",
                        borderRadius: 8,
                        fontSize: ".8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      📲 Get WhatsApp Delivery Notifications
                    </button>
                  </div>
                ) : hasSearched ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 20,
                      backgroundColor: "#ffffff",
                      borderRadius: 12,
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>🔍</span>
                    <p style={{ margin: "6px 0", fontSize: ".85rem", fontWeight: 600 }}>
                      No order found for "{searchQuery}"
                    </p>
                    <p style={{ margin: 0, fontSize: ".78rem", color: "#6B7280" }}>
                      Try searching with your phone number or test with <code>KN-849201</code>.
                    </p>
                  </div>
                ) : (
                  <div style={{ fontSize: ".82rem", color: "#4B5563", textAlign: "center", padding: 14 }}>
                    Enter your Order ID (e.g. <code>KN-849201</code>) or phone number above to track real-time delivery status!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
