// Account: email, plan, Stripe Customer Portal (cancel / card / invoices), sign out.
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE, getPlan } from "@factory/core";
import { billingPortalAction, checkoutAction } from "../actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Account — Proofloft" };

const PLAN_LABEL = { free: "Free plan", pro: "Pro plan", agency: "Agency plan" } as const;
const PLAN_DESC = {
  free: "1 form, unlimited testimonials, hosted wall with Proofloft badge.",
  pro: "$19/mo — unlimited forms, badge removed, embeds.",
  agency: "$49/mo — everything in Pro plus unlimited client workspaces.",
} as const;

export default async function Account({
  searchParams,
}: {
  searchParams: { portal?: string };
}) {
  const user = readSession(cookies().get(SESSION_COOKIE)?.value);
  if (!user) redirect("/dashboard");

  const plan = await getPlan(user!.id);

  return (
    <div className="dash">
      <div className="dash-wrap">
        <div className="dash-top">
          <Link href="/" className="dash-logo">Proof<em>loft</em></Link>
          <div className="dash-top-right">
            <span className={`plan-chip ${plan}`}><span className="dot" />{PLAN_LABEL[plan]}</span>
            <Link href="/dashboard" className="dash-navlink">← Dashboard</Link>
            <a href="/api/auth/logout" className="dash-navlink">Sign out</a>
          </div>
        </div>

        <div className="dash-head">
          <h1>Account</h1>
          <p className="dash-sub">{user!.email}</p>
        </div>

        {searchParams.portal === "error" && (
          <p className="notice-warn">Couldn&rsquo;t open the billing portal just now — try again in a minute, or email legal@proofloft.com.</p>
        )}
        {searchParams.portal === "none" && (
          <p className="notice-warn">No billing history yet — the portal opens once you&rsquo;ve started a subscription.</p>
        )}

        <div className="panel">
          <div className="panel-head">
            <h2>Plan &amp; billing</h2>
            <span className="hint">Payments processed by Stripe</span>
          </div>
          <div className="panel-body">
            <p className="acct-line"><b>{PLAN_LABEL[plan]}</b> — {PLAN_DESC[plan]}</p>
            {plan === "free" ? (
              <div className="dash-form" style={{ marginTop: 14 }}>
                <form action={checkoutAction} style={{ display: "inline" }}>
                  <input type="hidden" name="plan" value="pro" />
                  <button className="dash-btn sm">Upgrade to Pro — $19/mo</button>
                </form>
                <form action={checkoutAction} style={{ display: "inline" }}>
                  <input type="hidden" name="plan" value="agency" />
                  <button className="dash-btn sm yellow">Agency — $49/mo</button>
                </form>
              </div>
            ) : (
              <form action={billingPortalAction} style={{ marginTop: 14 }}>
                <button className="dash-btn sm">Manage billing</button>
                <p className="acct-note">
                  Change plan or card, cancel, and download invoices — securely on Stripe.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Sign-in &amp; data</h2>
            <span className="hint">Minimal by design</span>
          </div>
          <div className="panel-body">
            <p className="acct-line">
              You sign in with magic links sent to <b>{user!.email}</b> — there&rsquo;s no password to manage.
            </p>
            <p className="acct-line">
              Want an export of your testimonials and consent records, or to close your account?
              Email <b>legal@proofloft.com</b> and we&rsquo;ll take care of it within 30 days, as promised in our{" "}
              <Link href="/legal/privacy" style={{ textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
