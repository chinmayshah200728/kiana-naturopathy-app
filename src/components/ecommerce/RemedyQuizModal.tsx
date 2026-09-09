import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { products } from "@/data/products";
import { formatINR, useCart } from "@/lib/cart";

type QuizStep = 1 | 2 | 3;

export function RemedyQuizModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { add } = useCart();
  const [step, setStep] = useState<QuizStep>(1);
  const [concern, setConcern] = useState<string>("Digestion & Detox");
  const [goal, setGoal] = useState<string>("Energy & Vitality");

  if (!isOpen) return null;

  const getRecommendations = () => {
    if (concern === "Digestion & Detox") {
      return products.filter((p) => p.slug.includes("detox") || p.slug.includes("triphala") || p.slug.includes("honey"));
    }
    if (concern === "Stress & Sleep") {
      return products.filter((p) => p.slug.includes("ashwagandha") || p.slug.includes("lavender") || p.slug.includes("tea"));
    }
    if (concern === "Immunity & Cold") {
      return products.filter((p) => p.slug.includes("immunity") || p.slug.includes("amla") || p.slug.includes("kadha"));
    }
    if (concern === "Joint Pain & Stiffness") {
      return products.filter((p) => p.slug.includes("joint") || p.slug.includes("eucalyptus"));
    }
    return products.slice(0, 3);
  };

  const recs = getRecommendations().slice(0, 3);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <header className="quiz-modal-header">
          <div>
            <span className="eyebrow">Natural Remedy Quiz</span>
            <h2>Find Your Personal Remedy ({step}/3)</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="quiz-modal-body">
          {step === 1 && (
            <div className="quiz-step-content">
              <h3>What is your primary health or wellness focus today?</h3>
              <div className="quiz-options-grid">
                {[
                  { title: "Digestion & Detox", icon: "🌱", text: "Acidity, bloating, sluggish morning digestion" },
                  { title: "Stress & Sleep", icon: "🧘", text: "Evening stress, difficulty falling asleep, fatigue" },
                  { title: "Immunity & Cold", icon: "☕", text: "Seasonal weather changes, throat tickle, energy" },
                  { title: "Joint Pain & Stiffness", icon: "🦵", text: "Morning joint tightness, back discomfort" },
                ].map((opt) => (
                  <button
                    key={opt.title}
                    className={`quiz-opt-card ${concern === opt.title ? "selected" : ""}`}
                    onClick={() => setConcern(opt.title)}
                  >
                    <span className="quiz-icon">{opt.icon}</span>
                    <strong>{opt.title}</strong>
                    <p>{opt.text}</p>
                  </button>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setStep(2)}>
                Next Step →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="quiz-step-content">
              <h3>What is your desired outcome over the next 30 days?</h3>
              <div className="quiz-options-grid">
                {[
                  { title: "Energy & Vitality", icon: "⚡", text: "Sustained daily energy without crashes" },
                  { title: "Deep Restful Sleep", icon: "🌙", text: "Wake up naturally feeling refreshed" },
                  { title: "Gut Calm & Regularity", icon: "🥗", text: "Smooth daily bowel habits & clean gut" },
                  { title: "Pain & Stiffness Relief", icon: "🌿", text: "Comfortable movement & active posture" },
                ].map((opt) => (
                  <button
                    key={opt.title}
                    className={`quiz-opt-card ${goal === opt.title ? "selected" : ""}`}
                    onClick={() => setGoal(opt.title)}
                  >
                    <span className="quiz-icon">{opt.icon}</span>
                    <strong>{opt.title}</strong>
                    <p>{opt.text}</p>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>
                  See My Personalized Remedies →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="quiz-step-content">
              <div className="quiz-results-banner">
                <h3>Recommended Natural Protocol for "{concern}"</h3>
                <p>Based on your focus on {goal.toLowerCase()}, our naturopaths recommend:</p>
              </div>

              <div className="quiz-recs-grid">
                {recs.map((p) => (
                  <div key={p.slug} className="quiz-rec-card">
                    <img src={p.image} alt={p.name} />
                    <div>
                      <span className="tag">{p.category}</span>
                      <h4>{p.name}</h4>
                      <p className="price">{formatINR(p.price)}</p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        add({ slug: p.slug, name: p.name, price: p.price, image: p.image });
                      }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center" }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>
                  Retake Quiz
                </button>
                <Link className="btn btn-primary" to="/shop" onClick={onClose}>
                  Explore Full Shop
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
