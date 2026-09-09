import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { DISCLAIMER, PageHead } from "@/components/site/SiteLayout";
import { conditions, getCondition, type Condition } from "@/data/conditions";

export const Route = createFileRoute("/conditions/$slug")({
  loader: ({ params }) => {
    const condition = getCondition(params.slug);
    if (!condition) throw notFound();
    return { condition };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Condition not found — Kiana Naturopathy" }, { name: "robots", content: "noindex" }],
      };
    }
    const { condition } = loaderData;
    return {
      meta: [
        { title: `${condition.title} — Naturopathy Support | Kiana Naturopathy` },
        { name: "description", content: condition.description },
        { property: "og:title", content: `${condition.title} — Naturopathy Support` },
        { property: "og:description", content: condition.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ConditionPage,
  notFoundComponent: ConditionNotFound,
});

function ConditionNotFound() {
  return (
    <section className="wrap" style={{ padding: "60px 0" }}>
      <h1>Condition not found</h1>
      <p className="lead">That page has moved. Browse all the concerns we support instead.</p>
      <Link className="btn btn-primary" to="/conditions">All conditions</Link>
    </section>
  );
}

function ConditionPage() {
  const { condition } = Route.useLoaderData();
  const others = conditions.filter((c) => c.slug !== condition.slug).slice(0, 3);

  return (
    <>
      <PageHead eyebrow="Conditions" title={condition.title} lead={condition.lead} />
      <section>
        <div className="wrap">
          <p className="breadcrumb">
            <Link to="/conditions">Conditions</Link> / {condition.title}
          </p>
          <div className="grid g2">
            {condition.cards.map((card: Condition["cards"][number]) => (
              <div className="card" key={card.title}>
                <h3>{card.title}</h3>
                <ul className="ticks">
                  {card.items.map((item: string) => (

                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="notice" style={{ marginTop: 28 }}>{DISCLAIMER}</p>
          <div style={{ marginTop: 34 }}>
            <h2>Other concerns we support</h2>
            <div className="grid g3" style={{ marginTop: 16 }}>
              {others.map((c) => (
                <Link className="card flat" key={c.slug} to="/conditions/$slug" params={{ slug: c.slug }}>
                  <h3>{c.title}</h3>
                  <p className="muted" style={{ fontSize: ".9rem", margin: 0 }}>{c.description}</p>
                </Link>
              ))}
            </div>
          </div>
          <p style={{ marginTop: 26 }}>
            <Link className="btn btn-primary" to="/shop">Explore the wellness shop</Link>
          </p>
        </div>
      </section>
    </>
  );
}
