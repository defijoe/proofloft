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
2. **Testimonial management** — unpublish and delete buttons on approved testimonials (today approval is one-way; there's no way to take something off a wall without SQL).
3. **Hide-rating option** — per-form or per-testimonial toggle so a lukewarm 3-star rating doesn't have to appear next to a glowing quote.
4. **Form & workspace management** — rename and delete (with confirmation; deleting a form archives its testimonials rather than destroying consent records).
5. **Wall share polish** — Open Graph title/description/image for /w/ pages so walls unfurl nicely when agencies paste them into Slack, LinkedIn, or proposals.
6. **Silence the pg SSL warning** — add `sslmode=verify-full` to DATABASE_URL in Netlify (cosmetic; the red log line spooks debugging).

## Later / backlog

- Annual plans surfaced in the UI (prices already exist live: Pro $190/yr, Agency $490/yr).
- Consider enabling Stripe Tax before meaningful revenue.
- Wall layout options (light/dark theme, card vs. list) for embeds on client sites.
- CSV/JSON export button in Account (today export is by-email per the privacy policy).
- Fuller settings if demand appears: notification preferences, API access.
- Simple owner analytics: form views → submissions → approvals funnel (events table already collects the data).
- Testimonial request reminders (polite nudge email to people who haven't submitted).
