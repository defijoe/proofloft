# Proofloft roadmap

Last updated: August 20, 2026 · Owner: Jon (Media Yard LLC) · Engineering: Claude

## Launch checklist (this week — blocking)

- [x] **Google Safe Browsing review** — cleared by Google (Aug 20). Sign-in reverted to link-first, 6-digit code kept as backup.
- [x] **Sending domain** — proofloft.com Verified in Resend (SPF/DKIM/MX green); sender `Proofloft <hello@proofloft.com>`.
- [x] **Inbound forwarding** — working (Aug 20). Fix was two envs: `FORWARD_TO`/`FORWARD_FROM` set in Netlify, plus a **Full access** Resend API key (the sending-only key 401'd on the forward call). legal@/hello@ now reach Gmail.
- [x] **Stripe Customer Portal activation** — done in test mode; repeat in live mode at switch-over.
- [ ] **Stripe live mode** (Claude) — activate account, recreate Pro/Agency products + monthly prices in live mode, live webhook endpoint at /api/billing/webhook, swap Netlify env to `sk_live_…` + live price IDs + live `whsec_…`. Consider enabling Stripe Tax.
- [ ] **Final end-to-end self-test on production** — sign in → create workspace + form → submit testimonial → approve → check wall + embed → upgrade with real checkout (then refund/cancel).

## Week two

1. **Social & manual testimonial import** — "Add testimonial" flow in the dashboard: paste text + author + optional source URL (X/LinkedIn/Instagram/Google/G2 or an email quote). Wall card shows a platform icon and "View original post ↗" link. No live embeds (third-party scripts break the wall's design, privacy promise, and client-site embeds). Needs migration 003: `testimonials.source`, `testimonials.source_url`.
2. **Testimonial management** — unpublish and delete buttons on approved testimonials (today approval is one-way; there's no way to take something off a wall without SQL).
3. **Hide-rating option** — per-form or per-testimonial toggle so a lukewarm 3-star rating doesn't have to appear next to a glowing quote.
4. **Form & workspace management** — rename and delete (with confirmation; deleting a form archives its testimonials rather than destroying consent records).
5. **Wall share polish** — Open Graph title/description/image for /w/ pages so walls unfurl nicely when agencies paste them into Slack, LinkedIn, or proposals.
6. **Silence the pg SSL warning** — add `sslmode=verify-full` to DATABASE_URL in Netlify (cosmetic; the red log line spooks debugging).

## Later / backlog

- Annual plans surfaced in the UI (prices already exist in Stripe: Pro $190/yr, Agency $490/yr).
- Wall layout options (light/dark theme, card vs. list) for embeds on client sites.
- CSV/JSON export button in Account (today export is by-email per the privacy policy).
- Fuller settings if demand appears: notification preferences, API access.
- Simple owner analytics: form views → submissions → approvals funnel (events table already collects the data).
- Testimonial request reminders (polite nudge email to people who haven't submitted).
