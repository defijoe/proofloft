# Proofloft — engineering reference (Claude session knowledge)

Last updated: **August 27, 2026** · Owner: Jon (Media Yard LLC, trendinux@gmail.com) · Engineering: Claude
Companion file to `ROADMAP.md` (history through Aug 25) — this captures everything since, plus the
operational knowledge needed to pick the project up from zero context.

---

## 1. What Proofloft is

Testimonial collection SaaS at **https://proofloft.com**. Businesses/agencies create capture forms
(`/f/<code>`), customers submit testimonials with consent, the owner approves them, and they appear
on a hosted "wall of love" (`/w/<slug>`), a JSON feed, and a script embed (`embed.js`) on any site.
Flat pricing: **Pro $19/mo ($190/yr)** and **Agency $49/mo ($490/yr)** — no trials, card upfront.

## 2. Repo, hosting, deploy flow

- **GitHub (canonical):** `defijoe/proofloft`, branch `main`. Cloud-workspace mirror: `/home/claude/proofloft-deploy`.
- **Netlify:** site `proofloft`, site_id `f2692a1c-4c54-4b68-b4ed-b52bcd5e692a`, team 6a74ed2889bfa5b8ee2a3ef6.
  Auto-deploys on push to main (~40s build). Next.js runtime plugin.
