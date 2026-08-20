// Blog index — lists posts from the registry, newest first.
import Link from "next/link";
import { POSTS, postDate } from "./posts";

export const metadata = {
  title: "Blog — Proofloft",
  description:
    "Practical guides on collecting and showing client testimonials: how to ask, how to display proof, and how agencies turn praise into pipeline.",
};

export default function Blog() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Blog</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>Turning praise into pipeline</h2>
      <p className="lede">
        Short, practical guides on collecting testimonials and putting them to work.
      </p>
      <div className="legal" style={{ marginTop: 26 }}>
        {posts.map((p, i) => (
          <div key={p.slug} style={i > 0 ? { borderTop: "1px dashed rgba(29,29,31,.13)", marginTop: 22, paddingTop: 22 } : undefined}>
            <h2 style={{ margin: 0 }}>
              <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                {p.title}
              </Link>
            </h2>
            <p style={{ margin: "8px 0 10px" }}>{p.description}</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)" }}>
              {postDate(p.date)} · {p.minutes} min read ·{" "}
              <Link href={`/blog/${p.slug}`} style={{ textDecoration: "underline" }}>
                Read →
              </Link>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
