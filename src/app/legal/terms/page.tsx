// Terms of Service — Media Yard LLC (New Jersey). Not legal advice; reviewed copy for a micro-SaaS.
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Proofloft",
  description: "The terms that govern your use of Proofloft, operated by Media Yard LLC.",
};

export default function Terms() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Legal</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>Terms of Service</h2>
      <div className="legal">
        <span className="updated">Last updated: August 18, 2026</span>

        <h2>1. Who we are</h2>
        <p>
          Proofloft (&ldquo;the Service&rdquo;) is operated by <b>Media Yard LLC</b>, a limited liability
          company registered in New Jersey, USA (&ldquo;we&rdquo;, &ldquo;us&rdquo;). These Terms are a binding
          agreement between you and Media Yard LLC. By creating an account or using the Service you accept them.
        </p>

        <h2>2. The Service</h2>
        <p>
          Proofloft lets you create testimonial collection forms, share them with your clients,
          approve submissions, and display approved testimonials on hosted or embedded
          &ldquo;walls of love&rdquo;. Paid plans add features such as additional forms, badge removal,
          and client workspaces.
        </p>

        <h2>3. Accounts</h2>
        <p>
          You sign in with a magic link sent to your email address — there is no password. You are
          responsible for keeping access to that email account secure; anyone who controls your inbox
          can access your Proofloft account. You must be at least 18 and using the Service for
          business purposes.
        </p>

        <h2>4. Plans, billing &amp; refunds</h2>
        <ul>
          <li>Payments are processed by <b>Lemon Squeezy</b> as merchant of record. Your payment terms, invoices, and applicable taxes are handled by Lemon Squeezy at checkout.</li>
          <li>Subscriptions renew automatically until cancelled. You can cancel anytime; your plan stays active until the end of the paid period.</li>
          <li>If something went wrong with a charge, email us at legal@proofloft.com and we&rsquo;ll make it right — including refunds where reasonable.</li>
          <li>We may change prices with at least 30 days&rsquo; notice; changes apply from your next renewal.</li>
        </ul>

        <h2>5. Your content</h2>
        <p>
          You own the testimonials and other content collected through your forms. You grant us a
          limited license to host, store, process, and display that content solely to provide the
          Service (for example, rendering your walls and embeds). We claim no other rights to it.
          You can export your content at any time by contacting us.
        </p>

        <h2>6. Testimonial submissions &amp; consent</h2>
        <p>
          When someone submits a testimonial through a Proofloft form, the submission records their
          consent for the form owner to publish and reuse the testimonial. As a form owner, you are
          responsible for honoring the scope of that consent and for removing a testimonial if the
          author withdraws it.
        </p>

        <h2>7. Acceptable use — authenticity matters</h2>
        <p>Proofloft exists to showcase real feedback from real people. You must not:</p>
        <ul>
          <li>publish <b>fabricated, purchased, or materially misleading testimonials</b>, or edit a testimonial in a way that changes its meaning;</li>
          <li>misrepresent who wrote a testimonial or their relationship to you;</li>
          <li>use the Service in violation of applicable law, including the FTC&rsquo;s rules on consumer reviews and endorsements (16 CFR Part 465) or equivalent rules in your jurisdiction;</li>
          <li>upload unlawful, infringing, or malicious content, or use the Service to send spam;</li>
          <li>attempt to probe, disrupt, or gain unauthorized access to the Service.</li>
        </ul>
        <p>We may suspend or terminate accounts that violate this section.</p>

        <h2>8. Termination &amp; data export</h2>
        <p>
          You may stop using the Service and delete your account at any time. We may suspend or
          terminate the Service for material breach of these Terms. On request before or within 30
          days after account closure, we will provide an export of your testimonials, consent
          records, and account data.
        </p>

        <h2>9. Disclaimers</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any
          kind, express or implied. We do not warrant that the Service will be uninterrupted or
          error-free. Proofloft provides tooling; it does not provide legal advice, and capturing a
          consent record does not guarantee compliance with every law that may apply to your use of
          a testimonial.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Media Yard LLC will not be liable for indirect,
          incidental, special, consequential, or punitive damages, or for lost profits, revenue, or
          data. Our total liability for any claim arising out of the Service is limited to the
          amounts you paid us in the 12 months before the claim arose (or $50 if you are on the free
          plan).
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You will indemnify Media Yard LLC against third-party claims arising from your content or
          your use of the Service in violation of these Terms, including claims that a testimonial
          you published was used without proper authorization.
        </p>

        <h2>12. Governing law</h2>
        <p>
          These Terms are governed by the laws of the State of New Jersey, USA, without regard to
          conflict-of-law rules. Disputes will be resolved in the state or federal courts located in
          New Jersey, and you consent to their jurisdiction.
        </p>

        <h2>13. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. For material changes we will give notice by
          email or in the dashboard at least 14 days before they take effect. Continued use after
          the effective date constitutes acceptance.
        </p>

        <h2>14. Contact</h2>
        <p>
          Media Yard LLC · legal@proofloft.com
        </p>

        <div className="legal-links">
          <Link href="/legal/privacy" className="btn btn-ghost">Privacy Policy →</Link>
          <Link href="/legal/ai" className="btn btn-ghost">AI Disclosure →</Link>
        </div>
      </div>
    </section>
  );
}
