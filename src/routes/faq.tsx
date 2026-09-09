import { createFileRoute } from "@tanstack/react-router";

import { PageHead } from "@/components/site/SiteLayout";
import { faqs } from "@/data/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Naturopathy FAQ — Consultations, Safety & Orders | Kiana" },
      {
        name: "description",
        content:
          "Answers to the questions we are asked most about naturopathy consultations, medication safety, online sessions, products and delivery.",
      },
      { property: "og:title", content: "Naturopathy FAQ — Kiana Naturopathy" },
      { property: "og:description", content: "Questions we are asked most, answered plainly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHead
        eyebrow="FAQ"
        title="Questions we are asked most"
        lead="If your question is not here, message us on WhatsApp and a practitioner will reply."
      />
      <section>
        <div className="wrap" style={{ maxWidth: 820 }}>
          {faqs.map((item) => (
            <details className="acc" key={item.q}>
              <summary>{item.q}</summary>
              <div className="ans">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