- **Deploy flow used by Claude (sandbox git push is blocked):** Zapier MCP → GitHubCLIAPI →
  `create_file` with `{repo, path, branch: "main", message, content (plain text), sha (current blob sha for updates)}`.
  **Always verify** the returned `content.sha` equals local `git hash-object <file>`; on mismatch, diff
  against `raw.githubusercontent.com` and reconcile. Then commit the same change to the local mirror so
  local == remote. **Never push `package-lock.json`** (Netlify's npm install reconciles it).
- **DB:** Neon Postgres (project database `neondb`), connection in Netlify `DATABASE_URL` with `sslmode=verify-full`.
- Migrations live in `db/` and are applied manually in the Neon SQL editor (through 006 as of Aug 25).

## 3. Stack

Next.js 14 (App Router, server actions) · Neon Postgres via `pg` · Resend (email, no SDK templates —
`src/core/email.ts` + branded shell in `src/core/email-templates.ts`) · Stripe via raw REST calls in
`src/core/billing.ts` (no SDK) · Tailwind v3 **with preflight OFF** layered over a hand-rolled CSS
design system in `src/app/globals.css`.

Tailwind gotchas (preflight off): the border reset `*, ::before, ::after { border-style: solid;
border-width: 0; }` sits atop globals.css so `border-*` utilities work; add `no-underline` on
Tailwind-styled links and `list-none p-0` on styled lists. CSS-order gotcha: design-system rules come
**after** utilities, so equal-specificity legacy classes (e.g. `.fname`) beat Tailwind arbitrary
values — use inline style or bump the CSS rule instead.

## 4. Brand tokens (tailwind.config.js + globals.css)

- CTA **ember `#b45309`**, hover `#96430a`, **white** text. One CTA color everywhere (site, dashboard, emails).
- Dark surfaces **navy `#1b2a4a`**, deep `#131f38` (replaced all black surfaces Aug 26 — plan.hot,
  math-band, cta-band, panel.dark, pills, chips, wall-dark gradient `155deg #131f38→#1b2a4a`).
- Cool muted text on navy: `#b3c0da / #93a1bf / #8b98b5 / #a3b0ca / #e7ecf5 / #d5dcea`.
- Amber `#e8960c`, wheat/cream grounds, ink `#1a1611` (body text stays `#1d1d1f`/`#1a1611` — navy is
  surfaces only), line `#e8e2d6`. Radii: card 28px, btn 14px. Shadows: `shadow-card`, `shadow-cta`.

## 5. Stripe (LIVE) — account `acct_1U6CFI4I71kjhJGU`

- Products: **Pro `prod_V6m0bzm12rLvYC`**, **Agency `prod_V6m0esaaBwU3N5`** (the only active products).
- Prices (all confirmed against Netlify env Aug 27):
  - `STRIPE_PRO_PRICE_ID` = `price_1U6YSp4I71kjhJGUYZMXfAyo` ($19/mo)
  - `STRIPE_AGENCY_PRICE_ID` = `price_1U6YSv4I71kjhJGU1L4GeWUb` ($49/mo)
  - `STRIPE_PRO_ANNUAL_PRICE_ID` = `price_1U6YSs4I71kjhJGUGiMLs9qm` ($190/yr)
  - `STRIPE_AGENCY_ANNUAL_PRICE_ID` = `price_1U6YTB4I71kjhJGUqUbHo2zS` ($490/yr)
- Webhook: `we_1U6Y964I71kjhJGUmYsehuhU` → `https://proofloft.com/api/billing/webhook`, enabled, five
  `customer.subscription.*` events. Verified correct Aug 26.
- Billing model: quantity fixed `1`, **no trial params**, card collected upfront. `success_url` is
  `${APP_URL}/dashboard?upgraded=1` with **no session_id** — no instant sync on return (optional
  improvement: port ReviewLoft's `syncCheckoutSession`).
- **Aug 26–27 cleanup (done):** archived the duplicate first-gen product set
  (`prod_V6lev6QnN51Ser`/`prod_V6levMXHiqVglz` + prices `price_1U6Y7p/1U6Y89/1U6Y8X/1U6Y8h…`), the
  stray ReviewLoft prices created here by mistake (`price_1U7bJS…`/`price_1U7bJZ…`), and Jon archived
  the stray "ReviewLoft Pro" product `prod_V7r1vUpbejdo0a`. Active catalog is now exactly 2 products / 4 prices.
- Jon's live self-test sub `sub_1U6YhZ4I71kjhJGUQNse8OL2` (defyclaude@gmail.com): paid, canceled 5 min
  later, refunded — nothing recurring.

## 6. Netlify environment (names; secrets not recorded here)

Set in production: `APP_URL=https://proofloft.com`, `EMAIL_FROM=Proofloft <hello@proofloft.com>`,
`FORWARD_TO=trendinux@gmail.com`, `FORWARD_FROM=forwards@proofloft.com`, the four `STRIPE_*_PRICE_ID`
values above, plus secrets `DATABASE_URL`, `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`. The app reads `APP_URL` (NOT `APP_BASE_URL`).
Env changes require a redeploy to take effect.

## 7. Key product surfaces

- `/f/<code>` public capture form (chrome-free) · `/w/<slug>` hosted wall (chrome-free, OG/Twitter
  cards + dynamic branded og:image via next/og).
- **Embed:** `<div data-proofloft="<slug>"></div><script src="https://proofloft.com/embed.js" async></script>`.
  CORS `Access-Control-Allow-Origin: *` on `/api/wall/*` and `/embed.js` (next.config.mjs); no
  X-Frame-Options, so iframes work too. Embeds honor `data-theme` / `data-layout` overrides.
- **Owner-only share box on walls (Aug 26):** on `/w/<slug>`, the signed-in owner (session id ==
  form.user_id) sees a dashed "Put this wall to work" card (copy link, copy embed code, auto-update
  note + amber "Only you can see this box" badge). Invisible to visitors — walls stay white-label.
- **Dashboard:** zero-state = 3 numbered onboarding step cards; with content = stat cards (34px
  numbers), a state-aware "Your next step" callout (pending → #pending, no published → #add, else
  "wall is live"), a 3-card loop strip, decluttered form rows (SHARE line with copy chip + Open form;
  WALL line with View wall + copy chip; collapsed "Get embed code" details with copy chip).
- **CopyButton** (`src/app/dashboard/copy-button.tsx`): clipboard API + execCommand fallback,
  ✓ Copied state 1.6s; used on every shareable link. Identical component exists in ReviewLoft.
- Account page `/dashboard/account`: plan, Stripe portal, CSV/JSON export (`/api/export`).
- Sign-in: magic link first + 6-digit backup code (throttled). Login tokens are single-use.
- Inbound mail: Resend `email.received` webhook → `/api/inbound` with a per-domain recipient guard
  (fires account-wide — any future product on the Resend account needs the same guard).

## 8. Change log — Aug 26–27 window (post-ROADMAP)

1. **Card-style redesign (deployed):** homepage rebuilt as cards (hero, demo card, price-pain band,
   3 step cards, agency cards, 3 pricing cards, FAQ `<details>` accordions, final CTA card, anchors
   #how/#pricing/#faq); Tailwind v3 added to THIS repo (tokens above); dashboard onboarding step
   cards + stat cards.
2. **Navy rebrand (deployed):** every black/near-black surface → deep navy `#1b2a4a` (Jon picked it
   via option chip), incl. dark wall theme with cool-tinted muted text.
3. **Dashboard step-by-step guidance (deployed):** next-step callout, loop strip, bigger heading
   hierarchy (panel-head h2 21px, fname 16px), decluttered rows.
4. **Copy-to-clipboard chips everywhere (deployed)** — and ported to ReviewLoft.
5. **Wall share/embed box, owner-only (deployed)** — white-label verified with a logged-out browser.
6. **Stripe audit + catalog cleanup (Aug 26–27, done)** — see §5.
7. Netlify access granted to Claude (Aug 27) — env vars readable/writable via Netlify MCP
   `manage-env-vars` (some writes may be permission-blocked; reads work).

## 9. Pending / next

- Optional: port ReviewLoft's `syncCheckoutSession` instant-Pro sync (add `{CHECKOUT_SESSION_ID}` to
  success_url + sync on dashboard return).
- Factory next big rock: **distribution** (first real agency customers) before any new product.
- `ROADMAP.md` has the full pre-Aug-26 history, launch checklist, backlog, and factory strategy.

## 10. Local dev/test recipe (Claude sandbox)

- Start script pattern: export `DATABASE_URL=postgres://postgres:pw@localhost:5432/factory`,
  `AUTH_SECRET` (32+ chars), `APP_URL=http://localhost:3111`; `service postgresql start` first;
  launch with `setsid /tmp/start-proofloft.sh` (script nohups `next start -p 3111`).
  Kill with `pkill -9 -f 'next[-]server'` (bracketed pattern — a plain pattern self-matches the shell).
- Seed a fresh single-use row in `login_tokens` per test; hit `/api/auth/verify?token=…` to get the
  `factory_session` cookie (strip `#HttpOnly_` if using a cookie jar).
- Playwright: `require("/tmp/node_modules/playwright-core")`, executablePath
  `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`; mobile check =
  `scrollWidth - clientWidth === 0` at 360px; clipboard tests need context permissions
  `["clipboard-read","clipboard-write"]`.
- Sandbox egress blocks proofloft.com directly (use WebFetch or Netlify deploy state to verify);
  `raw.githubusercontent.com` is reachable for diffs.
