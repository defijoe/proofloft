// Privacy Policy — Media Yard LLC. Reflects the actual data footprint: minimal by design.
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Proofloft",
  description: "How Proofloft (Media Yard LLC) collects, uses, and protects data. Minimal data by design.",
};

export default function Privacy() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Legal</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>Privacy Policy</h2>
      <div className="legal">
        <span className="updated">Last updated: August 28, 2026</span>

        <h2>1. Overview</h2>
        <p>
          Proofloft is operated by <b>Media Yard LLC</b> (New Jersey, USA). We built Proofloft to be
          minimal by design: we collect what the product needs to work — testimonials and email
          addresses — and nothing else. We do not sell personal data, we do not run advertising
          trackers, and we do not use your data to train AI models.
        </p>

        <h2>2. Data we collect</h2>
        <ul>
          <li><b>Account data:</b> your email address (used for magic-link sign-in) and your plan/subscription status.</li>
          <li><b>Testimonial submissions:</b> the name, role/title, star rating, and testimonial text a submitter chooses to provide, plus a timestamped record of their consent to publish.</li>
          <li><b>Billing data:</b> handled by Stripe. We never see or store full payment card details — we receive only subscription status, plan, and the billing email.</li>
          <li><b>Technical logs:</b> standard server logs (IP address, timestamps, requested pages) kept briefly for security and debugging.</li>
        </ul>
        <p>
          <b>Cookies:</b> we set one essential cookie — your sign-in session. No analytics cookies,
          no ad cookies, no cross-site tracking. The embed widget displays approved testimonials and
          sets no cookies on visitors&rsquo; browsers.
        </p>

        <h2>3. How we use data</h2>
        <ul>
          <li>To provide the Service: hosting forms, storing testimonials, rendering walls and embeds.</li>
          <li>To send transactional email: magic sign-in links and important account or billing notices. No marketing email without your explicit opt-in.</li>
          <li>To keep the Service secure and diagnose problems.</li>
        </ul>

        <h2>4. Testimonial submitters</h2>
        <p>
          If you submitted a testimonial through a Proofloft form, the business that sent you the
          form (the form owner) controls that content — we process it on their behalf under our{" "}
          <Link href="/legal/dpa">Data Processing Agreement</Link>. To correct or
          withdraw a testimonial, contact that business, or email us at legal@proofloft.com and we
          will pass on your request and assist in removing the content where appropriate.
        </p>

        <h2>5. Service providers (subprocessors)</h2>
        <p>We share data only with the infrastructure providers needed to run Proofloft:</p>
        <ul>
          <li><b>Netlify</b> — application hosting and delivery</li>
          <li><b>Neon</b> — database hosting (Postgres, US region)</li>
          <li><b>Resend</b> — transactional email delivery and inbound email forwarding</li>
          <li><b>Stripe</b> — payment processing, tax calculation, and invoicing</li>
        </ul>
        <p>Each provider processes data under its own security and privacy commitments. We never share your data with advertisers or data brokers.</p>

        <h2>6. Retention</h2>
        <p>
          Account data and testimonials are kept while your account is active. If you close your
          account, we delete your data within 30 days, except minimal records we must keep for legal
          or accounting reasons. Server logs rotate on a short schedule.
        </p>

        <h2>7. Your rights</h2>
        <p>
          Depending on where you live (including the EU/EEA, UK, and California), you may have the
          right to access, correct, delete, or export your personal data, and to object to or
          restrict certain processing. Email <b>legal@proofloft.com</b> and we will respond within 30
          days. You can export everything — testimonials, consent records, and account data — at any
          time on request. We do not discriminate against you for exercising these rights.
        </p>

        <h2>8. Security</h2>
        <p>
          Data is encrypted in transit (TLS) and at rest by our database provider. Sign-in uses
          single-use, expiring magic links — no passwords to leak. Access to production systems is
          limited to the operator of the Service.
        </p>

        <h2>9. International transfers</h2>
        <p>
          Our infrastructure is hosted in the United States. If you use Proofloft from outside the
          US, your data will be processed in the US under the safeguards described in this policy.
        </p>

        <h2>10. Children</h2>
        <p>Proofloft is a business tool and is not directed at anyone under 18. We do not knowingly collect data from children.</p>

        <h2>11. Changes</h2>
        <p>
          If we materially change this policy, we will notify account holders by email or in the
          dashboard before the change takes effect.
        </p>

        <h2>12. Contact</h2>
        <p>Media Yard LLC · legal@proofloft.com</p>

        <div className="legal-links">
          <Link href="/legal/terms" className="btn btn-ghost">Terms of Service →</Link>
          <Link href="/legal/ai" className="btn btn-ghost">AI Disclosure →</Link>
          <Link href="/legal/dpa" className="btn btn-ghost">Data Processing Agreement →</Link>
        </div>
      </div>
    </section>
  );
}
