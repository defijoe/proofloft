// Hosted wall of love: the public, shareable page of a form's approved testimonials.
// The embed (/embed.js) renders the same data on customer sites; this page is the
// zero-setup version — share the link, done.
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { query, one, isPro, readSession, SESSION_COOKIE } from "@factory/core";
import { sourceLabel } from "../../sources";
import CopyButton from "../../dashboard/copy-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const form = await one<{ name: string }>(
    `select name from forms where slug = $1 and not archived`,
    [params.slug]
  );
  const title = form ? `${form.name} — testimonials` : "Wall of love";
  const description = form
    ? `What people say about ${form.name}. Collected with Proofloft.`
    : undefined;
  return {
    title,
    description,
    // og:image comes from the opengraph-image.tsx file convention alongside this page.
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Proofloft",
      url: `https://proofloft.com/w/${params.slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Wall({ params }: { params: { slug: string } }) {
  const form = await one<{ id: number; name: string; user_id: number; theme: string; layout: string }>(
    `select id, name, user_id, theme, layout from forms where slug = $1 and not archived`,
    [params.slug]
  );
  if (!form) notFound();
  const dark = form!.theme === "dark";
  const list = form!.layout === "list";

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

  // Owner check: the share/embed box below renders ONLY for the signed-in owner.
  // Visitors and clients never see it — walls stay white-label.
  const viewer = readSession(cookies().get(SESSION_COOKIE)?.value);
  const isOwner = !!viewer && Number(viewer.id) === Number(form!.user_id);
  const wallUrl = `https://proofloft.com/w/${params.slug}`;
  const embedCode = `<div data-proofloft="${params.slug}"></div><script src="https://proofloft.com/embed.js" async></script>`;

  return (
    <div className={dark ? "dash wall-dark" : "dash"}>
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
          <div className={list ? "wall list" : "wall"}>
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

        {/* Owner-only share box — invisible to visitors, so walls stay white-label. */}
        {isOwner && (
          <div className="mx-auto mt-12 max-w-[760px] rounded-2xl border-2 border-dashed border-[#cfc9b8] bg-white p-6 text-left shadow-card sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="m-0 font-display text-[20px] font-bold text-[#1a1611]">Put this wall to work</h2>
              <span className="rounded-full bg-[#fdf3e0] px-3 py-1 text-[12px] font-bold text-[#8a4a06]">Only you can see this box</span>
            </div>
            <div className="mt-5 grid gap-5">
              {/* Step 1 — share the link */}
              <div className="flex items-start gap-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[14px] font-bold text-white">1</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-semibold text-[#1a1611]">Share the link</div>
                  <p className="m-0 mt-1 flex flex-wrap items-center gap-2 text-[14px] leading-relaxed text-[#57503f]">
                    <span>Drop it in proposals, invoices, email signatures, or social posts — it unfurls with a preview card:</span>
                  </p>
                  <p className="m-0 mt-2 flex flex-wrap items-center gap-2">
                    <code className="break-all rounded-lg bg-[#f2efe6] px-2.5 py-1 font-mono text-[12.5px] text-[#4a463e]">{wallUrl}</code>
                    <CopyButton text={wallUrl} label="Copy link" />
                  </p>
                </div>
              </div>
              {/* Step 2 — embed on any site */}
              <div className="flex items-start gap-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[14px] font-bold text-white">2</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-semibold text-[#1a1611]">Or embed it on any website</div>
                  <p className="m-0 mt-1 text-[14px] leading-relaxed text-[#57503f]">
                    Copy this code and paste it into an HTML block on your site (or your client&rsquo;s) — WordPress,
                    Webflow, Squarespace, Framer, plain HTML — wherever the wall should appear:
                  </p>
                  <p className="m-0 mt-2 flex flex-wrap items-center gap-2">
                    <code className="break-all rounded-lg bg-[#f2efe6] px-2.5 py-1 font-mono text-[12.5px] text-[#4a463e]">{embedCode}</code>
                    <CopyButton text={embedCode} label="Copy code" />
                  </p>
                </div>
              </div>
              {/* Step 3 — it updates itself */}
              <div className="flex items-start gap-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[14px] font-bold text-white">3</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-semibold text-[#1a1611]">That&rsquo;s it — it stays fresh on its own</div>
                  <p className="m-0 mt-1 text-[14px] leading-relaxed text-[#57503f]">
                    Every testimonial you approve appears here and in every embed automatically.
                    Change the look (light/dark, cards/list) any time from your{" "}
                    <a href="/dashboard" className="flink">dashboard</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
