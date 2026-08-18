// AI Disclosure — authenticity is the product, so this page is a trust asset, not boilerplate.
import Link from "next/link";

export const metadata = {
  title: "AI Disclosure — Proofloft",
  description: "How Proofloft does and doesn't use AI. Testimonials are always written by real people.",
};

export default function AiDisclosure() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Legal</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>AI Disclosure</h2>
      <div className="legal">
        <span className="updated">Last updated: August 18, 2026</span>

        <h2>The short version</h2>
        <p>
          Every testimonial displayed through Proofloft was written by the human who submitted it.
          <b> We never generate, rewrite, embellish, or &ldquo;enhance&rdquo; testimonials with AI</b> — that
          would defeat the entire point of a social-proof product, and fabricated reviews violate
          our <Link href="/legal/terms">Terms of Service</Link> and FTC rules.
        </p>

        <h2>Where AI is used</h2>
        <ul>
          <li><b>Building the product:</b> Proofloft is developed and maintained by an independent developer with the assistance of AI coding tools. AI helps write the software — not your testimonials.</li>
          <li><b>Marketing copy:</b> some text on this website was drafted with AI assistance and reviewed by a human before publishing.</li>
        </ul>

        <h2>Where AI is not used</h2>
        <ul>
          <li>No AI-generated or AI-edited testimonials, ratings, names, or photos — ever.</li>
          <li>No AI processing of your customers&rsquo; submissions. What they type is what gets stored and, if you approve it, displayed verbatim.</li>
          <li>No training of AI models on your data. Your testimonials, consent records, and email addresses are never shared with AI providers or used to train anything.</li>
        </ul>

        <h2>If that changes</h2>
        <p>
          If we ever add an AI-powered feature (for example, suggesting a summary of your collected
          feedback), it will be clearly labeled, strictly opt-in, and covered by an update to this
          page before launch. AI will never touch the content of a testimonial itself.
        </p>

        <h2>Your obligations as a form owner</h2>
        <p>
          The authenticity promise runs both ways: our Terms prohibit publishing fabricated or
          AI-generated testimonials through Proofloft. If you find a wall displaying content you
          believe is fake, report it to legal@proofloft.com and we will investigate.
        </p>

        <h2>Contact</h2>
        <p>Media Yard LLC · legal@proofloft.com</p>

        <div className="legal-links">
          <Link href="/legal/terms" className="btn btn-ghost">Terms of Service →</Link>
          <Link href="/legal/privacy" className="btn btn-ghost">Privacy Policy →</Link>
        </div>
      </div>
    </section>
  );
}
