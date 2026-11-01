import { createFileRoute } from "@tanstack/react-router";

import { DISCLAIMER, PageHead } from "@/components/site/SiteLayout";
import { testimonials } from "@/data/testimonials";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Stories & Reviews — Kiana Naturopathy" },
      {
        name: "description",
        content:
          "Personal accounts from people who followed our naturopathy programmes in Mumbai — diet therapy, detox, yoga and PCOS support.",
      },
      { property: "og:title", content: "Client Stories — Kiana Naturopathy" },
      { property: "og:description", content: "Experiences shared by people who followed our programmes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <>
      <PageHead
        eyebrow="Testimonials"
        title="Stories from our clients"
        lead="Experiences shared by people who followed our programmes. Individual results vary — these are personal accounts, not clinical claims."
      />
      <section>
        <div className="wrap">
          <div className="grid g3">
            {testimonials.map((t) => (
              <div className="card" key={t.name}>
                <div className="stars">{"★".repeat(t.stars)}</div>
                <p style={{ fontSize: ".96rem" }}>“{t.quote}”</p>
                <strong>{t.name}</strong>
                <br />
                <span className="muted" style={{ fontSize: ".86rem" }}>{t.city}</span>
              </div>
            ))}
          </div>
          <p className="notice" style={{ marginTop: 28 }}>{DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
