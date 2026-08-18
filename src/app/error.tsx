"use client";
// Branded error boundary. Client component by Next.js requirement.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="errpage">
      <span className="err-code">Oops</span>
      <h1>Something went wrong.</h1>
      <p>
        That&rsquo;s on us, not you. Try again — if it keeps happening,
        email <a href="mailto:legal@proofloft.com" style={{ fontWeight: 600 }}>legal@proofloft.com</a> and
        we&rsquo;ll dig in.
      </p>
      <div className="hero-ctas">
        <button onClick={() => reset()} className="btn">Try again</button>
        <a href="/" className="btn btn-ghost">Back to Proofloft →</a>
      </div>
    </div>
  );
}
