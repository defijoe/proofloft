// Landing page — agency positioning, editorial design. Copy rationale: launch/landing-copy.md
import Link from "next/link";

const SAMPLE_WALL = [
  { stars: 5, body: "They rebuilt our site in three weeks and signups doubled the month after launch. Easiest agency decision we ever made.", name: "Sara Kim", title: "COO, Brightside Foods" },
  { stars: 5, body: "Clear scope, weekly demos, zero surprises. We've already brought them our second brand.", name: "Marcus Webb", title: "Founder, Webb & Co" },
  { stars: 5, body: "Our ads finally convert. ROAS went from 1.8 to 3.4 in a quarter.", name: "Priya Natarajan", title: "Marketing Lead, Loft & Larder" },
  { stars: 5, body: "The only freelancer who ever made a deadline feel relaxing. Book them before your competitors do.", name: "Tom Herrera", title: "Owner, Herrera Dental" },
  { stars: 5, body: "From brief to launch in 12 days. The proposal wall-of-love sealed it for our board.", name: "Anna Lindqvist", title: "Director, Nordica Travel" },
  { stars: 5, body: "Every project gets its own testimonial page now. Clients love seeing their name up there — and it sells the next client for us.", name: "Devon Clarke", title: "Principal, Clarke Studio" },
];

export default function Landing() {
  return (
    <>
      <header className="hero wrap">
        <span className="eyebrow">Built for agencies &amp; freelancers</span>
        <h1>
          Collect client testimonials.
          <br />For <em>every</em> client you have.
        </h1>
        <p className="sub">
          One link per project. A branded wall of love per client. Without paying
          $10/month for every workspace you add — unlimited client workspaces, one flat plan.
        </p>
        <div className="hero-ctas">
          <Link href="/dashboard" className="btn">Start free — no card</Link>
          <Link href="/vs/senja" className="btn btn-ghost">See it vs Senja →</Link>
        </div>
        <p className="hero-note">2-minute setup · consent captured on every submission · cancel anytime, export everything</p>

        <div className="wall" aria-label="Example wall of love">
          {SAMPLE_WALL.map((t) => (
            <figure className="tcard" key={t.name}>
              <div className="stars">{"★".repeat(t.stars)}</div>
              <blockquote>&ldquo;{t.body}&rdquo;</blockquote>
              <figcaption><b>{t.name}</b> · {t.title}</figcaption>
            </figure>
          ))}
        </div>
        <p className="wall-caption">↑ A Proofloft wall of love — this is what you embed, one per client.</p>
      </header>

      <section className="section wrap-narrow">
        <p className="kicker">The problem</p>
        <h2>Your proof is scattered. Your proposals go out naked.</h2>
        <p className="lede">
          Testimonials live in email threads, Slack messages, and that one Loom your client
          sent eight months ago. The big testimonial tools weren&rsquo;t built for you — they were
          built for SaaS companies with one product. You have twelve clients, and they charge
          per workspace:
        </p>
        <div className="pain">
          <ul>
            <li>Senja Pro: 5 projects included, then <b>$10/month per additional project</b></li>
            <li>Testimonial.to Ultimate: 1 space, then <b>~$600/year per additional space</b></li>
          </ul>
          <p style={{ margin: "16px 0 0", fontFamily: "var(--display)", fontWeight: 600, fontSize: 19 }}>
            Ten client workspaces shouldn&rsquo;t cost more than your CRM.
          </p>
        </div>
      </section>

      <section className="section wrap-narrow">
        <p className="kicker">How it works</p>
        <h2>Three steps, no onboarding call</h2>
        <div className="steps">
          <div className="step">
            <div className="num">1</div>
            <h3>Create a form per project</h3>
            <p>30 seconds. Your branding, not ours. One form for each client engagement.</p>
          </div>
          <div className="step">
            <div className="num">2</div>
            <h3>Send the link</h3>
            <p>Your client writes the testimonial in-page — with a built-in consent grant, so you can legally use it everywhere.</p>
          </div>
          <div className="step">
            <div className="num">3</div>
            <h3>Embed the wall</h3>
            <p>One script tag on your site, your client&rsquo;s site, or your proposals. New approvals appear automatically.</p>
          </div>
        </div>
      </section>

      <section className="section wrap-narrow" id="pricing">
        <p className="kicker">Pricing</p>
        <h2>Flat. Even at fifty clients.</h2>
        <div className="plans">
          <div className="plan">
            <span className="name">Free</span>
            <div className="price">$0</div>
            <div className="per">forever</div>
            <ul>
              <li>1 collection form</li>
              <li>10 testimonials</li>
              <li>1 wall of love (with badge)</li>
            </ul>
            <Link href="/dashboard" className="btn btn-sm">Start free</Link>
          </div>
          <div className="plan">
            <span className="name">Pro</span>
            <div className="price">$19</div>
            <div className="per">per month · 2 months free annually</div>
            <ul>
              <li>Unlimited forms &amp; testimonials</li>
              <li>Badge removed</li>
              <li>Unlimited walls</li>
            </ul>
            <Link href="/dashboard" className="btn btn-sm">Start free trial</Link>
          </div>
          <div className="plan hot">
            <span className="badge">FOR AGENCIES</span>
            <span className="name">Agency</span>
            <div className="price">$49</div>
            <div className="per">per month · unlimited clients</div>
            <ul>
              <li>Everything in Pro</li>
              <li><b>Unlimited client workspaces</b></li>
              <li>White-label, per-client walls</li>
            </ul>
            <Link href="/dashboard" className="btn btn-sm">Start free trial</Link>
          </div>
        </div>
        <p className="price-note">
          An agency with 10 client workspaces pays Senja ~$109/mo or Testimonial.to ~$500/mo.
          Here it&rsquo;s $49. Flat. <Link href="/vs/senja">See the math →</Link>
        </p>
      </section>
    </>
  );
}
