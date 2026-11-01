import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { DISCLAIMER } from "@/components/site/SiteLayout";
import { RemedyQuizModal } from "@/components/ecommerce/RemedyQuizModal";
import { conditions } from "@/data/conditions";
import { categories, products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kiana Naturopathy & Wellness Centre — Heal Naturally in Mumbai" },
      {
        name: "description",
        content:
          "Drug-free naturopathy care in Mumbai: personalised diet therapy, yoga, hydrotherapy and a practitioner-selected wellness shop.",
      },
      { property: "og:title", content: "Kiana Naturopathy & Wellness Centre" },
      {
        property: "og:description",
        content: "Heal naturally with personalised diet, yoga and natural therapies in Mumbai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthAndBeautyBusiness",
          "name": "Kiana Naturopathy & Wellness Centre",
          "url": "https://www.kiananaturopathy.com",
          "description": "Drug-free naturopathy care in Mumbai: personalised diet therapy, yoga, hydrotherapy and herbal support.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Mumbai",
            "addressRegion": "Maharashtra",
            "addressCountry": "IN"
          },
          "founder": {
            "@type": "Person",
            "name": "Dr. Hiral Shah",
            "jobTitle": "Chief Naturopath"
          }
        }),
      },
    ],
  }),
  component: HomePage,
});

const BENEFITS = [
  { icon: "🌱", title: "Root-cause focus", text: "We look at diet, sleep, stress and movement together instead of treating one symptom in isolation." },
  { icon: "🥗", title: "Food-first plans", text: "Practical Indian meal plans built around your kitchen, budget and routine — no imported superfoods." },
  { icon: "🧘", title: "Mind-body practices", text: "Yoga therapy, pranayama and guided relaxation that help manage everyday stress." },
  { icon: "💧", title: "Drug-free therapies", text: "Hydrotherapy, mud therapy, massage and fomentation delivered by trained practitioners." },
  { icon: "🤝", title: "Alongside your doctor", text: "Our care complements prescribed treatment. We never ask you to stop medication." },
  { icon: "📈", title: "Measured, honest progress", text: "Two-weekly reviews with real markers, so you can see what is actually working." },
];

