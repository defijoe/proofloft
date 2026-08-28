// Data Processing Agreement — processor terms for the personal data form
// owners' customers submit through testimonial forms. Incorporated into the
// Terms by reference; no signature dance needed at this scale.
import Link from "next/link";

export const metadata = {
  title: "Data Processing Agreement — Proofloft",
  description:
    "The DPA that governs how Media Yard LLC processes your customers' personal data on your behalf when you use Proofloft.",
};

export default function Dpa() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Legal</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>Data Processing Agreement</h2>
      <div className="legal">
        <span className="updated">Last updated: August 28, 2026</span>

        <h2>1. Scope &amp; parties</h2>
        <p>
          This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the{" "}
          <Link href="/legal/terms">Terms of Service</Link> between <b>Media Yard LLC</b> (New
          Jersey, USA — &ldquo;we&rdquo;, the <b>processor</b>) and you, the business customer using
          Proofloft (the <b>controller</b>). It applies whenever your use of the Service involves
          personal data of your own customers — most notably the testimonials they submit through
          your collection forms. No separate signature is required: this DPA is automatically
          effective for all business customers.
        </p>

        <h2>2. What we process, and for whom</h2>
        <ul>
          <li><b>Data subjects:</b> your customers and clients who submit testimonials through your forms.</li>
          <li><b>Categories of data:</b> the name, role/title, star rating, and testimonial text a submitter chooses to provide, plus the timestamped record of their consent to publish.</li>
          <li><b>Nature and purpose:</b> hosting your forms, storing submissions and consent records, and displaying the testimonials you approve on your walls and embeds. Nothing else.</li>
          <li><b>Duration:</b> for as long as you keep the content in your account, plus the deletion window in section 7.</li>
        </ul>

        <h2>3. Our commitments as processor</h2>
        <ul>
          <li>We process your customers&rsquo; personal data <b>only on your documented instructions</b> — which, for Proofloft, means only as needed to provide the Service as described in the Terms. We never use it for advertising, profiling, resale, or training AI models.</li>
          <li>Everyone with access to production data (currently, only the operator of the Service) is bound to confidentiality.</li>
          <li>We apply the security measures in section 5 and will not weaken them during your subscription.</li>
          <li>We will assist you, to the extent reasonably possible, in responding to data-subject requests (access, correction, deletion, export) — including a submitter&rsquo;s withdrawal of a published testimonial — and in meeting your own security and impact-assessment obligations.</li>
          <li>If we become aware of a personal-data breach affecting your customers&rsquo; data, we will notify you without undue delay at your account email, with the information we have about its nature and scope.</li>
        </ul>

        <h2>4. Subprocessors</h2>
        <p>You authorize the subprocessors we use to run the Service:</p>
        <ul>
          <li><b>Netlify</b> — application hosting and delivery (US)</li>
          <li><b>Neon</b> — database hosting (Postgres, US region)</li>
          <li><b>Resend</b> — transactional email delivery and inbound forwarding (US)</li>
          <li><b>Stripe</b> — billing (processes your payment data as its own controller, not your customers&rsquo; data)</li>
        </ul>
        <p>
          Each subprocessor is bound by data-protection obligations consistent with this DPA. If we
          add or replace a subprocessor that will process your customers&rsquo; personal data, we
          will update this page and notify account holders by email at least 14 days in advance, and
          you may object on reasonable data-protection grounds (and terminate if we can&rsquo;t
          resolve the objection).
        </p>

        <h2>5. Security measures</h2>
        <ul>
          <li>Encryption in transit (TLS) for all connections, and encryption at rest by our database provider.</li>
          <li>Passwordless authentication with single-use, expiring sign-in links — no password database to breach.</li>
          <li>Submissions are visible only to the authenticated owner of the form until approved; published walls show only what you chose to publish.</li>
          <li>Production access limited to the operator of the Service; infrastructure credentials stored in the hosting providers&rsquo; secret managers, not in code.</li>
          <li>Minimal collection by design: forms ask only for what a testimonial needs, and embeds set no cookies on visitors&rsquo; browsers.</li>
        </ul>

        <h2>6. International transfers</h2>
        <p>
          All processing takes place in the United States. If you are subject to EU/UK data-transfer
          rules, the protections in this DPA and our subprocessors&rsquo; own compliance frameworks
          apply to those transfers; contact us if your compliance program requires additional
          documentation.
        </p>

        <h2>7. Deletion &amp; return</h2>
        <p>
          Deleting a testimonial or form in your dashboard permanently removes it. When your account
          closes, we delete your customers&rsquo; personal data within 30 days, except minimal
          records we are legally required to keep. Before closure — or within 30 days after — you
          can request an export of your testimonials and consent records at legal@proofloft.com.
        </p>

        <h2>8. Audits &amp; information</h2>
        <p>
          We will make available the information reasonably necessary to demonstrate compliance with
          this DPA. Written requests to legal@proofloft.com are answered within 30 days; this page,
          the <Link href="/legal/privacy">Privacy Policy</Link>, and the{" "}
          <Link href="/legal/ai">AI Disclosure</Link> together describe our processing in full.
        </p>

        <h2>9. Precedence &amp; contact</h2>
        <p>
          If this DPA conflicts with the Terms on a data-protection matter, this DPA controls.
          Questions: Media Yard LLC · legal@proofloft.com.
        </p>

        <div className="legal-links">
          <Link href="/legal/terms" className="btn btn-ghost">Terms of Service →</Link>
          <Link href="/legal/privacy" className="btn btn-ghost">Privacy Policy →</Link>
          <Link href="/legal/ai" className="btn btn-ghost">AI Disclosure →</Link>
        </div>
      </div>
    </section>
  );
}
