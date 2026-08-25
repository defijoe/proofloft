// Landing page v2 — Apple-style card presentation on the warm editorial system.
// Tailwind utilities (brand tokens in tailwind.config.js) on top of globals.css.
// Hierarchy: hero → demo card → price-pain band → how it works (step cards) →
// wall of love → agency cards → pricing cards → vs links → FAQ accordions → CTA.
// Affordance rule: ember (--cta) = clickable button, WHITE text (5.02:1 AA);
// yellow = decoration/status only. Anchors #how / #pricing / #faq feed the nav.
import Link from "next/link";
import type { ReactNode } from "react";

const SAMPLE_WALL = [
  { stars: 5, body: "They rebuilt our site in three weeks and signups doubled the month after launch.", name: "Sara Kim", title: "COO, Brightside Foods" },
  { stars: 5, body: "Clear scope, weekly demos, zero surprises. We've already brought them our second brand.", name: "Marcus Webb", title: "Founder, Webb & Co" },
  { stars: 5, body: "Our ads finally convert. ROAS went from 1.8 to 3.4 in a quarter.", name: "Priya Natarajan", title: "Marketing Lead, Loft & Larder" },
  { stars: 5, body: "The only freelancer who ever made a deadline feel relaxing.", name: "Tom Herrera", title: "Owner, Herrera Dental" },
  { stars: 5, body: "From brief to launch in 12 days. The wall-of-love sealed it for our board.", name: "Anna Lindqvist", title: "Director, Nordica Travel" },
  { stars: 5, body: "Clients love seeing their name up there — and it sells the next client for us.", name: "Devon Clarke", title: "Principal, Clarke Studio" },
];

const TRUST_LINE = "No credit card · 2-minute setup · consent captured · cancel anytime";

/* Ember CTA — the one clickable color, white text on it. */
function Cta({ href, children, ghost = false }: { href: string; children: ReactNode; ghost?: boolean }) {
  const base =
    "inline-block rounded-btn px-7 py-4 text-[17px] font-semibold no-underline transition-colors";
  return (
    <Link
      href={href}
      className={
        ghost
          ? `${base} border-2 border-line bg-white/70 text-ink hover:border-ink-3`
          : `${base} bg-cta text-white shadow-cta hover:bg-cta-hover`
      }
    >
      {children}
    </Link>
  );
}

