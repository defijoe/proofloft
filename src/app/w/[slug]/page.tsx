// Hosted wall of love: the public, shareable page of a form's approved testimonials.
// The embed (/embed.js) renders the same data on customer sites; this page is the
// zero-setup version — share the link, done.
import { notFound } from "next/navigation";
import { query, one, isPro } from "@factory/core";
import { sourceLabel } from "../../sources";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const form = await one<{ name: string }>(`select name from forms where slug = $1`, [params.slug]);
  return {
    title: form ? `${form.name} — testimonials` : "Wall of love",
    description: form ? `What people say about ${form.name}. Collected with Proofloft.` : undefined,
  };
}

export default async function Wall({ params }: { params: { slug: string } }) {
  const form = await one<{ id: number; name: string; user_id: number }>(
    `select id, name, user_id from forms where slug = $1 and not archived`,
    [params.slug]
  );
  if (!form) notFound();

  const items = await query<{
    author_name: string; author_title: string | null; body: string; rating: number | null;
    source: string | null; source_url: string | null;
  }>(
    `select author_name, author_title, body,
            case when hide_rating then null else rating end as rating,
            source, source_url
     from testimonials
     where form_id = $1 and approved = true and consent = true
     order by created_at desc limit 50`,
    [form!.id]
  );

  // Free tier keeps the badge — badge removal is a paid feature.
  const paid = await isPro(form!.user_id);

  return (
    <div className="dash">
      <section className="section wrap" style={{ paddingTop: 40 }}>
        <div style={{ textAlign: "center" }}>
          <p className="kicker">Wall of love</p>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 10px" }}>
            {form!.name}
          </h1>
          <p style={{ color: "var(--ink-2)", margin: 0 }}>
            {items.length > 0
              ? `${items.length} testimonial${items.length === 1 ? "" : "s"} from real people.`
              : "No published testimonials yet — check back soon."}
          </p>
        </div>

        {items.length > 0 && (
          <div className="wall">
            {items.map((t, i) => (
              <figure className="tcard" key={i}>
                {t.rating ? <div className="stars">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div> : null}
                <blockquote>{t.body}</blockquote>
                <figcaption>
                  <b>{t.author_name}</b>
                  {t.author_title ? ` · ${t.author_title}` : ""}
                  {t.source && (
                    <>
                      {" · "}
                      {t.source_url ? (
                        <a className="tsource" href={t.source_url} target="_blank" rel="noopener nofollow">
                          via {sourceLabel(t.source)} ↗
                        </a>
                      ) : (
                        <span className="tsource">via {sourceLabel(t.source)}</span>
                      )}
                    </>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {!paid && (
          <p className="wall-caption">
            <a href="/?ref=wall" style={{ color: "inherit" }}>Collect testimonials like these with Proofloft →</a>
          </p>
        )}
      </section>
    </div>
  );
}
