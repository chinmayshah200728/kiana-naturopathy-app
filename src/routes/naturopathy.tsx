import { createFileRoute } from "@tanstack/react-router";

import { DISCLAIMER, PageHead } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/naturopathy")({
  head: () => ({
    meta: [
      { title: "What is Naturopathy? — Kiana Naturopathy, Mumbai" },
      {
        name: "description",
        content:
          "Naturopathy explained: six principles of natural healing, the therapies we use and how a consultation works at our Mumbai clinic.",
      },
      { property: "og:title", content: "What is Naturopathy? — Kiana Naturopathy" },
      {
        property: "og:description",
        content: "The principles, therapies and consultation process behind drug-free naturopathic care.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NaturopathyPage,
});

const PRINCIPLES = [
  { title: "The healing power of nature", text: "The body has an inherent ability to maintain and restore balance when the conditions are right." },
  { title: "Identify the root cause", text: "Look past the symptom to routine, diet, sleep and stress patterns behind it." },
  { title: "First, do no harm", text: "Use the least invasive approach that may help, and never interfere with prescribed treatment." },
  { title: "Treat the whole person", text: "Physical, emotional and lifestyle factors are assessed together." },
  { title: "Doctor as teacher", text: "You leave understanding why each change is being asked of you." },
  { title: "Prevention is best", text: "Habits that hold up over years matter more than short bursts of effort." },
];

const STEPS = [
  { step: "Step 1", title: "Assessment", text: "A 45-minute review of history, diet, sleep, stress, activity and any lab reports." },
  { step: "Step 2", title: "Personal plan", text: "A written plan: meals, therapies, movement and sleep targets for the coming weeks." },
  { step: "Step 3", title: "Therapies & practice", text: "In-clinic sessions where useful, plus a home routine that fits your schedule." },
  { step: "Step 4", title: "Review & adjust", text: "Follow-ups every two weeks to measure what changed and adjust the plan." },
];

function NaturopathyPage() {
  return (
    <>
      <PageHead
        eyebrow="Naturopathy"
        title="A drug-free approach to everyday health"
        lead="Naturopathy uses food, water, movement, rest and natural therapies to support the body's own capacity to stay well — always alongside your medical treatment."
      />

      <section>
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: "center" }}>
            <img
              src="/assets/img/therapies.jpg"
              alt="Naturopathy therapy room"
              style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
            />
            <div>
              <h2>A short history</h2>
              <p>
                Modern naturopathy grew out of the 19th-century European nature-cure movement, with
                water therapy pioneers such as Priessnitz and Kneipp. In India it found deep
                resonance with traditional practice and was championed by Mahatma Gandhi, who wrote
                extensively on diet, fasting and natural living.
              </p>
              <p className="notice">{DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <div className="center">
            <div className="eyebrow">Foundations</div>
            <h2>Six principles of natural healing</h2>
          </div>
          <div className="grid g3" style={{ marginTop: 30 }}>
            {PRINCIPLES.map((p, i) => (
              <div className="card" key={p.title}>
                <div className="icon-badge">{i + 1}</div>
                <h3>{p.title}</h3>
                <p className="muted" style={{ margin: 0 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="center">
            <div className="eyebrow">How it works</div>
            <h2>Your consultation, step by step</h2>
          </div>
          <div className="grid g4" style={{ marginTop: 30 }}>
            {STEPS.map((s) => (
              <div className="card" key={s.step}>
                <span className="tag">{s.step}</span>
                <h3 style={{ marginTop: 10 }}>{s.title}</h3>
                <p className="muted" style={{ margin: 0 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap center">
          <h2>Naturopathy alongside conventional care</h2>
          <p className="lead">
            We do not replace your doctor. We share your plan with them where helpful, keep
            prescriptions untouched, and focus on the lifestyle side of your care.
          </p>
        </div>
      </section>
    </>
  );
}
