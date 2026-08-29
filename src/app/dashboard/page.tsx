// Owner dashboard: login gate, stat tiles, client workspaces (Agency), forms, approvals.
import Link from "next/link";
import { cookies } from "next/headers";
import {
  readSession,
  SESSION_COOKIE,
  query,
  one,
  getPlan,
} from "@factory/core";
import {
  approveAction,
  archiveFormAction,
  createFormAction,
  createWorkspaceAction,
  checkoutAction,
  deleteTestimonialAction,
  deleteWorkspaceAction,
  importTestimonialAction,
  loginAction,
  codeLoginAction,
  renameFormAction,
  renameWorkspaceAction,
  toggleRatingAction,
  unpublishAction,
  wallAppearanceAction,
} from "./actions";
import ConfirmButton from "./confirm-button";
import CopyButton from "./copy-button";
import { SOURCE_LABELS, sourceLabel } from "../sources";

export const dynamic = "force-dynamic";

const PLAN_LABEL = { free: "Free plan", pro: "Pro plan", agency: "Agency plan" } as const;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { ws?: string; sent?: string; login?: string; code?: string };
}) {
  const user = readSession(cookies().get(SESSION_COOKIE)?.value);

  if (!user) {
    const sent = !!searchParams.sent;
    return (
      <div className="dash">
        <div className="signin-card">
          <h1>Sign in</h1>
          <p className="sub">
            {sent
              ? "Check your email and click the sign-in link — you’ll land right back here."
              : "We’ll email you a one-click sign-in link — no password needed."}
          </p>
          {sent && !searchParams.code && (
            <p className="notice-ok">Email sent! Click the link inside — it expires in 15 minutes.</p>
          )}
          {searchParams.code === "bad" && (
            <p className="notice-warn">That code didn&rsquo;t match or has expired — check the digits, or request a fresh email below.</p>
          )}
          {searchParams.login === "expired" && (
            <p className="notice-warn">That sign-in link expired or was already used — request a fresh one below.</p>
          )}

          {sent && (
            <>
              <details className="signin-code" open={searchParams.code === "bad"}>
                <summary>Link not working? Enter the code from the email instead</summary>
                <form action={codeLoginAction} className="dash-form" style={{ marginTop: 12 }}>
                  <input name="email" type="email" required placeholder="you@company.com" className="dash-input" />
                  <input
                    name="code"
                    required
                    placeholder="123456"
                    className="dash-input code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                  <button className="dash-btn">Sign in</button>
                </form>
              </details>
              <p className="signin-alt">No email after a minute? Check spam, or request a fresh one:</p>
            </>
          )}
          <form action={loginAction} className="dash-form">
            <input name="email" type="email" required placeholder="you@company.com" className="dash-input" />
            <button className="dash-btn">{sent ? "Resend email" : "Email me a link"}</button>
          </form>
          {!sent && (
            <p className="signin-new">
              <b>New here?</b> Same box — enter your email and we&rsquo;ll create your account on
              the spot. Free plan, no card needed.
            </p>
          )}
        </div>
      </div>
    );
  }

  const plan = await getPlan(user.id);
  const paid = plan !== "free";

  const workspaces = await query<{ id: number; name: string; forms: string }>(
    `select w.id, w.name, count(f.id) as forms
     from workspaces w left join forms f on f.workspace_id = w.id
     where w.user_id = $1 group by w.id order by w.name`,
    [user.id]
  );

  // Active workspace filter (?ws=<id>). pg returns bigserial ids as strings — compare numerically.
  const wsParam = Number(searchParams.ws);
  const activeWs = workspaces.find((w) => Number(w.id) === wsParam) ?? null;

  const forms = await query<{
    id: number; slug: string; name: string; ws_name: string | null; total: string; pending: string;
    organic: string; organic_pub: string;
    theme: string; layout: string;
  }>(
    `select f.id, f.slug, f.name, f.theme, f.layout, w.name as ws_name,
            count(t.id) as total,
            count(t.id) filter (where not t.approved) as pending,
            count(t.id) filter (where t.source is null) as organic,
            count(t.id) filter (where t.source is null and t.approved) as organic_pub
     from forms f
     left join workspaces w on w.id = f.workspace_id
     left join testimonials t on t.form_id = f.id
     where f.user_id = $1 and not f.archived ${activeWs ? "and f.workspace_id = $2" : ""}
     group by f.id, w.name order by f.id desc`,
    activeWs ? [user.id, activeWs.id] : [user.id]
  );

  const totals = await one<{ total: string; pending: string; forms: string }>(
    `select count(t.id) as total,
            count(t.id) filter (where not t.approved) as pending,
            count(distinct f.id) as forms
     from forms f left join testimonials t on t.form_id = f.id
     where f.user_id = $1 and not f.archived`,
    [user.id]
  );

  const pendingItems = await query<{ id: number; author_name: string; author_title: string | null; rating: number | null; body: string; form_name: string }>(
    `select t.id, t.author_name, t.author_title, t.rating, t.body, f.name as form_name
     from testimonials t join forms f on f.id = t.form_id
     where f.user_id = $1 and not f.archived and not t.approved order by t.created_at desc limit 20`,
    [user.id]
  );

  const publishedItems = await query<{ id: number; author_name: string; author_title: string | null; rating: number | null; hide_rating: boolean; body: string; form_name: string; source: string | null }>(
    `select t.id, t.author_name, t.author_title, t.rating, t.hide_rating, t.body, f.name as form_name, t.source
     from testimonials t join forms f on f.id = t.form_id
     where f.user_id = $1 and not f.archived and t.approved order by t.created_at desc limit 30`,
    [user.id]
  );

  // Funnel: form views per form, from the cookieless events tally.
  const viewRows = await query<{ form_id: string; views: string }>(
    `select (meta->>'formId')::bigint as form_id, count(*) as views
     from events
     where app = 'testimonial' and name = 'form_view'
     group by 1`
  );
  const viewsByForm = new Map(viewRows.map((v) => [Number(v.form_id), Number(v.views)]));
  const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : null);

  const nPending = Number(totals?.pending ?? 0);

  return (
    <div className="dash">
      <div className="dash-wrap">
        <div className="dash-top">
          <Link href="/" className="dash-logo">Proof<em>loft</em></Link>
          <div className="dash-top-right">
            <span className={`plan-chip ${plan}`}><span className="dot" />{PLAN_LABEL[plan]}</span>
            {plan === "free" && (
              <form action={checkoutAction} style={{ display: "inline" }}>
                <input type="hidden" name="plan" value="pro" />
                <button className="dash-btn sm">Upgrade to Pro — $19/mo</button>
              </form>
            )}
            {plan !== "agency" && (
              <form action={checkoutAction} style={{ display: "inline" }}>
                <input type="hidden" name="plan" value="agency" />
                <button className="dash-btn sm yellow">Agency — $49/mo</button>
              </form>
            )}
            <Link href="/dashboard/account" className="dash-navlink">Account</Link>
            <a href="/api/auth/logout" className="dash-navlink">Sign out</a>
          </div>
        </div>

        <div className="dash-head">
          <h1>Dashboard</h1>
          <p className="dash-sub">{user.email}</p>
        </div>

        {/* Onboarding — numbered step cards, shown until the first testimonial arrives. */}
        {Number(totals?.total ?? 0) === 0 && (
          <div className="mb-9">
            <h2 className="m-0 text-[clamp(24px,3.2vw,32px)]">Let&rsquo;s get your first testimonial</h2>
            <p className="mt-2 text-[16px] text-ink-2">
              Three steps — under two minutes. This guide disappears after your first testimonial.
            </p>
            <div className="mt-6 grid gap-5">
              {/* Step 1 — create a form (embedded right here) */}
              <div className={`rounded-2xl bg-white p-6 shadow-card sm:p-7 ${forms.length === 0 ? "border-2 border-navy" : "border border-line"}`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[18px] font-bold text-white">1</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 text-[19px]">Create a form for a project or client</h3>
                    {forms.length === 0 ? (
                      <>
                        <p className="mt-2 text-[16px] leading-relaxed text-ink-2">
                          Name it after the engagement — e.g. &ldquo;Acme website redesign&rdquo;.
                          {plan === "agency" && <> (You can group forms into client workspaces below.)</>}
                        </p>
                        <form action={createFormAction} className="mt-4 flex flex-wrap gap-3">
                          <input
                            name="name"
                            required
                            placeholder="Form name, e.g. Acme website redesign"
                            className="dash-input"
                            style={{ fontSize: 16, padding: "14px 20px", flex: "1 1 260px" }}
                          />
                          <button className="dash-btn">Create form</button>
                        </form>
                      </>
                    ) : (
                      <p className="mt-2 text-[16px] leading-relaxed text-ink-2">
                        <span className="font-semibold text-[#1f7a43]">✓ Done</span> — you created{" "}
                        <b>{forms[0].name}</b>. On to step 2.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Step 2 — share the link */}
              <div className={`rounded-2xl bg-white p-6 shadow-card sm:p-7 ${forms.length > 0 ? "border-2 border-navy" : "border border-line"}`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[18px] font-bold text-white">2</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 text-[19px]">Send the link to the people whose praise you want</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-ink-2">
                      Your client after a project wraps, or their customers. They write a short testimonial,
                      pick a star rating, and tick a consent box — no account needed on their side.
                    </p>
                    {forms.length > 0 && (
                      <p className="mt-3 flex flex-wrap items-center gap-2 text-[15px]">
                        <span>Your link: <span className="fcode break-all">https://proofloft.com/f/{forms[0].slug}</span></span>
                        <CopyButton text={`https://proofloft.com/f/${forms[0].slug}`} label="Copy link" />
                        <a href={`/f/${forms[0].slug}`} target="_blank" className="flink">Open it ↗</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Step 3 — approve & embed */}
              <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[18px] font-bold text-white">3</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 text-[19px]">Approve what you like, then show it off</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-ink-2">
                      New submissions land in <b>Pending approval</b> below (you also get an email) —
                      nothing goes public until you approve it. Every form has a hosted wall page plus an
                      embed snippet for any website; copy both from the form row.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="guide-tip mt-4">
              Tip: open your own form link and submit a test testimonial right now — you&rsquo;ll see the whole
              loop (submit → email → approve → wall) in under a minute.
            </p>
          </div>
        )}

        {/* Stat cards — bigger numbers, one glance. */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/90 p-5 shadow-card">
            <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">
              <span className="h-2.5 w-2.5 rounded-full bg-navy" />Testimonials
            </div>
            <div className="mt-2 font-display text-[34px] font-bold leading-none">{totals?.total ?? 0}</div>
          </div>
          <div className="rounded-2xl bg-white/90 p-5 shadow-card">
            <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber" />Pending
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-[34px] font-bold leading-none">{nPending}</span>
              {nPending > 0 && (
                <span className="rounded-full bg-[#fdf3e0] px-2.5 py-1 text-[12px] font-bold text-[#7a5205]">needs review</span>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 p-5 shadow-card">
            <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">
              <span className="h-2.5 w-2.5 rounded-full bg-ink-3" />Forms
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-[34px] font-bold leading-none">{totals?.forms ?? 0}</span>
              {!paid && <span className="text-[13px] text-ink-3">/ 1 free</span>}
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 p-5 shadow-card">
            <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1f7a43]" />Workspaces
            </div>
            <div className="mt-2 font-display text-[34px] font-bold leading-none">
              {plan === "agency" ? workspaces.length : <span className="text-[17px] font-semibold text-ink-3">Agency plan</span>}
            </div>
          </div>
        </div>

        {/* Next step — one clear action, chosen from the account's current state. */}
        {Number(totals?.total ?? 0) > 0 && (
          <div className="mb-6 rounded-2xl border-l-[6px] border-cta bg-white p-5 shadow-card sm:px-7">
            <div className="text-[12px] font-bold uppercase tracking-[1.5px] text-cta">Your next step</div>
            {nPending > 0 ? (
              <p className="m-0 mt-1.5 text-[17px] leading-relaxed">
                <b>{nPending} testimonial{nPending === 1 ? " is" : "s are"} waiting for your approval.</b>{" "}
                Nothing goes public until you approve it —{" "}
                <a href="#pending" className="flink">review {nPending === 1 ? "it" : "them"} below ↓</a>
              </p>
            ) : publishedItems.length === 0 ? (
              <p className="m-0 mt-1.5 text-[17px] leading-relaxed">
                <b>Publish your first testimonial.</b> Approve a submission when it arrives, or paste
                praise you already have in <a href="#add" className="flink">Add a testimonial ↓</a>
              </p>
            ) : (
              <p className="m-0 mt-1.5 text-[17px] leading-relaxed">
                <b>Your wall is live.</b> Share your form link after every project wraps, and put the
                wall where prospects see it — proposals, your site, your client&rsquo;s site.
              </p>
            )}
          </div>
        )}

        {/* The loop — always visible once you're up and running. */}
        {Number(totals?.total ?? 0) > 0 && (
          <div className="mb-9 grid gap-4 sm:grid-cols-3">
            {[
              { n: "1", t: "Share your link", d: "Send your form link to the client when a project wraps. They write, rate, and consent — no account needed." },
              { n: "2", t: "Approve", d: "Submissions land in Pending approval below (you get an email). Only what you approve goes public." },
              { n: "3", t: "Show it off", d: "Link the wall in proposals or embed it on any site — it updates itself with every approval." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-white/90 p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[16px] font-bold text-white">{s.n}</div>
                  <h3 className="m-0 text-[17px]">{s.t}</h3>
                </div>
                <p className="m-0 mt-2.5 text-[14.5px] leading-relaxed text-ink-2">{s.d}</p>
              </div>
            ))}
          </div>
        )}

        <div className="panel">
          <div className="panel-head">
            <h2>Client workspaces</h2>
            <span className="hint">One per client engagement</span>
          </div>
          <div className="panel-body">
            {plan === "agency" ? (
              <>
                <div className="chips" style={{ marginBottom: 14 }}>
                  <Link href="/dashboard" className={`chip${!activeWs ? " on" : ""}`}>All</Link>
                  {workspaces.map((w) => (
                    <Link key={w.id} href={`/dashboard?ws=${w.id}`} className={`chip${activeWs?.id === w.id ? " on" : ""}`}>
                      {w.name} ({w.forms})
                    </Link>
                  ))}
                </div>
                <form action={createWorkspaceAction} className="dash-form">
                  <input name="name" required placeholder="New client workspace, e.g. Acme Corp" className="dash-input" />
                  <button className="dash-btn">Add workspace</button>
                </form>
                {workspaces.length > 0 && (
                  <details className="manage">
                    <summary>Rename or delete a workspace</summary>
                    {workspaces.map((w) => (
                      <div className="manage-row" key={w.id}>
                        <form action={renameWorkspaceAction} className="dash-form" style={{ flex: 1 }}>
                          <input type="hidden" name="workspace_id" value={w.id} />
                          <input name="name" defaultValue={w.name} required className="dash-input" />
                          <button className="dash-btn sm">Save name</button>
                        </form>
                        <form action={deleteWorkspaceAction}>
                          <input type="hidden" name="workspace_id" value={w.id} />
                          <ConfirmButton
                            className="tdelete"
                            message={`Delete workspace "${w.name}"? Its forms and testimonials are kept — they just become ungrouped.`}
                          >
                            Delete
                          </ConfirmButton>
                        </form>
                      </div>
                    ))}
                  </details>
                )}
              </>
            ) : (
              <div className="upsell">
                Workspaces group forms and walls per client — one for each engagement.
                They&rsquo;re part of the <b>Agency</b> plan ($49/mo, unlimited clients).
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>{activeWs ? `Forms — ${activeWs.name}` : "Forms"}</h2>
            <span className="hint">Share the link, embed the wall</span>
          </div>
          <div className="panel-body flush">
            {forms.length === 0 && <div className="panel-empty">No forms yet — create your first below.</div>}
            {forms.map((f) => (
              <div className="frow" key={f.id}>
                <div>
                  <div className="fname">
                    {f.name}
                    {f.ws_name && !activeWs && <span className="ws-tag">{f.ws_name}</span>}
                  </div>
                  <div className="mt-1.5 grid gap-1.5">
                    <div className="fmeta" style={{ margin: 0 }}>
                      <span className="mr-1 font-bold uppercase tracking-[1px] text-ink-3">Share</span>
                      <span className="fcode break-all">https://proofloft.com/f/{f.slug}</span>{" "}
                      <CopyButton text={`https://proofloft.com/f/${f.slug}`} />
                      {" · "}
                      <a href={`/f/${f.slug}`} target="_blank" className="flink">Open form ↗</a>
                    </div>
                    <div className="fmeta" style={{ margin: 0 }}>
                      <span className="mr-1 font-bold uppercase tracking-[1px] text-ink-3">Wall</span>
                      <a href={`/w/${f.slug}`} target="_blank" className="flink">View wall ↗</a>{" "}
                      <CopyButton text={`https://proofloft.com/w/${f.slug}`} label="Copy wall link" />
                      <span className="text-ink-3"> — link it in proposals, or embed it below</span>
                    </div>
                  </div>
                  <details className="manage">
                    <summary>Get embed code</summary>
                    <p className="fmeta" style={{ margin: "8px 0 0" }}>
                      <span className="fcode break-all">{`<div data-proofloft="${f.slug}"></div><script src="https://proofloft.com/embed.js" async></script>`}</span>{" "}
                      <CopyButton text={`<div data-proofloft="${f.slug}"></div><script src="https://proofloft.com/embed.js" async></script>`} label="Copy code" />
                      {" · "}
                      <a href="/docs/embed" target="_blank" className="flink">How to embed ↗</a>
                    </p>
                  </details>
                  <details className="manage">
                    <summary>Wall style, rename, or delete</summary>
                    <div className="manage-row">
                      <form action={wallAppearanceAction} className="dash-form">
                        <input type="hidden" name="form_id" value={f.id} />
                        <label className="mlabel">
                          Theme
                          <select name="theme" defaultValue={f.theme} className="dash-input">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                          </select>
                        </label>
                        <label className="mlabel">
                          Layout
                          <select name="layout" defaultValue={f.layout} className="dash-input">
                            <option value="cards">Cards</option>
                            <option value="list">List</option>
                          </select>
                        </label>
                        <button className="dash-btn sm">Save style</button>
                      </form>
                    </div>
                    <div className="manage-row">
                      <form action={renameFormAction} className="dash-form" style={{ flex: 1 }}>
                        <input type="hidden" name="form_id" value={f.id} />
                        <input name="name" defaultValue={f.name} required className="dash-input" />
                        <button className="dash-btn sm">Save name</button>
                      </form>
                      <form action={archiveFormAction}>
                        <input type="hidden" name="form_id" value={f.id} />
                        <ConfirmButton
                          className="tdelete"
                          message={`Delete "${f.name}"? Its form and wall pages go offline immediately. Testimonials and consent records are archived, not destroyed.`}
                        >
                          Delete form
                        </ConfirmButton>
                      </form>
                    </div>
                  </details>
                </div>
                <div className="fright">
                  <div className="fnum">{f.total}</div>
                  {Number(f.pending) > 0
                    ? <span className="badge-count">{f.pending} pending</span>
                    : <span className="badge-zero">approved</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="panel-body" style={{ borderTop: forms.length ? "1px dashed rgba(29,29,31,.13)" : undefined, paddingTop: 20 }}>
            <form action={createFormAction} className="dash-form">
              {activeWs && <input type="hidden" name="workspace_id" value={activeWs.id} />}
              <input
                name="name"
                required
                placeholder={activeWs ? `Form for ${activeWs.name}, e.g. Website project` : "Form name, e.g. Acme project"}
                className="dash-input"
              />
              <button
                className="dash-btn"
                disabled={!paid && forms.length >= 1}
                title={!paid && forms.length >= 1 ? "Free plan: 1 form. Upgrade for unlimited." : ""}
              >
                Create form{activeWs ? ` in ${activeWs.name}` : ""}
              </button>
            </form>
          </div>
        </div>

        {forms.length > 0 && (
          <div className="panel">
            <div className="panel-head">
              <h2>Form performance</h2>
              <span className="hint">Views → submissions → published · view counting started Aug 2026</span>
            </div>
            <div className="panel-body flush">
              {forms.map((f) => {
                const views = viewsByForm.get(Number(f.id)) ?? 0;
                const subs = Number(f.organic);
                const pub = Number(f.organic_pub);
                const subRate = pct(subs, views);
                const pubRate = pct(pub, subs);
                return (
                  <div className="frow" key={f.id}>
                    <div>
                      <div className="fname">{f.name}</div>
                      <div className="fmeta">
                        <b>{views}</b> form view{views === 1 ? "" : "s"}
                        {" → "}
                        <b>{subs}</b> submission{subs === 1 ? "" : "s"}{subRate ? ` (${subRate} of views)` : ""}
                        {" → "}
                        <b>{pub}</b> published{pubRate ? ` (${pubRate} of submissions)` : ""}
                        {" · imports not counted"}
                      </div>
                    </div>
                    <div className="fright">
                      {views > 0 && subs === 0 ? (
                        <span className="badge-count">views, no submissions yet</span>
                      ) : subs > 0 ? (
                        <span className="badge-zero">converting</span>
                      ) : (
                        <span className="fmeta">share the link to start</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {forms.length > 0 && (
          <div className="panel" id="add">
            <div className="panel-head">
              <h2>Add a testimonial</h2>
              <span className="hint">Paste praise from an email or social post — it publishes straight to the wall</span>
            </div>
            <div className="panel-body">
              <form action={importTestimonialAction} className="import-form">
                <div className="dash-form">
                  <select name="form_id" required className="dash-input" defaultValue="">
                    <option value="" disabled>Which form / wall?</option>
                    {forms.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}{f.ws_name ? ` — ${f.ws_name}` : ""}</option>
                    ))}
                  </select>
                  <select name="source" className="dash-input" defaultValue="email">
                    {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{k === "other" ? "Other" : v}</option>
                    ))}
                  </select>
                  <select name="rating" className="dash-input" defaultValue="">
                    <option value="">No rating</option>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{"★".repeat(n)}</option>
                    ))}
                  </select>
                </div>
                <div className="dash-form">
                  <input name="author_name" required placeholder="Author name" className="dash-input" />
                  <input name="author_title" placeholder="Title, e.g. COO, Acme (optional)" className="dash-input" />
                  <input name="source_url" type="url" placeholder="Link to the original post (optional)" className="dash-input" />
                </div>
                <textarea
                  name="body"
                  required
                  rows={3}
                  placeholder="Paste the testimonial text…"
                  className="dash-area"
                  style={{ width: "100%" }}
                />
                <p className="guide-tip" style={{ margin: 0 }}>
                  Tip: to link the original post, use the post&rsquo;s <b>⋯ menu → &ldquo;Copy link&rdquo;</b> on
                  X/LinkedIn/Instagram (or the <b>Share</b> button on a Google review) and paste the URL above —
                  the wall card will show &ldquo;via LinkedIn ↗&rdquo; pointing back to it.
                </p>
                <label className="consent-box">
                  <input type="checkbox" name="permission" required style={{ marginRight: 8 }} />
                  I have the author&rsquo;s permission to display this testimonial publicly.
                </label>
                <div>
                  <button className="dash-btn yellow">Add to wall</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="panel dark" id="pending">
          <div className="panel-head">
            <h2>Pending approval</h2>
            <span className="count-big">{nPending}</span>
          </div>
          <div className="panel-body flush">
            {pendingItems.length === 0 && <div className="panel-empty">Nothing pending — approved testimonials appear on your walls. 🎉</div>}
            {pendingItems.map((t) => (
              <div className="tcard-dash" key={t.id}>
                <div className="who">
                  <b>{t.author_name}</b>{t.author_title ? ` · ${t.author_title}` : ""} on <i>{t.form_name}</i>
                  {t.rating ? <span className="stars-inline">{"★".repeat(t.rating)}</span> : null}
                </div>
                <blockquote>{t.body}</blockquote>
                <div className="trow-actions">
                  <form action={approveAction} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="dash-btn sm yellow">Approve &amp; publish</button>
                  </form>
                  <form action={deleteTestimonialAction} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={t.id} />
                    <ConfirmButton
                      className="tdelete"
                      message={`Permanently delete the testimonial from ${t.author_name}? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>On your walls</h2>
            <span className="hint">Unpublish sends it back to Pending; delete is permanent</span>
          </div>
          <div className="panel-body flush">
            {publishedItems.length === 0 && (
              <div className="panel-empty">Nothing published yet — approve a submission or add one above.</div>
            )}
            {publishedItems.map((t) => (
              <div className="frow" key={t.id}>
                <div>
                  <div className="fname">
                    {t.author_name}
                    {t.author_title ? <span style={{ fontWeight: 400, color: "var(--ink-3)" }}> · {t.author_title}</span> : null}
                    <span className="ws-tag">{t.form_name}</span>
                  </div>
                  <div className="fmeta">
                    {t.rating ? (
                      <span style={t.hide_rating ? { textDecoration: "line-through", opacity: 0.55 } : undefined}>
                        {"★".repeat(t.rating)}{t.hide_rating ? " hidden" : ""}
                      </span>
                    ) : null}
                    {t.rating ? " · " : null}
                    &ldquo;{t.body.length > 140 ? `${t.body.slice(0, 140)}…` : t.body}&rdquo;
                    {t.source ? <> · via {sourceLabel(t.source)}</> : null}
                  </div>
                </div>
                <div className="fright trow-actions">
                  {t.rating ? (
                    <form action={toggleRatingAction} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="ttoggle">{t.hide_rating ? "Show rating" : "Hide rating"}</button>
                    </form>
                  ) : null}
                  <form action={unpublishAction} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="dash-btn sm">Unpublish</button>
                  </form>
                  <form action={deleteTestimonialAction} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={t.id} />
                    <ConfirmButton
                      className="tdelete"
                      message={`Permanently delete the testimonial from ${t.author_name}? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
