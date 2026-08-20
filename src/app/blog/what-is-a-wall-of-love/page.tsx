// Blog post: wall of love explainer — the category keyword, aimed at agencies.
import Link from "next/link";

export const metadata = {
  title: "What is a wall of love — and why every agency needs one — Proofloft",
  description:
    "A wall of love turns scattered praise into a single page that sells for you. What it is, where to use it, and how to build one in minutes.",
};

export default function Post() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Blog</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>
        What is a wall of love — and why every agency needs one
      </h2>
      <div className="legal">
        <span className="updated">Aug 20, 2026 · 4 min read</span>

        <p>
          A <b>wall of love</b> is a single page of real testimonials from real clients — names,
          words, star ratings — collected in one place instead of scattered across inboxes and
          screenshots. The name comes from the SaaS world, but the idea is older than software:
          it&rsquo;s the digital version of the framed thank-you letters on a family dentist&rsquo;s
          wall. Social proof, concentrated.
        </p>

        <h2>Why it works</h2>
        <p>
          Prospects discount everything you say about yourself and believe almost anything your
          clients say about you. One glowing quote is an anecdote; fifteen of them on one page is a
          pattern. A wall of love shifts the burden of proof — instead of claiming you&rsquo;re good,
          you show a crowd of people who already decided you were. For agencies, it also answers the
          quiet question every prospect has: <i>&ldquo;have they done this for someone like me?&rdquo;</i>
        </p>

        <h2>What belongs on it</h2>
        <ul>
          <li><b>Specific outcomes</b> — &ldquo;conversions up 22% in six weeks&rdquo; beats &ldquo;great team.&rdquo;</li>
          <li><b>Names and roles</b> — &ldquo;Maya Chen, VP Marketing&rdquo; is credible; &ldquo;M.C.&rdquo; is not.</li>
          <li><b>Fresh entries</b> — a wall that grows signals a business that&rsquo;s winning right now.</li>
          <li><b>Consent</b> — every quote should carry the author&rsquo;s explicit permission. It protects your clients and your reputation.</li>
        </ul>

        <h2>Where agencies actually use it</h2>
        <p>
          The hosted page is only the start. The same wall earns its keep in proposals (link it
          right under pricing), in email signatures, at the bottom of invoices — the moment a client
          feels good about paying you is a fine moment to remind them why. Agencies on Proofloft
          also embed walls <b>on their clients&rsquo; sites</b>: collect end-customer reviews for a
          client and drop the wall into their homepage with{" "}
          <Link href="/docs/embed" style={{ textDecoration: "underline" }}>two lines of code</Link>.
          That turns testimonial collection from a marketing chore into a billable service.
        </p>

        <h2>How to build one in minutes</h2>
        <p>
          You need three things: a way to collect (a short form your clients can fill without
          creating an account), a way to curate (approve the good ones, hide the lukewarm rating,
          unpublish the outdated), and a way to display (a hosted page plus an embed for websites).
          That&rsquo;s the entire product surface of{" "}
          <Link href="/" style={{ textDecoration: "underline" }}>Proofloft</Link>: create a form,
          share the link, approve what comes back, and your wall exists at{" "}
          <b>proofloft.com/w/your-name</b> — light or dark theme, cards or list, matching wherever
          it lives.
        </p>

        <h2>Start before you feel ready</h2>
        <p>
          A wall with three honest testimonials beats a wall with zero perfect ones. Start with the
          praise already sitting in your inbox (
          <Link href="/blog/how-to-ask-for-a-testimonial" style={{ textDecoration: "underline" }}>
            here&rsquo;s how to ask for more
          </Link>
          ), and let it compound one project at a time.
        </p>

        <div className="legal-links">
          <Link href="/blog" className="btn btn-ghost">← All posts</Link>
          <Link href="/dashboard" className="btn btn-ghost">Build your wall free →</Link>
        </div>
      </div>
    </section>
  );
}
