// Owner dashboard: login gate, client workspaces (Agency), forms list, pending approvals.
import Link from "next/link";
import { cookies } from "next/headers";
import {
  readSession,
  SESSION_COOKIE,
  query,
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
  searchParams: { ws?: string; sent?: string };
}) {
  const user = readSession(cookies().get(SESSION_COOKIE)?.value);

  if (!user) {
    return (
      <main style={wrap}>
        <h1>Sign in</h1>
        <p style={{ color: "#666" }}>We&rsquo;ll email you a magic link — no password.</p>
        {searchParams.sent && (
          <p style={{ background: "#e8f5ec", border: "1px solid #bfe3cc", color: "#1f7a43", padding: "10px 14px", borderRadius: 8, fontSize: 14.5 }}>
            Link sent! Check your email for your sign-in link. It expires in 15 minutes.
          </p>
        )}
        <form action={loginAction} style={{ display: "flex", gap: 8 }}>
          <input name="email" type="email" required placeholder="you@company.com" style={inp} />
          <button style={btn}>Send link</button>
        </form>
      </main>
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

  // Active workspace filter (?ws=<id>), validated against the user's own workspaces.
  // Note: pg returns bigserial ids as strings — compare numerically.
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

  const pendingItems = await query<{ id: number; author_name: string; body: string; form_name: string }>(
    `select t.id, t.author_name, t.body, f.name as form_name
     from testimonials t join forms f on f.id = t.form_id
     where f.user_id = $1 and not t.approved order by t.created_at desc limit 20`,
    [user.id]
  );

  return (
    <main style={wrap}>
      <h1>Dashboard</h1>
      <p style={{ color: "#666" }}>
        {user.email} · {PLAN_LABEL[plan]}
        {plan !== "agency" && (
          <span style={{ marginLeft: 10, display: "inline-flex", gap: 8 }}>
            {plan === "free" && (
              <form action={checkoutAction} style={{ display: "inline" }}>
                <input type="hidden" name="plan" value="pro" />
                <button style={smallBtn}>Upgrade to Pro — $19/mo</button>
              </form>
            )}
            <form action={checkoutAction} style={{ display: "inline" }}>
              <input type="hidden" name="plan" value="agency" />
              <button style={{ ...smallBtn, background: "#e8960c" }}>
                Agency — $49/mo, unlimited clients
              </button>
            </form>
          </span>
        )}
      </p>

      <h2 style={{ marginTop: 34 }}>Client workspaces</h2>
      {plan === "agency" ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
            <Link href="/dashboard" style={chip(!activeWs)}>All</Link>
            {workspaces.map((w) => (
              <Link key={w.id} href={`/dashboard?ws=${w.id}`} style={chip(activeWs?.id === w.id)}>
                {w.name} ({w.forms})
              </Link>
            ))}
          </div>
          <form action={createWorkspaceAction} style={{ display: "flex", gap: 8 }}>
            <input name="name" required placeholder="New client workspace, e.g. Acme Corp" style={inp} />
            <button style={btn}>Add workspace</button>
          </form>
        </>
      ) : (
        <p style={{ color: "#888" }}>
          Workspaces group forms and walls per client — one for each client engagement.
          They&rsquo;re part of the <b>Agency</b> plan ($49/mo, unlimited clients).
        </p>
      )}

      <h2 style={{ marginTop: 34 }}>
        {activeWs ? `Forms — ${activeWs.name}` : "Your forms"}
      </h2>
      {forms.length === 0 && <p style={{ color: "#888" }}>No forms yet — create your first below.</p>}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {forms.map((f) => (
          <li key={f.id} style={card}>
            <b>{f.name}</b>
            {f.ws_name && !activeWs && (
              <span style={{ fontSize: 12, color: "#9a6607", background: "#fdf3e0", borderRadius: 999, padding: "2px 10px", marginLeft: 8 }}>
                {f.ws_name}
              </span>
            )}{" "}
            · {f.total} testimonials ({f.pending} pending)
            <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
              Share link: <code>/f/{f.slug}</code> · Embed:{" "}
              <code>{`<div data-proofloft="${f.slug}"></div><script src="/embed.js" async></script>`}</code>
            </div>
          </li>
        ))}
      </ul>

      <form action={createFormAction} style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {activeWs && <input type="hidden" name="workspace_id" value={activeWs.id} />}
        <input
          name="name"
          required
          placeholder={activeWs ? `Form for ${activeWs.name}, e.g. Website project` : "Form name, e.g. Acme project"}
          style={inp}
        />
        <button
          style={btn}
          disabled={!paid && forms.length >= 1}
          title={!paid && forms.length >= 1 ? "Free plan: 1 form. Upgrade for unlimited." : ""}
        >
          Create form{activeWs ? ` in ${activeWs.name}` : ""}
        </button>
      </form>

      <h2 style={{ marginTop: 34 }}>Pending approval</h2>
      {pendingItems.length === 0 && <p style={{ color: "#888" }}>Nothing pending. 🎉</p>}
      {pendingItems.map((t) => (
        <div key={t.id} style={card}>
          <b>{t.author_name}</b> on <i>{t.form_name}</i>
          <p style={{ margin: "8px 0" }}>{t.body}</p>
          <form action={approveAction}>
            <input type="hidden" name="id" value={t.id} />
            <button style={{ ...btn, background: "#0a7d33" }}>Approve &amp; publish</button>
          </form>
        </div>
      ))}
    </main>
  );
}

const wrap: React.CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "48px 24px" };
const inp: React.CSSProperties = { padding: "10px 13px", borderRadius: 8, border: "1px solid #ddd", fontSize: 15, flex: 1 };
const btn: React.CSSProperties = { background: "#111", color: "#fff", padding: "10px 18px", borderRadius: 8, border: 0, fontSize: 15, fontWeight: 600, cursor: "pointer" };
const smallBtn: React.CSSProperties = { ...btn, padding: "6px 12px", fontSize: 13 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10, padding: 16, marginBottom: 12 };
const chip = (active: boolean): React.CSSProperties => ({
  fontSize: 13.5,
  padding: "6px 14px",
  borderRadius: 999,
  textDecoration: "none",
  border: `1px solid ${active ? "#1a1611" : "#e8e2d6"}`,
  background: active ? "#1a1611" : "#fff",
  color: active ? "#fff" : "#57503f",
  fontWeight: 600,
});
