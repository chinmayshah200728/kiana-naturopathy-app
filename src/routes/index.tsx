import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { DISCLAIMER } from "@/components/site/SiteLayout";
import { RemedyQuizModal } from "@/components/ecommerce/RemedyQuizModal";
import { conditions } from "@/data/conditions";
import { categories, products } from "@/data/products";
import { testimonials } from "@/data/testimonials";
import { useECommerce } from "@/lib/ecommerce-context";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "canonical", href: "https://www.kiananaturopathy.com/" },
    ],
    meta: [
      { title: "Kiana Naturopathy & Wellness Centre — Heal Naturally in Mumbai" },
      {
        name: "description",
        content:
          "Drug-free naturopathy care in Mumbai: personalised diet therapy, yoga, hydrotherapy and a practitioner-selected wellness shop.",
      },
      { property: "og:title", content: "Kiana Naturopathy & Wellness Centre — Heal Naturally in Mumbai" },
      {
        property: "og:description",
        content: "Drug-free naturopathy care in Mumbai: personalised diet, yoga and natural therapies.",
      },
      { property: "og:url", content: "https://www.kiananaturopathy.com/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "IN-MH" },
      { name: "geo.placename", content: "Mumbai" },
      { name: "google-site-verification", content: "E4Mv6laQ85waxOtFHX08x8vHFLN6AKhoe8cjNyVdojc" },
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
          },
          "areaServed": {
            "@type": "City",
            "name": "Mumbai"
          }
        }),
      },
    ],
  }),
  component: HomePage,
});