export default function Landing() {
  return (
    <>
      {/* ---- Hero ---- */}
      <header className="wrap pt-14 pb-10 text-center sm:pt-20">
        <span className="eyebrow">Built for agencies &amp; freelancers</span>
        <h1 className="mx-auto mt-5 max-w-[820px] text-[clamp(38px,6vw,64px)] leading-[1.05]">
          Testimonial tools charge per client.
          <br />You have <em>twelve</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-[620px] text-[19px] leading-relaxed text-ink-2">
          Every client project gets its own collection link and branded wall of love —
          unlimited workspaces, one flat plan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Cta href="/dashboard">Start free — no card</Cta>
          <a
            href="#how"
            className="inline-block rounded-btn border-2 border-line bg-white/70 px-7 py-4 text-[17px] font-semibold text-ink no-underline hover:border-ink-3"
          >
            See how it works ↓
          </a>
        </div>
        <p className="mt-5 text-[14px] text-ink-3">{TRUST_LINE}</p>
      </header>

      {/* ---- Product demo card ---- */}
      <section className="wrap pb-4">
        <div className="mx-auto max-w-[900px] rounded-card bg-white p-6 shadow-card sm:p-10">
          <p className="kicker text-center">The product</p>
          <h2 className="text-center text-[clamp(26px,3.6vw,36px)]">One dashboard. One workspace per client.</h2>
          <div className="mt-8 grid gap-4">
            {/* form row */}
            <div className="rounded-2xl border border-line bg-[#fdfbf6] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 sm:flex-1">
                  <div className="text-[17px] font-semibold">
                    Acme website relaunch <span className="ws-tag">Acme Corp</span>
                  </div>
                  <div className="mt-1 text-[14px] text-ink-3">
                    Share: <span className="fcode">/f/acme-relaunch</span> · Embed:{" "}
                    <span className="fcode">&lt;div data-proofloft=&quot;…&quot;&gt;</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-display text-[30px] font-bold">7</div>
                  <span className="badge-count">1 pending</span>
                </div>
              </div>
            </div>
            {/* pending approval card */}
            <div className="rounded-2xl bg-navy p-5 text-[#eef2f9] sm:p-6">
              <div className="text-[13px] font-semibold uppercase tracking-[1px] text-[#b3c0da]">
                Pending approval
              </div>
              <blockquote className="m-0 mt-3 text-[17px] leading-relaxed">
                &ldquo;They rebuilt our site in three weeks and signups doubled the month after launch.&rdquo;
              </blockquote>
              <div className="mt-2 text-[14px] text-[#b3c0da]">
                Sara Kim · COO, Brightside Foods <span className="text-amber">★★★★★</span>
              </div>
              <span className="dash-btn sm yellow mt-4 inline-block">Approve &amp; publish</span>
            </div>
          </div>
          <p className="mt-5 text-center text-[14px] text-ink-3">
            ↑ Approve a testimonial and it&rsquo;s live on that client&rsquo;s wall — nothing else to do.
          </p>
        </div>
      </section>

      {/* ---- Price-pain band ---- */}
      <section className="wrap pt-14">
        <div className="mx-auto max-w-[900px] rounded-card bg-navy p-8 text-[#eef2f9] sm:p-12">
          <h2 className="text-center text-[clamp(26px,3.6vw,36px)] text-white">
            Ten client workspaces shouldn&rsquo;t cost more than your CRM.
          </h2>
          <div className="mx-auto mt-8 grid max-w-[560px] gap-3 text-[17px]">
            <div className="flex items-baseline justify-between gap-4 rounded-xl bg-white/5 px-5 py-4">
              <span><b>Senja</b> at 10 client workspaces</span>
              <span className="whitespace-nowrap text-[#b3c0da]">~$109/mo</span>
            </div>
            <div className="flex items-baseline justify-between gap-4 rounded-xl bg-white/5 px-5 py-4">
              <span><b>Testimonial.to</b> at 10 spaces</span>
              <span className="whitespace-nowrap text-[#b3c0da]">~$500/mo</span>
            </div>
            <div className="flex items-baseline justify-between gap-4 rounded-xl bg-amber/15 px-5 py-4 ring-1 ring-amber/40">
              <span><b>Proofloft</b> — at 10 <i>or 50</i> clients</span>
              <span className="whitespace-nowrap font-display text-[22px] font-bold text-amber">$49 flat</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- How it works: numbered step cards ---- */}
      <section className="wrap pt-16" id="how">
        <p className="kicker text-center">How it works</p>
        <h2 className="text-center text-[clamp(26px,3.6vw,36px)]">Three steps, no onboarding call</h2>
        <div className="mx-auto mt-9 grid max-w-[980px] gap-5 sm:grid-cols-3">
          {[
            { n: "1", t: "Create a form per project", d: "30 seconds. Your branding, not ours. One form for each client engagement." },
            { n: "2", t: "Send the link", d: "Your client writes the testimonial in-page — consent grant built in, so you can legally use it everywhere." },
            { n: "3", t: "Embed the wall", d: "One script tag on your site or your proposals. New approvals appear automatically." },
          ].map((s) => (
            <div key={s.n} className="rounded-card bg-white p-7 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-[19px] font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 text-[20px]">{s.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-9 text-center">
          <Cta href="/dashboard">Start free — no card</Cta>
        </div>
      </section>

      {/* ---- The output: wall of love ---- */}
      <section className="wrap pt-16">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="kicker">The output</p>
          <h2 className="text-[clamp(26px,3.6vw,36px)]">A wall of love per client</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-ink-2">
            This is what you embed — it updates itself every time you approve a new testimonial.
          </p>
        </div>
        <div className="wall mt-8" aria-label="Example wall of love">
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

      {/* ---- Agency benefit cards ---- */}
      <section className="wrap pt-16">
        <p className="kicker text-center">For agencies</p>
        <h2 className="text-center text-[clamp(26px,3.6vw,36px)]">Run proof like you run projects</h2>
        <div className="mx-auto mt-9 grid max-w-[900px] gap-5 sm:grid-cols-2">
          {[
            { t: "One login, every client", d: "Workspaces keep each client's forms, testimonials, and wall cleanly separated." },
            { t: "White-label walls", d: "Your client's brand on their wall, not ours. Embed it on their site as part of the deliverable." },
            { t: "Consent, captured", d: "Every submission includes a usage-rights grant. Reuse quotes in ads, proposals, and case studies." },
            { t: "Proof that sells the next client", d: "Collect the testimonial while the win is fresh — then show it to the next prospect." },
          ].map((b) => (
            <div key={b.t} className="rounded-card bg-white p-7 shadow-card">
              <h3 className="text-[20px]">{b.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Pricing cards ---- */}
      <section className="wrap pt-16" id="pricing">
        <p className="kicker text-center">Pricing</p>
        <h2 className="text-center text-[clamp(26px,3.6vw,36px)]">Flat. Even at fifty clients.</h2>
        <div className="mx-auto mt-9 grid max-w-[980px] gap-5 sm:grid-cols-3">
          {/* Free */}
          <div className="flex flex-col rounded-card bg-white p-7 shadow-card">
            <span className="text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">Free</span>
            <div className="mt-2 font-display text-[40px] font-bold leading-none">$0</div>
            <div className="mt-1 text-[14px] text-ink-3">forever</div>
            <ul className="m-0 mt-5 grid list-none gap-2 p-0 text-[16px] text-ink-2">
              <li>✓ 1 collection form</li>
              <li>✓ 10 testimonials</li>
              <li>✓ 1 wall of love (with badge)</li>
            </ul>
            <div className="mt-6">
              <Cta href="/dashboard" ghost>Start free</Cta>
            </div>
          </div>
          {/* Pro */}
          <div className="flex flex-col rounded-card bg-white p-7 shadow-card">
            <span className="text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">Pro</span>
            <div className="mt-2 font-display text-[40px] font-bold leading-none">$19</div>
            <div className="mt-1 text-[14px] text-ink-3">per month · $190/yr (2 months free)</div>
            <ul className="m-0 mt-5 grid list-none gap-2 p-0 text-[16px] text-ink-2">
              <li>✓ Unlimited forms &amp; testimonials</li>
              <li>✓ Badge removed</li>
              <li>✓ Unlimited walls</li>
            </ul>
            <div className="mt-6">
              <Cta href="/dashboard" ghost>Start free trial</Cta>
            </div>
          </div>
          {/* Agency — highlighted */}
          <div className="relative flex flex-col rounded-card border-2 border-navy bg-white p-7 shadow-card">
            <span className="absolute -top-3.5 left-6 rounded-full bg-navy px-4 py-1.5 text-[12px] font-bold uppercase tracking-[1px] text-[#f6cf4f]">
              For agencies
            </span>
            <span className="text-[13px] font-semibold uppercase tracking-[1px] text-ink-3">Agency</span>
            <div className="mt-2 font-display text-[40px] font-bold leading-none">$49</div>
            <div className="mt-1 text-[14px] text-ink-3">per month · $490/yr (2 months free)</div>
            <ul className="m-0 mt-5 grid list-none gap-2 p-0 text-[16px] text-ink-2">
              <li>✓ Everything in Pro</li>
              <li>✓ <b className="text-ink">Unlimited client workspaces</b></li>
              <li>✓ White-label, per-client walls</li>
            </ul>
            <div className="mt-6">
              <Cta href="/dashboard">Start free trial</Cta>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-[15px] text-ink-3">
          An agency with 10 client workspaces pays Senja ~$109/mo or Testimonial.to ~$500/mo.
          Here it&rsquo;s $49. Flat. <Link href="/vs/senja" className="flink">See the math →</Link>
        </p>
      </section>

      {/* ---- Competitive positioning ---- */}
      <section className="wrap pt-16">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="kicker">Already using Senja or Testimonial.to?</p>
          <h2 className="text-[clamp(26px,3.6vw,36px)]">Keep the workflow. Drop the per-client bill.</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-ink-2">
            Same collect → approve → embed loop you already know — we just don&rsquo;t meter workspaces.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Cta href="/vs/senja" ghost>Proofloft vs Senja →</Cta>
            <Cta href="/vs/testimonial-to" ghost>Proofloft vs Testimonial.to →</Cta>
          </div>
        </div>
      </section>

      {/* ---- FAQ accordions ---- */}
      <section className="wrap pt-16" id="faq">
        <p className="kicker text-center">FAQ</p>
        <h2 className="text-center text-[clamp(26px,3.6vw,36px)]">The questions agencies actually ask</h2>
        <div className="mx-auto mt-8 grid max-w-[720px] gap-3">
          {[
            { q: "Do my clients need an account?", a: "No. They open your link, write the testimonial, pick a star rating, and they're done. No signup, no app, no friction — which is why they actually do it." },
            { q: "Can I legally reuse the testimonials?", a: "Yes. Every submission captures an explicit consent grant, timestamped and stored with the testimonial. Use them on walls, in proposals, in ads." },
            { q: "What does free include?", a: "One collection form, ten testimonials, and one wall of love (with a small Proofloft badge). No credit card. Upgrade only when a client project needs its own workspace." },
            { q: "What happens if I cancel?", a: "You can export everything — testimonials, consent records, emails. No lock-in, no data hostage-taking." },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-card sm:px-7">
              <summary className="cursor-pointer list-none text-[18px] font-semibold [&::-webkit-details-marker]:hidden">
                <span className="mr-2 inline-block text-ink-3 transition-transform group-open:rotate-90">▸</span>
                {f.q}
              </summary>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---- Final CTA card ---- */}
      <section className="wrap py-16">
        <div className="mx-auto max-w-[900px] rounded-card bg-navy p-10 text-center sm:p-14">
          <h2 className="text-[clamp(26px,3.6vw,38px)] text-white">Your next proposal should ship with proof.</h2>
          <p className="mt-3 text-[17px] text-[#b3c0da]">Set up your first collection form in the next two minutes.</p>
          <div className="mt-7">
            <Cta href="/dashboard">Start free — no card</Cta>
          </div>
          <p className="mt-5 text-[13.5px] text-[#8b98b5]">{TRUST_LINE}</p>
        </div>
      </section>
    </>
  );
}
