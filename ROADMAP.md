# Proofloft roadmap

Last updated: August 20, 2026 · Owner: Jon (Media Yard LLC) · Engineering: Claude

## Launch checklist (this week — blocking)

- [x] **Google Safe Browsing review** — cleared by Google (Aug 20). Sign-in reverted to link-first, 6-digit code kept as backup.
- [x] **Sending domain** — proofloft.com Verified in Resend (SPF/DKIM/MX green); sender `Proofloft <hello@proofloft.com>`.
- [x] **Inbound forwarding** — working (Aug 20). Fix was two envs: `FORWARD_TO`/`FORWARD_FROM` set in Netlify, plus a **Full access** Resend API key (the sending-only key 401'd on the forward call). legal@/hello@ now reach Gmail.
- [x] **Stripe Customer Portal activation** — done in both test and live mode.
- [x] **Stripe live mode** — live products/prices created (Pro price_1U6YSp4I71kjhJGUYZMXfAyo $19/mo, Agency price_1U6YSv4I71kjhJGU1L4GeWUb $49/mo, annuals price_1U6YSs4I71kjhJGUGiMLs9qm / price_1U6YTB4I71kjhJGUqUbHo2zS), live webhook we_1U6YTN4I71kjhJGUbM1jXQEq at /api/billing/webhook, Netlify env swapped. Stripe Tax still optional (backlog).
- [x] **Final end-to-end self-test on production** — real $49 Agency checkout succeeded on live (Aug 20), webhook processed, subscription canceled after. Refund done by Jon in the Stripe dashboard.

**Launch checklist complete — Proofloft is live. 🎉**

## Week two

1. ~~**Social & manual testimonial import**~~ — DONE (Aug 20). "Add a testimonial" panel in the dashboard: paste text + author + source (Email/X/LinkedIn/Instagram/Google/G2/Other) + optional link to the original. Publishes immediately with a required permission checkbox; walls, the JSON feed, and embed.js show "via <platform> ↗". Migration 003 applied to production.
2. ~~**Testimonial management**~~ — DONE (Aug 20). "On your walls" panel lists published testimonials with **Unpublish** (returns to Pending, reversible) and **Delete** (permanent, browser-confirmed). Pending rows also get Delete for spam. Both ownership-checked server-side.
3. ~~**Hide-rating option**~~ — DONE (Aug 20). Per-testimonial "Hide rating / Show rating" toggle in "On your walls"; hides stars on the hosted wall, embed, and JSON feed while the quote stays published. Migration 004 (`testimonials.hide_rating`) applied to production. Bonus: embed no longer fabricates 5 stars for unrated quotes.
4. ~~**Form & workspace management**~~ — DONE (Aug 20). "Rename or delete" disclosure on every form row (delete = archive: pages 404, dashboard hides it, testimonials + consent records preserved; blocked from new submissions server-side). Workspace panel gets rename/delete too — deleting a workspace keeps its forms, ungrouped. Migration 005 (`forms.archived`) applied to production.
5. ~~**Wall share polish**~~ — DONE (Aug 20). OG + Twitter card metadata on /w/ pages, plus a dynamic branded og:image (warm gradient, form name, five stars) rendered per wall via next/og. metadataBase set site-wide.
6. ~~**Silence the pg SSL warning**~~ — DONE (Aug 20). `sslmode=verify-full` added to DATABASE_URL in Netlify; DB connectivity verified on production after the change.

## Later / backlog

- ~~Annual plans surfaced in the UI~~ — DONE (Aug 20). Homepage pricing shows "or $190/yr / $490/yr (2 months free)"; Account page gets annual upgrade buttons and checkout accepts pro_annual/agency_annual. Buttons are env-gated: they appear once `STRIPE_PRO_ANNUAL_PRICE_ID` and `STRIPE_AGENCY_ANNUAL_PRICE_ID` are set in Netlify (live price IDs already exist).
- ~~Wall layout options (light/dark theme, card vs. list)~~ — DONE (Aug 20). Per-form "Wall style" control on the dashboard (Theme: Light/Dark, Layout: Cards/List) applies to the hosted wall, the JSON feed, and embed.js. Embeds can also override per site via `data-theme` / `data-layout` attributes. Migration 006 (`forms.theme`, `forms.layout`) applied to production.
- ~~Consider enabling Stripe Tax before meaningful revenue~~ — DECIDED (Aug 20): monitor-only for now. Stripe Tax settings are active with preset category "SaaS — business use" (txcd_10103001), head office NJ; threshold monitoring is free and alerts by email. No registrations yet, so no tax collected and no Stripe Tax fees. Revisit when Stripe flags a threshold — then register in that state, and enable `automatic_tax` on checkout (one-line change). Open question for the accountant: NJ home-state nexus (SaaS is generally not taxed in NJ, confirm).
- ~~CSV/JSON export button in Account~~ — DONE (Aug 20). "Your data" panel in Account: Download CSV / Download JSON via auth-gated `/api/export`. Includes every testimonial + consent record across all forms (archived included). CSV is RFC-4180 quoted and spreadsheet-formula-injection safe; ISO timestamps.
- Fuller settings if demand appears: notification preferences, API access.
- ~~Simple owner analytics~~ — DONE (Aug 20). "Form performance" panel on the dashboard: views → submissions → published per form with conversion rates. Views come from a new cookieless `form_view` event on /f pages (counting starts Aug 20, 2026); submissions/published come from the testimonials table, organic only (imports excluded). No migration needed.
- Testimonial request reminders (polite nudge email to people who haven't submitted).

## Factory — next products (strategy set Aug 20, 2026)

Principle: every new product reuses the same buyer (agencies/SMBs), the same engine (collect → approve → display, consent records, magic-link auth, zero-SDK Stripe, Resend email), and the same distribution. Ranked:

1. **Proofloft distribution first.** No new product until Proofloft has its first real agencies — everything below doubles in value once there's a customer base to cross-sell.
2. **ReviewLoft** — review funnel for local businesses. Collect a rating; 4–5★ routes to "post it on Google," 1–3★ routes to a private feedback inbox. Sold to local SMBs ($50–100/mo/location) and white-labeled through agencies (same buyer as Proofloft). **Domain secured: getreviewloft.com** (bought on Netlify, Aug 20 — reviewloft.com is parked/taken; brand stays "ReviewLoft"). **v1 built & e2e-tested Aug 21** (landing modeled on onbento.com's playbook, 60-second onboarding with QR, Google-compliant star funnel, private feedback inbox, free early access — no Stripe yet); awaiting Jon-side deploy: GitHub repo + Neon DB + Netlify site + domain (checklist in the delivered zip's DEPLOY.md).
3. **Client report sender for agencies** — branded monthly "what we did + results" report pages with view receipts. Same buyer as Proofloft; best cross-sell.
4. **Case-study generator** — AI-assisted testimonial → case study page. Not a separate product; a Proofloft upsell tier.

Parked: "feedback sender" idea, refined to *documented employee feedback for small employers* (structured feedback + acknowledgment + timestamped trail — the consent-record engine, inverted). Real payer, but validate with ~10 small-business conversations before building. The horizontal version (teachers→students, anyone→anyone) is a no: no marketable audience, no budget-holding payer.

Skip list (evaluated, declined): status pages, waitlists, form builders — commoditized, race-to-free markets.
