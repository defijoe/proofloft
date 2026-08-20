// Public embed guide — written so an agency can forward the link to whoever
// manages a client's website. No sign-in required, no jargon assumed.
import Link from "next/link";

export const metadata = {
  title: "How to embed your wall of love — Proofloft",
  description:
    "Add your Proofloft testimonial wall to any website with a two-line snippet, or share the hosted wall link. Works with WordPress, Webflow, Squarespace, Wix, Shopify, and custom sites.",
};

const PRE: React.CSSProperties = {
  background: "#1d1d1f",
  color: "#f2efe8",
  borderRadius: 14,
  padding: "16px 20px",
  fontSize: 13.5,
  lineHeight: 1.6,
  overflowX: "auto",
  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
};

export default function EmbedDocs() {
  return (
    <section className="section wrap-narrow">
      <p className="kicker">Guide</p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>Show your wall of love anywhere</h2>
      <div className="legal">
        <span className="updated">Takes about 2 minutes · no developer required for options 1 &amp; 2</span>

        <h2>Option 1 — Share the hosted wall link (zero setup)</h2>
        <p>
          Every form comes with a ready-made public page. In your{" "}
          <Link href="/dashboard" style={{ textDecoration: "underline" }}>dashboard</Link>, find the form
          and click <b>View wall ↗</b> — that page&rsquo;s address looks like:
        </p>
        <pre style={PRE}>https://proofloft.com/w/your-form-slug</pre>
        <p>
          Link it from proposals, invoices, email signatures, a Linktree, or a &ldquo;Testimonials&rdquo;
          menu item. Pasted into Slack, LinkedIn, or X, it unfurls with a branded preview card.
          New testimonials appear automatically the moment you approve them.
        </p>

        <h2>Option 2 — Embed the wall on a website (two lines of code)</h2>
        <p>
          Copy the snippet from your form&rsquo;s row in the dashboard (it&rsquo;s printed next to
          &ldquo;Embed the wall&rdquo;), or use this template and replace{" "}
          <b>your-form-slug</b> with your form&rsquo;s slug:
        </p>
        <pre style={PRE}>{`<div data-proofloft="your-form-slug"></div>
<script src="https://proofloft.com/embed.js" async></script>`}</pre>
        <p>
          Paste it wherever the wall should appear. The testimonials render right on the page,
          match your wall&rsquo;s style settings, and update automatically — you never re-paste anything.
        </p>

        <h2>Where to paste it, by platform</h2>
        <ul>
          <li><b>WordPress</b> — edit the page, add a <b>Custom HTML</b> block, paste the snippet.</li>
          <li><b>Webflow</b> — drag in an <b>Embed</b> element, paste the snippet, publish.</li>
          <li><b>Squarespace</b> — add a <b>Code</b> block to the page, paste the snippet.</li>
          <li><b>Wix</b> — Add Elements → <b>Embed code</b> → &ldquo;Embed HTML&rdquo;, paste the snippet.</li>
          <li><b>Shopify</b> — edit the page or theme section and add a <b>Custom Liquid / HTML</b> block, paste the snippet.</li>
          <li><b>Framer</b> — insert an <b>Embed</b> component set to HTML, paste the snippet.</li>
          <li><b>Custom-built site</b> — paste the snippet into the HTML where the wall should render. One script tag per page is enough, even with multiple walls.</li>
        </ul>

        <h2>Styling the embed</h2>
        <p>
          The embed follows the form&rsquo;s <b>Wall style</b> setting from the dashboard
          (Theme: Light or Dark · Layout: Cards or List). If one particular website needs a
          different look — say a dark client site — override it per embed with two attributes:
        </p>
        <pre style={PRE}>{`<div data-proofloft="your-form-slug" data-theme="dark" data-layout="list"></div>
<script src="https://proofloft.com/embed.js" async></script>`}</pre>
        <p>
          <b>data-theme</b> accepts <b>light</b> or <b>dark</b>; <b>data-layout</b> accepts{" "}
          <b>cards</b> (masonry grid) or <b>list</b> (single centered column). The embed inherits
          your site&rsquo;s font automatically, so it blends in.
        </p>

        <h2>Option 3 — For developers: the JSON feed</h2>
        <p>
          Building something fully custom? Fetch the approved testimonials as JSON and render them
          however you like:
        </p>
        <pre style={PRE}>https://proofloft.com/api/wall/your-form-slug</pre>
        <p>
          Returns <b>items</b> (author, title, quote, rating, source, link) plus the form&rsquo;s{" "}
          <b>theme</b> and <b>layout</b>. CORS is open — call it straight from the browser.
        </p>

        <h2>Good to know</h2>
        <ul>
          <li><b>Only approved testimonials appear.</b> Pending submissions stay private until you approve them.</li>
          <li><b>Updates are automatic.</b> Walls and embeds refresh within about 5 minutes of a change.</li>
          <li><b>The Proofloft badge</b> shows on Free-plan walls and embeds; Pro and Agency plans remove it.</li>
          <li><b>Nothing showing?</b> Check the slug matches your form exactly, and that the form has at least one approved testimonial.</li>
        </ul>

        <div className="legal-links">
          <Link href="/dashboard" className="btn btn-ghost">Open your dashboard →</Link>
          <Link href="/" className="btn btn-ghost">Proofloft home →</Link>
        </div>
      </div>
    </section>
  );
}
