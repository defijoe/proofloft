# Proofloft

Client testimonials for agencies and freelancers — one link per project, a branded wall of love per client, flat pricing with unlimited client workspaces.

Live at [proofloft.com](https://proofloft.com). Operated by Media Yard LLC.

## Stack

- Next.js 14 (App Router) + React 18, TypeScript
- Postgres via `pg` (no ORM) — schemas in `db/`
- Magic-link auth (HMAC-signed cookie), email via Resend (send + inbound forwarding)
- Billing via Stripe (Checkout + subscriptions), webhook at `/api/billing/webhook`
- Embeddable wall-of-love widget: `public/embed.js`

## Local development

```bash
npm install
npm run dev
```

Create a Postgres database and run the schemas in order:

```bash
psql "$DATABASE_URL" -f db/core-schema.sql
psql "$DATABASE_URL" -f db/testimonial-schema.sql
psql "$DATABASE_URL" -f db/002-workspaces.sql
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (e.g. Neon) |
| `AUTH_SECRET` | 32+ char random string for signing auth cookies |
| `APP_URL` | Canonical URL, e.g. `https://proofloft.com` |
| `RESEND_API_KEY` | Resend API key (omit in dev — links print to console) |
| `EMAIL_FROM` | Sender address, e.g. `Proofloft <login@proofloft.com>` |
| `RESEND_WEBHOOK_SECRET` | Signing secret for the inbound-email webhook (`/api/inbound`) |
| `FORWARD_TO` / `FORWARD_FROM` | Inbound forwarding destination / sender on the verified domain |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` in sandbox, `sk_live_…` in production) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_…`) for `/api/billing/webhook` |
| `STRIPE_PRO_PRICE_ID` | Price ID for the Pro plan ($19/mo) |
| `STRIPE_AGENCY_PRICE_ID` | Price ID for the Agency plan ($49/mo, unlocks client workspaces) |
| `STRIPE_AGENCY_ANNUAL_PRICE_ID` | Optional: annual Agency price, also treated as agency tier |

## Deploy

Connected to git-based hosting — push to `main` deploys production. Set the env vars above in your host's settings, then point the Stripe webhook (events: `customer.subscription.*`, `checkout.session.completed`) at `https://proofloft.com/api/billing/webhook`.

## Structure

```
src/app/          pages + API routes (App Router)
  f/[slug]/       public testimonial capture form
  dashboard/      forms, approvals (magic-link gated)
  legal/          terms, privacy, AI disclosure
  api/            submit, auth, billing webhook, inbound email, wall JSON
  vs/             comparison pages (Senja, Testimonial.to)
src/core/         db, auth, billing, email, events helpers
public/embed.js   wall-of-love embed widget
db/               Postgres schemas (core + testimonial app)
```
