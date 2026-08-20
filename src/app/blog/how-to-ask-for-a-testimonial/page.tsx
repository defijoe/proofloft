// Blog post: the ask. Highest-intent topic for our audience — every agency
// knows they should ask and hates doing it.
import Link from "next/link";

export const metadata = {
  title: "How to ask a client for a testimonial (without it being awkward) — Proofloft",
  description:
    "The best moment to ask, what to say, and three copy-paste email templates that get real, specific testimonials instead of polite one-liners.",
};

export default function Post() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Blog</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>
        How to ask a client for a testimonial (without it being awkward)
      </h2>
      <div className="legal">
        <span className="updated">Aug 20, 2026 · 5 min read</span>

        <p>
          Most agencies have earned far more praise than they&rsquo;ve captured. The work lands, the
          client says something lovely on a call or in an email — and then everyone moves on to the
          next sprint. The gap isn&rsquo;t talent. It&rsquo;s that asking feels awkward, so the ask
          never happens. Here&rsquo;s how to make it a two-minute habit instead of a cringe.
        </p>

        <h2>Ask at the peak, not at the invoice</h2>
        <p>
          The single biggest mistake is timing. If you ask when the final invoice goes out, the
          request reads as transactional — and the client&rsquo;s enthusiasm has already cooled.
          Ask at the <b>emotional peak</b> instead: the day the site launches, the moment they see
          the numbers move, the message where they wrote &ldquo;this looks amazing.&rdquo; When a
          client compliments you unprompted, that&rsquo;s not just a nice moment — that&rsquo;s your
          cue. Reply within the hour.
        </p>

        <h2>Make it small and specific</h2>
        <p>
          &ldquo;Would you write us a testimonial?&rdquo; is a homework assignment. Nobody wants
          homework. Instead, shrink the ask (&ldquo;2&ndash;3 sentences, takes two minutes&rdquo;)
          and aim their memory at something concrete. Specific prompts produce specific
          testimonials — and specific testimonials are the only ones that sell. &ldquo;Great to work
          with!&rdquo; convinces nobody; &ldquo;they rebuilt our checkout and conversions rose 22%
          in six weeks&rdquo; closes deals.
        </p>

        <h2>Three templates you can steal</h2>
        <p><b>1. Right after praise lands</b> (reply to their message):</p>
        <p>
          &ldquo;That genuinely made our week — thank you. Could I ask a small favor? If you could
          put that into 2&ndash;3 sentences here, we&rsquo;d love to feature it: [your Proofloft
          form link]. Takes about two minutes, and there&rsquo;s a consent checkbox so you control
          exactly what&rsquo;s public.&rdquo;
        </p>
        <p><b>2. At project wrap-up</b>:</p>
        <p>
          &ldquo;Before we close this one out — we&rsquo;re collecting a few words from clients we
          loved working with. If you&rsquo;re up for it: [form link]. Anything about what the
          project changed for you is perfect. Two minutes, huge help to a small team.&rdquo;
        </p>
        <p><b>3. The results follow-up</b> (30&ndash;60 days later):</p>
        <p>
          &ldquo;Checking in — how have things performed since launch? If the numbers are moving
          the right way, would you share a couple of sentences about it here? [form link]
          Real results from real clients beat anything we could say about ourselves.&rdquo;
        </p>

        <h2>Lower the friction to near zero</h2>
        <p>
          Every extra step costs you half your responses. Don&rsquo;t ask people to email you
          paragraphs, create accounts, or record videos on the first ask. A single link that opens a
          short form — name, a few sentences, an optional star rating, a consent checkbox — is the
          sweet spot. (This is exactly what a <Link href="/" style={{ textDecoration: "underline" }}>Proofloft form</Link>{" "}
          is: your client clicks, writes, ticks consent, done. It lands in your dashboard for
          approval and then straight onto your wall.)
        </p>

        <h2>Don&rsquo;t let old praise go to waste</h2>
        <p>
          The testimonial you never asked for might already exist — in a thank-you email, a LinkedIn
          comment, a Google review. With permission, import it. Proofloft&rsquo;s dashboard has an
          &ldquo;Add a testimonial&rdquo; panel for exactly this: paste the text, note the source,
          link the original post, confirm you have permission, and it&rsquo;s on the wall with a
          &ldquo;via LinkedIn ↗&rdquo; credit.
        </p>

        <h2>The habit that compounds</h2>
        <p>
          One ask per project wrap, one reply-to-praise per month. That&rsquo;s the whole system.
          Within a quarter you&rsquo;ll have a <Link href="/blog/what-is-a-wall-of-love" style={{ textDecoration: "underline" }}>wall of love</Link>{" "}
          that does your selling while you sleep.
        </p>

        <div className="legal-links">
          <Link href="/blog" className="btn btn-ghost">← All posts</Link>
          <Link href="/dashboard" className="btn btn-ghost">Start collecting free →</Link>
        </div>
      </div>
    </section>
  );
}
