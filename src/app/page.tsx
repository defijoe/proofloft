// Landing page — agency positioning, warm-gradient style guide.
// Hierarchy (one idea per band): compact hero → product demo → problem → how it works →
// output (wall) → agency benefits + pricing math → pricing → competitive → FAQ → CTA.
// Affordance rule: ember (--cta) = clickable button; yellow = decoration/status only.
// Copy rationale: launch/landing-copy.md
import Link from "next/link";

const SAMPLE_WALL = [
  { stars: 5, body: "They rebuilt our site in three weeks and signups doubled the month after launch. Easiest agency decision we ever made.", name: "Sara Kim", title: "COO, Brightside Foods" },
  { stars: 5, body: "Clear scope, weekly demos, zero surprises. We've already brought them our second brand.", name: "Marcus Webb", title: "Founder, Webb & Co" },
  { stars: 5, body: "Our ads finally convert. ROAS went from 1.8 to 3.4 in a quarter.", name: "Priya Natarajan", title: "Marketing Lead, Loft & Larder" },
  { stars: 5, body: "The only freelancer who ever made a deadline feel relaxing. Book them before your competitors do.", name: "Tom Herrera", title: "Owner, Herrera Dental" },
  { stars: 5, body: "From brief to launch in 12 days. The proposal wall-of-love sealed it for our board.", name: "Anna Lindqvist", title: "Director, Nordica Travel" },
  { stars: 5, body: "Every project gets its own testimonial page now. Clients love seeing their name up there — and it sells the next client for us.", name: "Devon Clarke", title: "Principal, Clarke Studio" },
];

const TRUST_LINE = "No credit card · 2-minute setup · consent captured on every submission · cancel anytime, export everything";

