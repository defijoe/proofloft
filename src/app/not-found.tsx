// Branded 404 — also rendered by notFound() calls (e.g. unknown capture-form slugs).
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="errpage">
      <span className="err-code">404</span>
      <h1>This page doesn&rsquo;t exist.</h1>
      <p>
        The link may be old, mistyped, or the form you&rsquo;re looking for was removed.
        If someone sent you a testimonial link, ask them for a fresh one.
      </p>
      <div className="hero-ctas">
        <Link href="/" className="btn">Back to Proofloft</Link>
        <Link href="/dashboard" className="btn btn-ghost">Go to dashboard →</Link>
      </div>
    </div>
  );
}
