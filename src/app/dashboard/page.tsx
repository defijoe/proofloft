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
  createFormAction,
  createWorkspaceAction,
  checkoutAction,
  loginAction,
} from "./actions";

export const dynamic = "force-dynamic";

const PLAN_LABEL = { free: "Free plan", pro: "Pro plan", agency: "Agency plan" } as const;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { ws?: string; sent?: string; login?: string };
}) {
  const user = readSession(cookies().get(SESSION_COOKIE)?.value);

  if (!user) {
    return (
      <div className="dash">
        <div className="signin-card">
          <h1>Sign in</h1>
          <p className="sub">We&rsquo;ll email you a magic link — no password needed.</p>
          {searchParams.sent && (
            <p className="notice-ok">Link sent! Check your email. It expires in 15 minutes.</p>
          )}
          {searchParams.login === "expired" && (
            <p className="notice-warn">That sign-in link expired or was already used — request a fresh one below.</p>
          )}
          <form action={loginAction} className="dash-form">
            <input name="email" type="email" required placeholder="you@company.com" className="dash-input" />
            <button className="dash-btn">Send link</button>
          </form>
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
  }>(
    `select f.id, f.slug, f.name, w.name as ws_name,
            count(t.id) as total,
            count(t.id) filter (where not t.approved) as pending
     from forms f
     left join workspaces w on w.id = f.workspace_id
     left join testimonials t on t.form_id = f.id
     where f.user_id = $1 ${activeWs ? "and f.workspace_id = $2" : ""}
     group by f.id, w.name order by f.id desc`,
    activeWs ? [user.id, activeWs.id] : [user.id]
  );

  const totals = await one<{ total: string; pending: string; forms: string }>(
    `select count(t.id) as total,
            count(t.id) filter (where not t.approved) as pending,
            count(distinct f.id) as forms
     from forms f left join testimonials t on t.form_id = f.id
     where f.user_id = $1`,
    [user.id]
  );

  const pendingItems = await query<{ id: number; author_name: string; author_title: string | null; rating: number | null; body: string; form_name: string }>(
    `select t.id, t.author_name, t.author_title, t.rating, t.body, f.name as form_name
     from testimonials t join forms f on f.id = t.form_id
     where f.user_id = $1 and not t.approved order by t.created_at desc limit 20`,
    [user.id]
  );

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

        <div className="pstats">
          <div className="pstat">
            <div className="lbl">Testimonials</div>
            <div className="pill black">{totals?.total ?? 0}</div>
          </div>
          <div className="pstat">
            <div className="lbl">Pending approval</div>
            <div className="pill yellow">{nPending}</div>
          </div>
          <div className="pstat">
            <div className="lbl">Forms</div>
            <div className="pill hatch">{totals?.forms ?? 0}{!paid && <em>/ 1 free</em>}</div>
          </div>
          <div className="pstat">
            <div className="lbl">Client workspaces</div>
            <div className="pill line">{plan === "agency" ? workspaces.length : <em>Agency plan</em>}</div>
          </div>
        </div>

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
                  <div className="fmeta">
                    Share: <span className="fcode">/f/{f.slug}</span>{" "}
                    · Embed: <span className="fcode">{`<div data-proofloft="${f.slug}"></div><script src="/embed.js" async></script>`}</span>
                  </div>
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

        <div className="panel dark">
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
                <form action={approveAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="dash-btn sm yellow">Approve &amp; publish</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
