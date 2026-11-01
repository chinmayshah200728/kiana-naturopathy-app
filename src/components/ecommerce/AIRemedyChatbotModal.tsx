import { useState, useRef, useEffect } from "react";
import { useECommerce } from "@/lib/ecommerce-context";
import { useCart, formatINR } from "@/lib/cart";
import type { Product } from "@/data/products";
import { processAIRemedyQuery } from "@/lib/ai-remedy-engine";

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  matchedProducts?: Product[];
  healthTopic?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function AIRemedyChatbotModal({ isOpen, onClose }: Props) {
  const { productsList, setIsCartDrawerOpen } = useECommerce();
  const { add } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: `Hello! 👋 I am Dr. Hiral AI, your Naturopathy Remedy Assistant. I have analyzed our complete live catalog of ${productsList.length} natural remedies, detox kits, and herbal supplements.\n\nTell me about your health goals or symptoms (e.g. acidity, insomnia, acne, joint pain, or detox), and I will recommend the exact practitioner formulations for you!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendQuery = (queryText: string) => {
    const textToSend = queryText.trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    // Simulate AI practitioner reasoning & catalog analysis delay
    setTimeout(() => {
      const result = processAIRemedyQuery(textToSend, productsList);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: result.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        matchedProducts: result.matchedProducts,
        healthTopic: result.healthTopic,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleAddToCart = (product: Product) => {
    add(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      1
    );
    setIsCartDrawerOpen(true);
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
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card shadow-xl"
        style={{
          width: "100%",
          maxWidth: 680,
          height: "85vh",
          maxHeight: 750,
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
            padding: "18px 24px",
            background: "linear-gradient(135deg, #064E3B 0%, #047857 100%)",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#ffffff", fontWeight: 700 }}>
                  Dr. Hiral AI Assistant
                </h2>
                <span className="badge badge-gold" style={{ fontSize: ".72rem", padding: "2px 8px" }}>
                  Naturopathy Advisor
                </span>
              </div>
              <span style={{ fontSize: ".78rem", color: "#FDE68A", display: "block", marginTop: 2 }}>
                ⚡ Auto-Synced with {productsList.length} Catalog Products & Admin Items
              </span>
            </div>
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

        {/* Quick Symptom Chips Bar */}
        <div
          style={{
            padding: "10px 16px",
            backgroundColor: "var(--cream-100, #FDFBF7)",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            gap: 8,
            overflowX: "auto",
          }}
        >
          <span style={{ fontSize: ".76rem", fontWeight: 700, color: "#064E3B", alignSelf: "center", whiteSpace: "nowrap" }}>
            Quick Symptoms:
          </span>
          {[
            "🌿 Remedies for Acidity & Bloating",
            "😴 Help for Stress & Insomnia",
            "✨ Formulations for Clear Skin",
            "🍃 7-Day Gentle Detox Kit",
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuery(chip)}
              style={{
                background: "#ffffff",
                border: "1px solid var(--line-gold, #E2E8F0)",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: ".78rem",
                fontWeight: 600,
                color: "var(--emerald-900)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Messages Scroll Container */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#FAFAFA",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  maxWidth: "88%",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: msg.sender === "user" ? "#047857" : "#064E3B",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: ".9rem",
                    flexShrink: 0,
                  }}
                >
                  {msg.sender === "user" ? "👤" : "🩺"}
                </div>

                <div
                  style={{
                    backgroundColor: msg.sender === "user" ? "#047857" : "#ffffff",
                    color: msg.sender === "user" ? "#ffffff" : "#1F2937",
                    padding: "14px 18px",
                    borderRadius: 16,
                    borderTopRightRadius: msg.sender === "user" ? 2 : 16,
                    borderTopLeftRadius: msg.sender === "ai" ? 2 : 16,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    border: msg.sender === "ai" ? "1px solid #E5E7EB" : "none",
                    fontSize: ".9rem",
                    lineHeight: "1.5",
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.healthTopic && (
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "#ECFDF5",
                        color: "#047857",
                        fontWeight: 700,
                        fontSize: ".75rem",
                        padding: "2px 8px",
                        borderRadius: 12,
                        marginBottom: 8,
                      }}
                    >
                      🎯 Topic: {msg.healthTopic}
                    </span>
                  )}

                  <div>{msg.text}</div>

                  {/* Embedded Product Mini-Cards inside AI Message */}
                  {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#064E3B" }}>
                        🌿 Recommended Formulations ({msg.matchedProducts.length}):
                      </div>

                      {msg.matchedProducts.map((prod) => (
                        <div
                          key={prod.slug}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: 10,
                            borderRadius: 12,
                            backgroundColor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: ".88rem",
                                fontWeight: 700,
                                color: "#111827",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {prod.name}
                            </h4>
                            <span style={{ fontSize: ".76rem", color: "#6B7280", display: "block" }}>
                              {prod.category} {prod.organic && "• 🌿 100% Pure & Natural"}
                            </span>
                            <div style={{ fontWeight: 800, color: "#047857", fontSize: ".88rem", marginTop: 2 }}>
                              {formatINR(prod.price)}
                              {prod.comparePrice && (
                                <s style={{ fontSize: ".76rem", color: "#9CA3AF", marginLeft: 6 }}>
                                  {formatINR(prod.comparePrice)}
                                </s>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddToCart(prod)}
                            style={{
                              padding: "6px 12px",
                              fontSize: ".78rem",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              background: "linear-gradient(135deg, #064E3B 0%, #047857 100%)",
                            }}
                          >
                            🛒 Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    style={{
                      display: "block",
                      fontSize: ".7rem",
                      opacity: 0.7,
                      textAlign: "right",
                      marginTop: 6,
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#064E3B",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: ".9rem",
                }}
              >
                🩺
              </div>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "10px 16px",
                  borderRadius: 16,
                  border: "1px solid #E5E7EB",
                  fontSize: ".85rem",
                  color: "#6B7280",
                  fontStyle: "italic",
                }}
              >
                Dr. Hiral AI is analyzing product ingredients & remedies... 🌿
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          style={{
            padding: "14px 18px",
            backgroundColor: "#ffffff",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Ask about symptoms, health conditions, or remedies..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="input"
            style={{ flex: 1, padding: "10px 14px", fontSize: ".9rem" }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: "10px 20px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #064E3B 0%, #047857 100%)",
            }}
          >
            Ask AI 🤖
          </button>
        </form>
      </div>
    </div>
  );
}
