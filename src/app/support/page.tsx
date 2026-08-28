// Support page — the short answers customers actually need, plus the contact
// email. Styled like the legal pages so it reads calm and trustworthy.
import Link from "next/link";

export const metadata = {
  title: "Support — Proofloft",
  description:
    "Get help with Proofloft: billing and cancellation, collection forms, walls of love, embedding, importing testimonials, and sign-in.",
};

export default function Support() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Support</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>How can we help?</h2>
      <div className="legal">
        <p>
          Email <a href="mailto:hello@proofloft.com"><b>hello@proofloft.com</b></a> and a human
          replies — usually within one business day. Include the email address you sign in with so
          we can find your account. The quick answers below cover most questions.
        </p>

        <h2>Billing, plans &amp; canceling</h2>
        <p>
          Proofloft is <b>free forever</b> for 1 collection form, 10 testimonials, and 1 wall of
          love. <b>Pro is $19/month</b> (or $190/yr) for unlimited forms, testimonials, and walls
          with the badge removed; <b>Agency is $49/month</b> (or $490/yr) and adds unlimited
          white-label client workspaces. Billing is handled by Stripe; we never see your card
          number.
        </p>
        <ul>
          <li>
            <b>Change card, download invoices, or cancel:</b> sign in and open{" "}
            <Link href="/dashboard/account">Account</Link> → <b>Manage billing</b>. It opens your
            secure Stripe billing portal — canceling takes two clicks and no email to us is needed.
          </li>
          <li>
            <b>After canceling</b> you drop back to the Free plan — your forms, walls, and
            testimonials are kept, and everything already published stays online.
          </li>
          <li>
            <b>Upgrading</b> is on the same <Link href="/dashboard/account">Account</Link> page —
            monthly or annual, Pro or Agency.
          </li>
        </ul>

        <h2>Collection forms</h2>
        <p>
          Every form has its own link (proofloft.com/f/…) you can send to clients by email, text,
          or a thank-you page. Clients rate, write, and grant permission in one screen — no account
          needed on their side. Each submission stores a consent record (what they agreed to, when)
          that you can export anytime.
        </p>

        <h2>Walls of love &amp; embedding</h2>
        <p>
          Approved testimonials publish to your hosted wall (proofloft.com/w/…) and to the embed.
          To put the wall on your own site, follow the two-line snippet in{" "}
          <Link href="/docs/embed">How to embed</Link> — it works on any site builder (WordPress,
          Squarespace, Webflow, plain HTML). You can set the wall&rsquo;s theme (light/dark) and
          layout (cards/list) per form from the dashboard, and hide the star rating on any
          individual testimonial.
        </p>

        <h2>Importing testimonials you already have</h2>
        <p>
          Use <b>&ldquo;Add a testimonial&rdquo;</b> in the dashboard to paste in kind words from
          email, X, LinkedIn, Instagram, Google, or G2 — with the author&rsquo;s name and a link to
          the original. Walls show a &ldquo;via&rdquo; label so imported quotes stay honest. Make
          sure you have the author&rsquo;s permission; the import form asks you to confirm it.
        </p>

        <h2>Trouble signing in</h2>
        <ul>
          <li>Sign-in links are one-click and expire after <b>15 minutes</b> — request a fresh one from the <Link href="/dashboard">sign-in page</Link> if yours has expired.</li>
          <li>No email after a minute? Check your spam folder for mail from <b>proofloft.com</b>, and mark it &ldquo;not spam&rdquo; so the next one lands in your inbox.</li>
          <li>Link won&rsquo;t open on your device? Use the 6-digit code from the same email — there&rsquo;s a &ldquo;Link not working?&rdquo; option on the sign-in page.</li>
        </ul>

        <h2>Your data</h2>
        <p>
          <Link href="/dashboard/account">Account</Link> → <b>Your data</b> exports every
          testimonial and consent record as CSV or JSON, any time, on any plan. The full details of
          what we store (very little, by design) are in our{" "}
          <Link href="/legal/privacy">Privacy Policy</Link>,{" "}
          <Link href="/legal/terms">Terms of Service</Link>, and{" "}
          <Link href="/legal/ai">AI Disclosure</Link> — plus a{" "}
          <Link href="/legal/dpa">Data Processing Agreement</Link> for customers whose compliance
          programs need one. For privacy requests, email{" "}
          <a href="mailto:legal@proofloft.com">legal@proofloft.com</a>.
        </p>

        <h2>Something broken?</h2>
        <p>
          Email <a href="mailto:hello@proofloft.com">hello@proofloft.com</a> with what you were
          doing, what you expected, and what happened instead — a screenshot helps a lot.
          We&rsquo;ll get you unstuck.
        </p>
      </div>
    </section>
  );
}
