# Proofloft

Client testimonials for agencies and freelancers — one link per project, a branded wall of love per client, flat pricing with unlimited client workspaces.

Live at [proofloft.com](https://proofloft.com).

## Stack

- Next.js 14 (App Router) + React 18, TypeScript
- Postgres via `pg` (no ORM) — schemas in `db/`
- Magic-link auth (HMAC-signed cookie), email via Resend
- Billing via Lemon Squeezy (merchant of record), webhook at `/api/billing/webhook`
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
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy API key |
| `LEMONSQUEEZY_STORE_ID` | Store ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret |
| `LEMONSQUEEZY_PRO_VARIANT_ID` | Variant ID for the Pro plan ($19/mo) |
| `LEMONSQUEEZY_AGENCY_VARIANT_ID` | Variant ID for the Agency plan ($49/mo, unlocks client workspaces) |

## Deploy

Connected to git-based hosting — push to `main` deploys production. Set the env vars above in your host's settings, then point the Lemon Squeezy webhook at `https://proofloft.com/api/billing/webhook`.

## Structure

```
src/app/          pages + API routes (App Router)
  f/[slug]/       public testimonial capture form
  dashboard/      forms, approvals (magic-link gated)
  api/            submit, auth, billing webhook, wall JSON
  vs/             comparison pages (Senja, Testimonial.to)
src/core/         db, auth, billing, email, events helpers
public/embed.js   wall-of-love embed widget
db/               Postgres schemas (core + testimonial app)
```