function HomePage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = products.filter((p) => p.featured || p.bestseller).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="hero">
        <div className="bg">
          <img src="/assets/img/hero-naturopathy.jpg" alt="Calm naturopathy therapy space with greenery" />
        </div>
        <div className="wrap">
          <div className="inner">
            <div className="eyebrow" style={{ color: "var(--sage)" }}>
              Kiana Naturopathy &amp; Wellness Centre
            </div>
            <h1>Heal Naturally with Naturopathy</h1>
            <p>
              Drug-free, food-first care and practitioner-selected herbal remedies that support overall wellness. Personalised diet, yoga and natural therapies designed around your life.
            </p>

            <div className="cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btn-light" to="/shop">
                Explore Wellness Shop 🛍️
              </Link>
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: "#fff", borderColor: "rgba(255,255,255,.7)" }}
                onClick={() => setIsQuizOpen(true)}
              >
                Take 1-Min Remedy Quiz ✨
              </button>
            </div>

            <div className="stats">
              <div><b>18+</b><span>Years of practice</span></div>
              <div><b>12,000+</b><span>Consultations</span></div>
              <div><b>100%</b><span>Natural remedies</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Highlights Bar */}
      <section style={{ background: "#fff", borderBottom: "1px solid var(--line)", padding: "24px 0" }}>
        <div className="wrap">
          <div className="trust-features-bar">
            <div className="trust-feature-item">
              <span className="feature-icon">🌿</span>
              <div>
                <strong>100% Pure &amp; Natural</strong>
                <p>No synthetic chemicals or fillers</p>
              </div>
            </div>
            <div className="trust-feature-item">
              <span className="feature-icon">🚚</span>
              <div>
                <strong>Free Express Shipping</strong>
                <p>On orders above ₹999 pan-India</p>
              </div>
            </div>
            <div className="trust-feature-item">
              <span className="feature-icon">🩺</span>
              <div>
                <strong>Practitioner Approved</strong>
                <p>Formulated by senior BNYS naturopaths</p>
              </div>
            </div>
            <div className="trust-feature-item">
              <span className="feature-icon">💳</span>
              <div>
                <strong>Secure Payments</strong>
                <p>GPay, PhonePe, Cards &amp; COD</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bestseller Products */}
      <section className="alt" style={{ padding: "60px 0" }}>
        <div className="wrap">
          <div className="center">
            <div className="eyebrow">Practitioner Selected</div>
            <h2>Featured Natural Remedies</h2>
            <p className="lead">
              Herbal supplements, cold-pressed oils, pure & natural honey, and detox kits — trusted by thousands.
            </p>
          </div>

          <div className="grid g4" style={{ marginTop: 32 }}>
            {featured.map((p) => (
              <ProductCard product={p} key={p.slug} />
            ))}
          </div>

          <p style={{ marginTop: 28 }} className="center">
            <Link className="btn btn-primary btn-lg" to="/shop">
              Browse Entire Wellness Shop →
            </Link>
          </p>
        </div>
      </section>

      {/* Category Showcase Grid */}
      <section style={{ padding: "60px 0" }}>
        <div className="wrap">
          <div className="center">
            <div className="eyebrow">Shop by Category</div>
            <h2>Explore Remedies for Your Health Needs</h2>
          </div>

          <div className="category-showcase-grid" style={{ marginTop: 32 }}>
            {categories.slice(0, 6).map((cat) => {
              const sample = products.find((p) => p.category === cat) || products[0];
              const count = products.filter((p) => p.category === cat).length;
              return (
                <Link
                  key={cat}
                  to="/shop"
                  className="category-card"
                >
                  <img src={sample.image} alt={cat} />
                  <div className="category-card-overlay">
                    <h3>{cat}</h3>
                    <span>{count} Products</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Founder & Chief Naturopath Section */}
      <section style={{ padding: "70px 0", background: "var(--cream-100)", borderTop: "1px solid var(--line-gold)", borderBottom: "1px solid var(--line-gold)" }}>
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: "center", gap: 48 }}>
            <div style={{ position: "relative" }}>
              <div style={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(6, 78, 59, 0.18)",
                border: "4px solid #fff",
                position: "relative"
              }}>
                <img
                  src="/assets/img/dr-kiana-profile.jpg"
                  alt="Dr. Hiral Shah - Founder & Chief Naturopath"
                  style={{ width: "100%", height: "460px", objectFit: "cover", objectPosition: "top" }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(6, 78, 59, 0.95), transparent)",
                  padding: "24px 20px 20px",
                  color: "#fff"
                }}>
                  <h3 style={{ color: "#FEEFDD", margin: 0, fontSize: "1.35rem" }}>Dr. Hiral Shah</h3>
                  <span style={{ fontSize: ".88rem", opacity: 0.9, fontWeight: 600 }}>BNYS, MD (Naturopathy &amp; Clinical Nutrition)</span>
                </div>
              </div>
              <div style={{
                position: "absolute",
                top: -16,
                right: -16,
                background: "var(--gold-gradient)",
                color: "var(--emerald-950)",
                padding: "10px 18px",
                borderRadius: "50px",
                fontWeight: 800,
                fontSize: "0.85rem",
                boxShadow: "var(--shadow-gold)"
              }}>
                ⭐ 18+ Yrs Experience
              </div>
            </div>

            <div>
              <div className="eyebrow">Meet Our Founder &amp; Chief Practitioner</div>
              <h2 style={{ fontSize: "2.3rem", color: "var(--emerald-950)" }}>Dr. Hiral Shah</h2>
              <p style={{ fontWeight: 700, color: "var(--emerald-800)", fontSize: "1.05rem" }}>
                Founder &amp; Lead Naturopathic Doctor
              </p>
              <p className="lead" style={{ fontSize: "1rem", marginTop: 12 }}>
                With over 18 years of dedicated clinical practice in naturopathy, plant medicine, and functional nutrition, Dr. Hiral has personally guided 12,000+ patients to sustainable, drug-free wellness.
              </p>
              <p style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
                She founded Kiana Naturopathy &amp; Wellness Centre to blend traditional Indian clinical nutrition, therapeutic yoga, hydrotherapy, and practitioner-formulated herbal remedies into accessible daily routines.
              </p>

              <blockquote style={{
                margin: "20px 0",
                padding: "16px 20px",
                background: "#fff",
                borderLeft: "4px solid var(--gold-500)",
                borderRadius: "0 12px 12px 0",
                fontStyle: "italic",
                color: "var(--emerald-900)",
                fontWeight: 600,
                boxShadow: "var(--shadow-sm)"
              }}>
                "True healing begins when we align daily food, mindful movement, and pure plant remedies with the body's innate wisdom."
              </blockquote>

              <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
                <Link className="btn btn-gold" to="/about">
                  Read Dr. Hiral's Profile &amp; Story →
                </Link>
                <Link className="btn btn-primary" to="/naturopathy">
                  Explore Naturopathy Care
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section style={{ padding: "60px 0" }}>
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow">Sanctuary &amp; Therapies</div>
              <h2>Natural approaches for better health</h2>
              <p className="lead">
                Kiana Naturopathy &amp; Wellness Centre is a naturopathy and wellness clinic in Mumbai.
                We combine diet therapy, yoga, hydrotherapy, mud therapy and herbal support into one
                practical plan you can keep.
              </p>
              <p>
                Every plan starts with a 45-minute assessment of your history, routine and reports.
                You leave with something written down — meals, movement, sleep and follow-up dates.
              </p>
              <Link className="btn btn-primary" to="/naturopathy">
                Learn About Naturopathy
              </Link>
            </div>
            <img
              src="/assets/img/naturopathy-sanctuary-bg.jpg"
              alt="Natural herbal apothecary sanctuary"
              style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow)", height: 380, objectFit: "cover", width: "100%" }}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="alt" style={{ padding: "60px 0" }}>
        <div className="wrap">
          <div className="center">
            <div className="eyebrow">Why natural healing</div>
            <h2>Benefits of a natural approach</h2>
            <p className="lead">
              Six reasons people choose supportive naturopathic care alongside their medical treatment.
            </p>
          </div>
          <div className="grid g3" style={{ marginTop: 34 }}>
            {BENEFITS.map((b) => (
              <div className="card" key={b.title}>
                <div className="icon-badge">{b.icon}</div>
                <h3>{b.title}</h3>
                <p className="muted" style={{ margin: 0 }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Support */}
      <section style={{ padding: "60px 0" }}>
        <div className="wrap">
          <div className="center">
            <div className="eyebrow">Conditions we support</div>
            <h2>Where naturopathy may help</h2>
          </div>
          <div className="grid g4" style={{ marginTop: 30 }}>
            {conditions.slice(0, 8).map((c) => (
              <Link
                className="card flat"
                key={c.slug}
                to="/conditions/$slug"
                params={{ slug: c.slug }}
              >
                <h3>{c.title}</h3>
                <p className="muted" style={{ fontSize: ".9rem", margin: 0 }}>{c.description}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 22 }} className="center">
            <Link className="btn btn-outline" to="/conditions">View all conditions</Link>
          </p>
        </div>
      </section>

      {/* Newsletter Discount Banner */}
      <section style={{ background: "var(--cream)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "50px 0" }}>
        <div className="wrap center" style={{ maxWidth: 640 }}>
          <span style={{ fontSize: "2rem" }}>💌</span>
          <h2>Get 10% Off Your First Order</h2>
          <p className="lead" style={{ fontSize: ".95rem", margin: "8px 0 20px" }}>
            Subscribe to our weekly natural health tips &amp; receive an instant 10% discount promo code!
          </p>

          {subscribed ? (
            <div className="notice text-success" style={{ fontSize: "1.05rem" }}>
              🎉 Thank you! Use code <strong>KIANA10</strong> at checkout for 10% OFF.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe &amp; Save
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="wrap" style={{ padding: "40px 0 20px" }}>
        <p className="notice">{DISCLAIMER}</p>
      </div>

      {/* Remedy Quiz Modal */}
      <RemedyQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
