import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { DISCLAIMER, PageHead } from "@/components/site/SiteLayout";
import { getPost, posts } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found — Kiana Naturopathy" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} — Kiana Naturopathy Blog` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <section className="wrap" style={{ padding: "60px 0" }}>
      <h1>Article not found</h1>
      <Link className="btn btn-primary" to="/blog">Back to the blog</Link>
    </section>
  ),
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHead eyebrow={post.category} title={post.title} lead={post.lead} />
      <section>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <p className="breadcrumb">
            <Link to="/blog">Blog</Link> / {post.title}
          </p>
          <p className="muted" style={{ fontSize: ".86rem" }}>{post.meta}</p>
          {post.paragraphs.map((para: string, index: number) => (
            <p key={index}>{para}</p>
          ))}
          <p className="notice">{DISCLAIMER}</p>
        </div>
      </section>
      <section className="alt">
        <div className="wrap">
          <h2>More reading</h2>
          <div className="grid g3" style={{ marginTop: 18 }}>
            {others.map((p) => (
              <Link className="card flat" key={p.slug} to="/blog/$slug" params={{ slug: p.slug }}>
                <span className="tag">{p.category}</span>
                <h3 style={{ marginTop: 10 }}>{p.title}</h3>
                <p className="muted" style={{ fontSize: ".9rem", margin: 0 }}>{p.lead}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