const TRUST_METRICS = [
  { icon: "🌿", num: "18+", label: "Years of Practice" },
  { icon: "🩺", num: "12,000+", label: "Consultations" },
  { icon: "✅", num: "100%", label: "Natural Remedies" },
  { icon: "📍", num: "Mumbai", label: "Clinic + Online" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Detox Kits": "🧪",
  "Essential Oils": "🫒",
  "Health Powders": "🌾",
  "Herbal Supplements": "💊",
  "Herbal Teas": "🍵",
  "Immunity Boosters": "🛡️",
  "Natural Juices": "🥤",
  "Pure & Natural Honey": "🍯",
  "Skin Care": "✨",
};

const BENEFITS = [
  { icon: "🌱", title: "Root-cause focus", text: "We look at diet, sleep, stress and movement together instead of treating one symptom in isolation." },
  { icon: "🥗", title: "Food-first plans", text: "Practical Indian meal plans built around your kitchen, budget and routine — no imported superfoods." },
  { icon: "🧘", title: "Mind-body practices", text: "Yoga therapy, pranayama and guided relaxation that help manage everyday stress." },
  { icon: "💧", title: "Drug-free therapies", text: "Hydrotherapy, mud therapy, massage and fomentation delivered by trained practitioners." },
  { icon: "🤝", title: "Alongside your doctor", text: "Our care complements prescribed treatment. We never ask you to stop medication." },
  { icon: "📈", title: "Measured, honest progress", text: "Two-weekly reviews with real markers, so you can see what is actually working." },
];

const CARE_STEPS = [
  {
    step: "01",
    icon: "📋",
    title: "In-Depth Assessment",
    badge: "45-Min Intake",
    text: "We review your health history, daily routine, digestion, stress, sleep patterns, and medical reports.",
  },
  {
    step: "02",
    icon: "🥗",
    title: "Root-Cause Protocol",
    badge: "Custom Indian Plan",
    text: "A practical food-first nutrition guide, therapeutic yoga routines, and pure herbal remedies built for your kitchen.",
  },
  {
    step: "03",
    icon: "💧",
    title: "Natural Therapies",
    badge: "Drug-Free Care",
    text: "Targeted hydrotherapy, mud packs, and restorative daily habits that activate your body's innate self-healing.",
  },
  {
    step: "04",
    icon: "📈",
    title: "Bi-Weekly Reviews",
    badge: "Measured Results",
    text: "Regular follow-ups with Dr. Hiral Shah to track measurable markers, refine your routine, and ensure lasting health.",
  },
];

function HomePage() {
  const { setIsBookingOpen } = useECommerce();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-split-section">
        <div className="wrap">
          <div className="hero-split-grid">
            <div className="hero-content">
              <span className="hero-eyebrow">
                🌿 Kiana Naturopathy &amp; Wellness Centre
              </span>
              <h1 className="hero-headline">
                Natural care, designed around your life.
              </h1>
              <p className="hero-lead">
                Personalised naturopathy, nutrition, yoga, and herbal support to help you build healthier routines with confidence.
              </p>
              <div className="hero-cta-group">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Book a Consultation
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => setIsQuizOpen(true)}
                >
                  1-Minute Remedy Quiz
                </button>
              </div>
              <div className="hero-trust-line">
                <span className="hero-trust-badge">🌿 18+ years</span>
                <span className="hero-dot">·</span>
                <span className="hero-trust-badge">🩺 12,000+ consults</span>
                <span className="hero-dot">·</span>
                <span className="hero-trust-badge">⭐ Practitioner-led</span>
              </div>
            </div>

            <div className="hero-visual-wrapper">
              <div className="hero-visual-frame">
                <img
                  src="/assets/img/hero-naturopathy.jpg"
                  alt="Calm naturopathy treatment room at Kiana Wellness Centre"
                />
              </div>
              <div className="hero-floating-card">
                <img
                  src="/assets/img/dr-kiana-profile.jpg"
                  alt="Dr. Hiral Shah"
                  className="hero-floating-avatar"
                />
                <div className="hero-floating-info">
                  <h4>Dr. Hiral Shah, BNYS, MD</h4>
                  <p>Chief Naturopath · Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="trust-metrics-section">
        <div className="wrap">
          <div className="trust-metrics-grid">
            {TRUST_METRICS.map((m) => (
              <div key={m.label} className="trust-metric-card">
                <span className="trust-metric-icon">{m.icon}</span>
                <div>
                  <span className="trust-metric-num">{m.num}</span>
                  <span className="trust-metric-label">{m.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY (replaces Clinical Modalities) ── */}
      <section className="shop-categories-section">
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Shop Natural Remedies</span>
            <h2>Browse by category</h2>
            <p className="lead">
              Practitioner-selected herbal supplements, cold-pressed oils, pure honey, and detox kits — formulated to strict Ayush standards.
            </p>
          </div>

          <div className="shop-cat-grid">
            {categories.slice(0, 6).map((cat) => {
              const sample = products.find((p) => p.category === cat);
              const count = products.filter((p) => p.category === cat).length;
              return (
                <Link key={cat} to="/shop" className="shop-cat-card">
                  <div className="shop-cat-thumb">
                    <img src={sample?.image || "/assets/img/p-supplements.jpg"} alt={cat} loading="lazy" />
                  </div>
                  <div className="shop-cat-body">
                    <span className="shop-cat-icon">{CATEGORY_ICONS[cat] || "🌿"}</span>
                    <h3>{cat}</h3>
                    <span className="shop-cat-count">{count} product{count !== 1 ? "s" : ""}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="center" style={{ marginTop: 28 }}>
            <Link className="btn btn-outline" to="/shop">
              View All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: PATIENT CARE JOURNEY (replaces Featured Remedies) ── */}
      <section className="care-journey-section">
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">How It Works</span>
            <h2>Your 4-step path to natural healing</h2>
            <p className="lead">
              Personalised, drug-free naturopathy care designed around your life — working respectfully alongside your conventional medical treatment.
            </p>
          </div>

          <div className="care-steps-grid">
            {CARE_STEPS.map((s) => (
              <div key={s.step} className="care-step-card">
                <div className="care-step-top">
                  <span className="care-step-number">{s.step}</span>
                  <span className="care-step-icon">{s.icon}</span>
                </div>
                <h3>{s.title}</h3>
                <span className="care-step-badge">{s.badge}</span>
                <p>{s.text}</p>
              </div>
            ))}
          </div>

          <div className="care-journey-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setIsBookingOpen(true)}
            >
              Book a Consultation 🩺
            </button>
            <Link className="btn btn-outline btn-lg" to="/naturopathy">
              Learn More About Our Care →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="founder-editorial-section">
        <div className="wrap">
          <div className="founder-editorial-grid">
            <div className="founder-portrait-wrap">
              <div className="founder-portrait-frame">
                <img
                  src="/assets/img/dr-kiana-profile.jpg"
                  alt="Dr. Hiral Shah - Founder & Chief Naturopath"
                />
                <span className="founder-badge-pill">⭐ 18+ Yrs</span>
              </div>
            </div>

            <div>
              <span className="eyebrow">Meet the Founder</span>
              <h2 className="founder-heading">
                Experience-led care with a practical approach
              </h2>
              <span className="founder-credentials-tag">
                Dr. Hiral Shah · BNYS, MD (Naturopathy &amp; Clinical Nutrition)
              </span>
              <p className="lead" style={{ fontSize: "1.02rem", margin: "12px 0" }}>
                With over 18 years of clinical practice and 12,000+ consultations in Mumbai, Dr. Hiral bridges classical nature cure science with modern nutritional medicine.
              </p>

              <blockquote className="founder-pull-quote">
                "True healing begins when we align daily food, mindful movement, and pure plant remedies with the body's innate wisdom."
              </blockquote>

              <div className="founder-actions">
                <Link className="btn btn-gold" to="/about">
                  Read Dr. Hiral's Story →
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="why-section">
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Our Philosophy</span>
            <h2>Why patients choose Kiana</h2>
          </div>
          <div className="grid g3" style={{ marginTop: 32 }}>
            {BENEFITS.map((b) => (
              <div className="card" key={b.title}>
                <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>{b.icon}</div>
                <h3 style={{ fontSize: "1.15rem", color: "var(--emerald-950)", marginBottom: 6 }}>{b.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONDITIONS ── */}
      <section className="conditions-section">
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Conditions We Support</span>
            <h2>Where naturopathy may help</h2>
          </div>
          <div className="grid g4" style={{ marginTop: 28 }}>
            {conditions.slice(0, 8).map((c) => (
              <Link
                className="card flat"
                key={c.slug}
                to="/conditions/$slug"
                params={{ slug: c.slug }}
                style={{ padding: "18px 16px" }}
              >
                <h3 style={{ fontSize: "1.05rem", color: "var(--emerald-900)", marginBottom: 6 }}>{c.title}</h3>
                <p className="muted" style={{ fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>{c.description}</p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 24 }} className="center">
            <Link className="btn btn-outline" to="/conditions">
              View All Conditions →
            </Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="reviews-section">
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Patient Experiences</span>
            <h2>Stories of healing &amp; vitality</h2>
          </div>

          <div className="reviews-grid">
            {testimonials.slice(0, 3).map((t) => (
              <article key={t.name} className="review-card">
                <div>
                  <div className="review-stars">
                    {"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}
                  </div>
                  <p className="review-quote">"{t.quote}"</p>
                </div>
                <div className="review-author">
                  <span className="review-name">{t.name}</span>
                  <span className="review-city">{t.city}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="center" style={{ marginTop: 24 }}>
            <Link className="btn btn-outline" to="/testimonials">
              Read More Reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONSULT CTA ── */}
      <section style={{ padding: "32px 0 48px" }}>
        <div className="wrap">
          <div className="consult-cta-banner">
            <div className="consult-cta-content">
              <h2>Ready to restore your health naturally?</h2>
              <p>
                Schedule a 45-minute clinical evaluation in Mumbai or connect via secure virtual consultation from home.
              </p>
            </div>
            <div className="consult-cta-actions">
              <button
                type="button"
                className="btn btn-gold btn-lg"
                onClick={() => setIsBookingOpen(true)}
              >
                Book a Consultation
              </button>
              <a
                href="https://wa.me/919876543210?text=Hello%20Dr.%20Hiral%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation%20at%20Kiana%20Naturopathy."
                target="_blank"
                rel="noreferrer"
                className="btn btn-light btn-lg"
              >
                Chat on WhatsApp 💬
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="wrap center" style={{ maxWidth: 600 }}>
          <span className="eyebrow">Welcome Gift</span>
          <h2>Get 10% Off Your First Order</h2>
          <p className="lead" style={{ fontSize: "0.95rem", margin: "6px 0 20px" }}>
            Subscribe to weekly health tips and receive code <strong>KIANA10</strong> for 10% off.
          </p>

          {subscribed ? (
            <div className="notice text-success" style={{ fontSize: "1rem" }}>
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

      {/* ── DISCLAIMER ── */}
      <div className="wrap" style={{ padding: "32px 0 16px" }}>
        <p className="notice">{DISCLAIMER}</p>
      </div>

      <RemedyQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
