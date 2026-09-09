import { createFileRoute, Link } from "@tanstack/react-router";

import { DISCLAIMER, PageHead } from "@/components/site/SiteLayout";
import { conditions } from "@/data/conditions";

export const Route = createFileRoute("/conditions/")({
  head: () => ({
    meta: [
      { title: "Conditions We Support — Kiana Naturopathy" },
      {
        name: "description",
        content:
          "Supportive naturopathic lifestyle care for twelve common concerns including diabetes, hypertension, PCOS, arthritis, migraine and digestive problems.",
      },
      { property: "og:title", content: "Conditions We Support — Kiana Naturopathy" },
      {
        property: "og:description",
        content: "Twelve health concerns where naturopathy may help alongside medical treatment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConditionsPage,
});

function ConditionsPage() {
  return (
    <>
      <PageHead
        eyebrow="Conditions"
        title="Concerns where naturopathy may help"
        lead="Supportive lifestyle care for twelve common health concerns — always alongside, never instead of, your medical treatment."
      />
      <section>
        <div className="wrap">
          <div className="grid g3">
            {conditions.map((c) => (
              <Link className="card flat" key={c.slug} to="/conditions/$slug" params={{ slug: c.slug }}>
                <h3>{c.title}</h3>
                <p className="muted" style={{ fontSize: ".92rem", margin: 0 }}>{c.description}</p>
              </Link>
            ))}
          </div>
          <p className="notice" style={{ marginTop: 28 }}>{DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
