import { createFileRoute } from "@tanstack/react-router";

import { DISCLAIMER, PageHead } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Our Clinic & Team — Kiana Naturopathy, Pune" },
      {
        name: "description",
        content:
          "A naturopathy clinic in Pune since 2008. Meet our naturopaths, dietitian, yoga therapist and hydrotherapy team, and read the values we practise by.",
      },
      { property: "og:title", content: "About Kiana Naturopathy & Wellness Centre" },
      { property: "og:description", content: "A clinic built on honest, practical care since 2008." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  "Say only what the evidence supports",
  "Food and routine before supplements",
  "Coordinate with your treating doctor",
  "Follow up until habits hold",
  "Price transparently, never upsell",
];

const TEAM = [
  { name: "Dr. Hiral Shah, BNYS, MD", role: "Founder & Chief Naturopath", text: "18+ years in clinical naturopathy, clinical nutrition, and functional plant remedies.", image: "/assets/img/dr-kiana-profile.jpg" },
  { name: "Dr. Aditya Rane, BNYS", role: "Therapies & Detox Lead", text: "14+ years designing residential detox programmes and supervising fasting protocols." },
  { name: "Kavita Pillai, MSc Dietetics", role: "Clinical Dietitian", text: "Builds regional Indian meal plans for diabetes, PCOS and weight management." },
  { name: "Rohan Kadam", role: "Yoga & Movement", text: "Therapeutic yoga for spine, joint and stress-related concerns." },
  { name: "Dr. Sana Shaikh, BNYS", role: "Women's Wellness", text: "PCOS, cycle health and pre/post-natal lifestyle support." },
  { name: "Nilesh Patil", role: "Massage & Hydrotherapy", text: "Certified therapist delivering herbal oil massage and water therapies." },
];

function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="About us"
        title="A clinic built on honest, practical care"
        lead="We started in 2008 with a simple belief: most people already know what to do — they need a plan that fits their real life, and someone who follows up."
      />

      {/* Featured Founder Spotlight */}
      <section style={{ padding: "60px 0", background: "var(--cream-100)", borderBottom: "1px solid var(--line-gold)" }}>
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: "center", gap: 40 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(6, 78, 59, 0.15)",
                border: "4px solid #fff",
                maxWidth: 420,
                margin: "0 auto"
              }}>
                <img
                  src="/assets/img/dr-kiana-profile.jpg"
                  alt="Dr. Hiral Shah - Founder & Chief Naturopath"
                  style={{ width: "100%", height: 440, objectFit: "cover", objectPosition: "top" }}
                />
              </div>
            </div>

            <div>
              <div className="eyebrow">Founder &amp; Chief Practitioner</div>
              <h2>Dr. Hiral Shah</h2>
              <span className="tag" style={{ background: "var(--emerald-900)", color: "var(--gold-400)", fontSize: "0.9rem", padding: "6px 14px", borderRadius: 50, fontWeight: 700 }}>
                BNYS, MD (Naturopathy &amp; Clinical Nutrition)
              </span>
              <p className="lead" style={{ marginTop: 16 }}>
                Dr. Hiral Shah founded Kiana Naturopathy &amp; Wellness Centre in 2008 to bring drug-free, root-cause healing into everyday Indian households.
              </p>
              <p style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
                Having completed her BNYS degree and MD in Clinical Nutrition with distinction, Dr. Hiral has spent 18+ years perfecting natural protocols for gut health, metabolic balance, hormonal harmony, and stress restoration.
              </p>
              <p style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
                She personally formulates our practitioner-grade herbal teas, cold-pressed oils, and natural supplement blends, ensuring every remedy meets Ayush and GMP standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="grid g2">
            <div className="card">
              <h3>Our mission</h3>
              <p>
                To make natural, drug-free wellness care practical for Indian households — built on
                regional food, realistic routines and honest expectations.
              </p>
              <p className="muted" style={{ margin: 0 }}>
                We do not promise cures. We promise structure, follow-up and care that respects your
                medical treatment.
              </p>
            </div>
            <div className="card">
              <h3>Our values</h3>
              <ul className="ticks">
                {VALUES.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <div className="center">
            <div className="eyebrow">Our team</div>
            <h2>Practitioners you will meet</h2>
          </div>
          <div className="grid g3" style={{ marginTop: 30 }}>
            {TEAM.map((member) => (
              <div className="card" key={member.name} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ height: 220, width: "100%", objectFit: "cover", objectPosition: "top", borderRadius: "8px", marginBottom: 12 }}
                  />
                ) : (
                  <div className="icon-badge">🌿</div>
                )}
                <h3>{member.name}</h3>
                <span className="tag">{member.role}</span>
                <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>{member.text}</p>
              </div>
            ))}
          </div>
          <p className="notice" style={{ marginTop: 28 }}>{DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
