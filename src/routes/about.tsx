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
  { name: "Dr. Meenal Joshi, BNYS", role: "Chief Naturopath", text: "18 years in clinical naturopathy, with a focus on metabolic and digestive concerns." },
  { name: "Dr. Aditya Rane, BNYS", role: "Therapies & Detox Lead", text: "Designs residential detox programmes and supervises fasting protocols." },
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
              <div className="card" key={member.name}>
                <div className="icon-badge">🌿</div>
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
