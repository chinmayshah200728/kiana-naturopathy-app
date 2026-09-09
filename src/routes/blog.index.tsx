import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHead } from "@/components/site/SiteLayout";
import { posts } from "@/data/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Wellness Blog — Practical Natural Health Writing | Kiana" },
      {
        name: "description",
        content:
          "Short, honest articles on food, movement, sleep, detox and natural remedies, written by our naturopathy practitioners in Pune.",
      },
      { property: "og:title", content: "Wellness Blog — Kiana Naturopathy" },
      {
        property: "og:description",
        content: "Practical wellness writing from practising naturopaths.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <PageHead
        eyebrow="Blog"
        title="Practical wellness writing"
        lead="Short, honest articles on food, movement, sleep and natural remedies — written by our practitioners."
      />
      <section>
        <div className="wrap">
          <div className="grid g3">
            {posts.map((post) => (
              <Link className="card flat" key={post.slug} to="/blog/$slug" params={{ slug: post.slug }}>
                <span className="tag">{post.category}</span>
                <h3 style={{ marginTop: 10 }}>{post.title}</h3>
                <p className="muted" style={{ fontSize: ".92rem", margin: 0 }}>{post.lead}</p>
                <p className="muted" style={{ fontSize: ".82rem", marginTop: 10 }}>{post.meta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
