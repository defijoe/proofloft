// About page — who's behind Proofloft and why it exists. Short and honest;
// a one-person-scale company shouldn't pretend to be a campus.
import Link from "next/link";

export const metadata = {
  title: "About — Proofloft",
  description:
    "Proofloft is a testimonial-collection tool for agencies, built by Media Yard LLC in New Jersey. Flat pricing, consent-first, minimal data by design.",
};

export default function About() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">About</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>The loft where proof lives</h2>
      <div className="legal">
        <h2>Why Proofloft exists</h2>
        <p>
          Every agency has the same awkward asset: a pile of genuine praise — kind emails, LinkedIn
          comments, end-of-project thank-yous — scattered across inboxes and screenshots where no
          prospect will ever see it. The tools that solve this were built for SaaS companies and
          price per project or per &ldquo;space&rdquo;, which punishes exactly the way agencies work:
          many clients, many projects.
        </p>
        <p>
          Proofloft is the version built for that reality. Collect testimonials with a simple link,
          approve what you like, and show them off on a hosted wall or{" "}
          <Link href="/docs/embed" style={{ textDecoration: "underline" }}>embedded on any website</Link> —
          with flat pricing that doesn&rsquo;t grow every time you win a client.
        </p>

        <h2>Who we are</h2>
        <p>
          Proofloft is built and operated by <b>Media Yard LLC</b>, a small independent software
          company in New Jersey, USA. Small is deliberate: no investors to satisfy, no growth-at-any-cost
          playbook — just a tool that has to be good enough that agencies happily pay for it.
        </p>

        <h2>What we believe</h2>
        <ul>
          <li><b>Consent first.</b> Every testimonial carries a consent record. Nothing goes public without the author&rsquo;s permission and your approval.</li>
          <li><b>Minimal data by design.</b> We store testimonials and email addresses — nothing else. No trackers, no ad pixels, no selling data. Ever.</li>
          <li><b>Flat, honest pricing.</b> $19/mo Pro, $49/mo Agency, unlimited clients. Cancel anytime and your data exports with one click.</li>
          <li><b>Your proof is yours.</b> Download everything as CSV or JSON from your account page whenever you like.</li>
        </ul>

        <h2>Get in touch</h2>
        <p>
          Support and questions: <b>hello@proofloft.com</b> — a human reads every message.
          <br />
          Legal, privacy, and data requests: <b>legal@proofloft.com</b>.
        </p>

        <div className="legal-links">
          <Link href="/" className="btn btn-ghost">Proofloft home →</Link>
          <Link href="/dashboard" className="btn btn-ghost">Start free →</Link>
        </div>
      </div>
    </section>
  );
}
