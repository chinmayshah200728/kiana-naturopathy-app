import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { DISCLAIMER } from "@/components/site/SiteLayout";
import { RemedyQuizModal } from "@/components/ecommerce/RemedyQuizModal";
import { conditions } from "@/data/conditions";
import { products } from "@/data/products";
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
  {
    num: "18+",
    label: "Years of Practice",
    sub: "Dedicated clinical naturopathy experience in Mumbai",
  },
  {
    num: "12,000+",
    label: "Consultations",
    sub: "Patients guided toward lasting, drug-free wellness",
  },
  {
    num: "100%",
    label: "Natural Remedies",
    sub: "Pure herbal formulations with zero synthetic additives",
  },
  {
    num: "Mumbai + Online",
    label: "Clinic & Telehealth",
    sub: "In-person appointments and secure virtual care pan-India",
  },
];

const SERVICES = [
  {
    icon: "🥗",
    title: "Diet Therapy",
    description:
      "Personalised Indian nutritional plans crafted to soothe digestion, reduce systemic inflammation, and restore metabolic balance without restrictive deprivation.",
    link: "/naturopathy",
  },
  {
    icon: "🧘",
    title: "Therapeutic Yoga",
    description:
      "Restorative posture sequences, disease-targeted asanas, and somatic breathwork designed around your flexibility, spinal health, and daily energy levels.",
    link: "/naturopathy",
  },
  {
    icon: "💧",
    title: "Hydrotherapy",
    description:
      "Targeted thermal and contrast water applications that enhance venous return, stimulate deep cellular detox, and strengthen autonomic nervous system tone.",
    link: "/naturopathy",
  },
  {
    icon: "🌿",
    title: "Mud Therapy",
    description:
      "Mineral-dense therapeutic earth applications that absorb localized metabolic toxins, cool visceral heat, and promote radiant skin and tissue healing.",
    link: "/naturopathy",
  },
  {
    icon: "🍃",
    title: "Herbal Support",
    description:
      "Practitioner-formulated whole-plant extracts, decoctions, and restorative botanicals selected to nourish your endocrine and digestive systems.",
    link: "/naturopathy",
  },
  {
    icon: "☀️",
    title: "Lifestyle Guidance",
    description:
      "Circadian rhythm re-alignment, therapeutic sleep hygiene routines, and compassionate habit coaching for sustained long-term health.",
    link: "/naturopathy",
  },
];

const BENEFITS = [
  { icon: "🌱", title: "Root-cause focus", text: "We look at diet, sleep, stress and movement together instead of treating one symptom in isolation." },
  { icon: "🥗", title: "Food-first plans", text: "Practical Indian meal plans built around your kitchen, budget and routine — no imported superfoods." },
  { icon: "🧘", title: "Mind-body practices", text: "Yoga therapy, pranayama and guided relaxation that help manage everyday stress." },
  { icon: "💧", title: "Drug-free therapies", text: "Hydrotherapy, mud therapy, massage and fomentation delivered by trained practitioners." },
  { icon: "🤝", title: "Alongside your doctor", text: "Our care complements prescribed treatment. We never ask you to stop medication." },
  { icon: "📈", title: "Measured, honest progress", text: "Two-weekly reviews with real markers, so you can see what is actually working." },
];