export default function Landing() {
  return (
    <>
      {/* ---- Hero: acknowledge the problem, promise the fix ---- */}
      <header className="hero wrap">
        <span className="eyebrow">Built for agencies &amp; freelancers</span>
        <h1>
          Testimonial tools charge per client.
          <br />You have <em>twelve</em>.
        </h1>
        <p className="sub">
          Proofloft gives every client project its own collection link and branded
          wall of love — with unlimited client workspaces on one flat plan.
          Send a link, approve what comes back, embed the wall. Done.
        </p>
        <div className="hero-ctas">
          <Link href="/dashboard" className="btn">Start free — no card</Link>
          <a href="#how" className="btn btn-ghost">See how it works ↓</a>
        </div>
        <p className="hero-note">{TRUST_LINE}</p>
      </header>

      {/* ---- Product demonstration — the actual dashboard, in miniature ---- */}
      <section className="section wrap" style={{ paddingTop: 34 }}>
        <div className="wrap-narrow" style={{ padding: 0, textAlign: "center" }}>
          <p className="kicker">The product</p>
          <h2>One dashboard. One workspace per client.</h2>
        </div>
        <div className="mockup" aria-label="Proofloft dashboard preview" style={{ marginTop: 30 }}>
          <div className="panel">
            <div className="mock-head">
              <span className="mock-title">Proof<span style={{ color: "#e8960c" }}>loft</span> — your dashboard</span>
              <span className="plan-chip agency"><span className="dot" />Agency plan</span>
            </div>
            <div className="mock-chipline">
              <span className="chip on">All</span>
              <span className="chip">Acme Corp (3)</span>
              <span className="chip">Herrera Dental (2)</span>
              <span className="chip">Nordica Travel (1)</span>
            </div>
            <div className="panel-body flush" style={{ paddingTop: 6 }}>
              <div className="frow">
                <div>
                  <div className="fname">Acme website relaunch <span className="ws-tag">Acme Corp</span></div>
                  <div className="fmeta">Share: <span className="fcode">/f/acme-relaunch</span> · Embed: <span className="fcode">&lt;div data-proofloft=&quot;…&quot;&gt;</span></div>
                </div>
                <div className="fright">
                  <div className="fnum">7</div>
                  <span className="badge-count">1 pending</span>
                </div>
              </div>
            </div>
          </div>
          <div className="panel dark">
            <div className="panel-head" style={{ paddingBottom: 4 }}>
              <h2 style={{ fontSize: 16 }}>Pending approval</h2>
              <span className="count-big" style={{ fontSize: 20 }}>1</span>
            </div>
            <div className="panel-body flush">
              <div className="tcard-dash">
                <div className="who">
                  <b>Sara Kim</b> · COO, Brightside Foods on <i>Acme website relaunch</i>
                  <span className="stars-inline">★★★★★</span>
                </div>
                <blockquote>They rebuilt our site in three weeks and signups doubled the month after launch.</blockquote>
                <span className="dash-btn sm yellow" style={{ display: "inline-block" }}>Approve &amp; publish</span>
              </div>
            </div>
          </div>
          <p className="mock-note">↑ Approve a testimonial and it&rsquo;s live on that client&rsquo;s wall — nothing else to do.</p>
        </div>
      </section>

      {/* ---- Problem ---- */}
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

      {/* ---- How it works ---- */}
      <section className="section wrap-narrow" id="how">
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
        <div className="hero-ctas" style={{ marginTop: 30 }}>
          <Link href="/dashboard" className="btn">Start free — no card</Link>
        </div>
      </section>

      {/* ---- The output ---- */}
      <section className="section wrap">
        <div className="wrap-narrow" style={{ padding: 0 }}>
          <p className="kicker">The output</p>
          <h2>A wall of love per client</h2>
          <p className="lede">
            This is what you embed — on your site, in proposals, on your client&rsquo;s site.
            It updates itself every time you approve a new testimonial.
          </p>
        </div>
        <div className="wall" aria-label="Example wall of love">
          {SAMPLE_WALL.map((t) => (
            <figure className="tcard" key={t.name}>
              <div className="stars">{"★".repeat(t.stars)}</div>
              <blockquote>&ldquo;{t.body}&rdquo;</blockquote>
              <figcaption><b>{t.name}</b> · {t.title}</figcaption>
            </figure>
          ))}
        </div>
        <p className="wall-caption">↑ Example wall — one of these per client, on the Agency plan.</p>
      </section>

      {/* ---- Agency section ---- */}
      <section className="section wrap-narrow">
        <p className="kicker">For agencies</p>
        <h2>Run proof like you run projects</h2>
        <div className="bene">
          <div className="b">
            <h3>One login, every client</h3>
            <p>No juggling accounts. Workspaces keep each client&rsquo;s forms, testimonials, and wall cleanly separated.</p>
          </div>
          <div className="b">
            <h3>White-label walls</h3>
            <p>Your client&rsquo;s brand on their wall, not ours. Embed it on their site as part of the deliverable.</p>
          </div>
          <div className="b">
            <h3>Consent, captured</h3>
            <p>Every submission includes a usage-rights grant. Reuse quotes in ads, proposals, and case studies without the awkward follow-up email.</p>
          </div>
          <div className="b">
            <h3>Proof that sells the next client</h3>
            <p>End every engagement by collecting the testimonial while the win is fresh — then show it to the next prospect.</p>
          </div>
        </div>
        <div className="math-band">
          <div className="rows">
            <div className="r"><b>Senja</b> ~$109/mo at 10 client workspaces</div>
            <div className="r"><b>Testimonial.to</b> ~$500/mo at 10 spaces</div>
            <div className="r"><b className="us">Proofloft</b> $49/mo — at 10 or 50 clients</div>
          </div>
          <div className="big">
            $49 flat
            <small>unlimited client workspaces</small>
          </div>
        </div>
      </section>

      {/* ---- Pricing ---- */}
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
            <div className="per">per month · or $190/yr (2 months free)</div>
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
            <div className="per">per month · or $490/yr (2 months free)</div>
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

      {/* ---- Competitive positioning ---- */}
      <section className="section wrap-narrow">
        <p className="kicker">Already using Senja or Testimonial.to?</p>
        <h2>Keep the workflow. Drop the per-client bill.</h2>
        <p className="lede">
          Same collect → approve → embed loop you already know. The difference is the
          pricing model: workspaces are the product for an agency, so we don&rsquo;t meter them.
        </p>
        <div className="hero-ctas" style={{ marginTop: 22, justifyContent: "flex-start" }}>
          <Link href="/vs/senja" className="btn btn-ghost">Proofloft vs Senja →</Link>
          <Link href="/vs/testimonial-to" className="btn btn-ghost">Proofloft vs Testimonial.to →</Link>
        </div>
      </section>

      {/* ---- FAQ: objection handling ---- */}
      <section className="section wrap-narrow" id="faq">
        <p className="kicker">FAQ</p>
        <h2>The questions agencies actually ask</h2>
        <div className="faq">
          <div className="qa">
            <h3>Do my clients need an account?</h3>
            <p>No. They open your link, write the testimonial, pick a star rating, and they&rsquo;re done. No signup, no app, no friction — which is why they actually do it.</p>
          </div>
          <div className="qa">
            <h3>Can I legally reuse the testimonials?</h3>
            <p>Yes. Every submission captures an explicit consent grant, timestamped and stored with the testimonial. Use them on walls, in proposals, in ads.</p>
          </div>
          <div className="qa">
            <h3>What does free include?</h3>
            <p>One collection form, ten testimonials, and one wall of love (with a small Proofloft badge). No credit card. Upgrade only when a client project needs its own workspace.</p>
          </div>
          <div className="qa">
            <h3>What happens if I cancel?</h3>
            <p>You can export everything — testimonials, consent records, emails. No lock-in, no data hostage-taking.</p>
          </div>
        </div>
      </section>

      {/* ---- Final CTA: risk reversal ---- */}
      <section className="wrap-narrow">
        <div className="cta-band">
          <h2>Your next proposal should ship with proof.</h2>
          <p>Set up your first collection form in the next two minutes.</p>
          <Link href="/dashboard" className="btn">Start free — no card</Link>
          <p className="note">{TRUST_LINE}</p>
        </div>
      </section>
    </>
  );
}