function HomePage() {
  const { setIsBookingOpen } = useECommerce();
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
      {/* 3. Hero Section: Split-Screen Botanical Hero */}
      <section className="hero-split-section">
        <div className="wrap">
          <div className="hero-split-grid">
            {/* Left Column: Content */}
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
                  Book a Consultation 🩺
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => setIsQuizOpen(true)}
                >
                  Take the 1-Minute Remedy Quiz ✨
                </button>
              </div>
              <div className="hero-trust-line">
                <span className="hero-trust-badge">
                  <span>🌿</span> 18+ years of practice
                </span>
                <span>·</span>
                <span className="hero-trust-badge">
                  <span>🩺</span> 12,000+ consultations
                </span>
                <span>·</span>
                <span className="hero-trust-badge">
                  <span>⭐</span> Practitioner-led care
                </span>
              </div>
            </div>

            {/* Right Column: Visual Frame */}
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
                  alt="Dr. Hiral Shah - Chief Naturopath"
                  className="hero-floating-avatar"
                />
                <div className="hero-floating-info">
                  <h4>Dr. Hiral Shah, BNYS, MD</h4>
                  <p>Chief Naturopath · 18+ Yrs Practice (Mumbai)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Metrics */}
      <section className="trust-metrics-section">
        <div className="wrap">
          <div className="trust-metrics-grid">
            {TRUST_METRICS.map((metric) => (
              <div key={metric.label} className="trust-metric-card">
                <span className="trust-metric-num">{metric.num}</span>
                <span className="trust-metric-label">{metric.label}</span>
                <span className="trust-metric-sub">{metric.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Services Section */}
      <section className="services-section">
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Our Clinical Modalities</span>
            <h2>Whole-person care, made practical</h2>
            <p className="lead">
              Evidence-informed naturopathy therapies integrated into one personalised lifestyle prescription designed for sustainable everyday health.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => (
              <article key={s.title} className="service-card">
                <div className="service-icon-box">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <Link to={s.link} className="service-learn-more">
                  Learn more about {s.title} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Products Section */}
      <section style={{ padding: "80px 0", background: "#FFFFFF", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Practitioner-Selected Remedies</span>
            <h2>Pure, Clinically Formulated Herbal Remedies</h2>
            <p className="lead">
              Herbal supplements, cold-pressed oils, pure mountain honey, and detox kits — formulated to strict Ayush standards with zero chemical additives.
            </p>
          </div>

          <div className="grid g4" style={{ marginTop: 40 }}>
            {featured.map((p) => (
              <ProductCard product={p} key={p.slug} />
            ))}
          </div>

          <div className="center" style={{ marginTop: 36 }}>
            <Link className="btn btn-primary btn-lg" to="/shop">
              View All Products ({products.length}) →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Founder Section */}
      <section className="founder-editorial-section">
        <div className="wrap">
          <div className="founder-editorial-grid">
            <div className="founder-portrait-wrap">
              <div className="founder-portrait-frame">
                <img
                  src="/assets/img/dr-kiana-profile.jpg"
                  alt="Dr. Hiral Shah - Founder & Chief Naturopath"
                />
                <span className="founder-badge-pill">⭐ 18+ Yrs Experience</span>
              </div>
            </div>

            <div>
              <span className="eyebrow">Meet the Founder</span>
              <h2 style={{ fontSize: "2.4rem", color: "var(--emerald-950)", margin: "0 0 6px" }}>
                Experience-led care with a practical approach
              </h2>
              <span className="founder-credentials-tag">
                Dr. Hiral Shah · BNYS, MD (Naturopathy &amp; Clinical Nutrition)
              </span>
              <p className="lead" style={{ fontSize: "1.06rem", margin: "14px 0" }}>
                With over 18 years of clinical practice and more than 12,000 personal patient consultations in Mumbai, Dr. Hiral bridges classical nature cure science with modern nutritional medicine.
              </p>
              <p style={{ color: "var(--ink-700)", lineHeight: 1.7, margin: "0 0 16px" }}>
                Her approach is patient-first and drug-free: identifying root drivers rather than suppressing symptoms, simplifying your daily nutrition without foreign ingredients, and working collaboratively alongside your existing medical treatments to help you rebuild vitality sustainably.
              </p>

              <blockquote className="founder-pull-quote">
                “True healing begins when we align daily food, mindful movement, and pure plant remedies with the body’s innate wisdom.”
              </blockquote>

              <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
                <Link className="btn btn-gold" to="/about">
                  Read Dr. Hiral’s Story →
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Book a Consultation 🩺
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Why Choose Us */}
      <section className="alt" style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Our Philosophy</span>
            <h2>Why patients choose Kiana Naturopathy</h2>
            <p className="lead">
              Six foundational principles that make our clinical care grounded, safe, and effective.
            </p>
          </div>
          <div className="grid g3" style={{ marginTop: 40 }}>
            {BENEFITS.map((b) => (
              <div className="card" key={b.title}>
                <div className="icon-badge" style={{ fontSize: "1.6rem", marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontSize: "1.2rem", color: "var(--emerald-950)", marginBottom: 8 }}>{b.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.6 }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Conditions We Support */}
      <section style={{ padding: "80px 0", background: "#FFFFFF", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Conditions We Support</span>
            <h2>Where naturopathy may help</h2>
            <p className="lead">
              Personalised natural protocols to help you manage chronic imbalances and build lasting vitality.
            </p>
          </div>
          <div className="grid g4" style={{ marginTop: 36 }}>
            {conditions.slice(0, 8).map((c) => (
              <Link
                className="card flat"
                key={c.slug}
                to="/conditions/$slug"
                params={{ slug: c.slug }}
                style={{ padding: "22px 20px" }}
              >
                <h3 style={{ fontSize: "1.1rem", color: "var(--emerald-900)", marginBottom: 8 }}>{c.title}</h3>
                <p className="muted" style={{ fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>{c.description}</p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 32 }} className="center">
            <Link className="btn btn-outline" to="/conditions">
              View All Conditions ({conditions.length}) →
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Verified Patient Reviews */}
      <section style={{ padding: "80px 0", background: "var(--cream-50)" }}>
        <div className="wrap">
          <div className="center">
            <span className="eyebrow">Patient Experiences</span>
            <h2>Stories of healing &amp; vitality</h2>
            <p className="lead">
              Real experiences from patients who transformed their daily health through our Mumbai clinic and telehealth consultations.
            </p>
          </div>

          <div className="reviews-grid">
            {testimonials.slice(0, 3).map((t) => (
              <article key={t.name} className="review-card">
                <div>
                  <div style={{ color: "#F59E0B", fontSize: "1.1rem", letterSpacing: "2px" }}>
                    {"★".repeat(t.stars)}
                  </div>
                  <p className="review-quote">“{t.quote}”</p>
                </div>
                <div className="review-author">
                  <span className="review-name">{t.name}</span>
                  <span className="review-city">{t.city}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="center" style={{ marginTop: 32 }}>
            <Link className="btn btn-outline" to="/testimonials">
              Read More Patient Reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Consultation Call to Action Banner */}
      <section style={{ padding: "40px 0 60px" }}>
        <div className="wrap">
          <div className="consult-cta-banner">
            <div className="consult-cta-content">
              <h2>Ready to restore your health naturally?</h2>
              <p>
                Schedule an in-depth 45-minute clinical evaluation at our Mumbai centre or connect via secure virtual video consultation from the comfort of your home.
              </p>
            </div>
            <div className="consult-cta-actions">
              <button
                type="button"
                className="btn btn-gold btn-lg"
                onClick={() => setIsBookingOpen(true)}
              >
                Book a Consultation 🩺
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

      {/* 12. Newsletter Section */}
      <section style={{ background: "var(--cream-100)", borderTop: "1px solid var(--line-gold)", borderBottom: "1px solid var(--line-gold)", padding: "60px 0" }}>
        <div className="wrap center" style={{ maxWidth: 640 }}>
          <span style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}>💌</span>
          <span className="eyebrow">Welcome Gift</span>
          <h2>Get 10% Off Your First Order</h2>
          <p className="lead" style={{ fontSize: "0.98rem", margin: "8px 0 24px" }}>
            Subscribe to our weekly natural health tips and receive promo code <strong>KIANA10</strong> for 10% off your remedy order.
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

      {/* 13. Regulatory Disclaimer */}
      <div className="wrap" style={{ padding: "40px 0 20px" }}>
        <p className="notice">{DISCLAIMER}</p>
      </div>

      {/* Remedy Quiz Modal */}
      <RemedyQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
