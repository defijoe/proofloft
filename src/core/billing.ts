/**
 * Stripe billing. Media Yard LLC is the merchant of record; Stripe Tax can be
 * enabled in the dashboard to automate tax calculation/collection.
 *
 * Zero-SDK by design: Stripe's REST API over fetch (form-encoded), signature
 * verification with node:crypto. Same public interface as the previous
 * Lemon Squeezy module, so the rest of the app is unchanged.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
 *      STRIPE_PRO_PRICE_ID, STRIPE_AGENCY_PRICE_ID,
 *      optional STRIPE_PRO_ANNUAL_PRICE_ID / STRIPE_AGENCY_ANNUAL_PRICE_ID.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { query, one } from "./db";

const STRIPE_API = "https://api.stripe.com/v1";

function stripeKey(): string {
  const k = process.env.STRIPE_SECRET_KEY;
  if (!k) throw new Error("STRIPE_SECRET_KEY missing");
  return k;
}

/** Hosted Stripe Checkout URL for a subscription. */
export async function createCheckoutUrl(opts: {
  priceId: string;
  userEmail: string;
  userId: number;
}): Promise<string> {
  const params = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": opts.priceId,
    "line_items[0][quantity]": "1",
    customer_email: opts.userEmail,
    client_reference_id: String(opts.userId),
    "subscription_data[metadata][user_id]": String(opts.userId),
    success_url: `${process.env.APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.APP_URL}/dashboard`,
    allow_promotion_codes: "true",
  });

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Stripe checkout failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { url: string };
  return json.url;
}

/**
 * Verify the Stripe-Signature header: HMAC-SHA256 of "<t>.<payload>" with the
 * webhook signing secret; header format "t=<ts>,v1=<sig>[,v1=...]".
 * Rejects events older than 5 minutes (replay protection).
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!secret) return false;

  const parts = new Map<string, string[]>();
  for (const kv of signatureHeader.split(",")) {
    const [k, v] = kv.split("=", 2).map((s) => s?.trim());
    if (!k || !v) continue;
    parts.set(k, [...(parts.get(k) ?? []), v]);
  }
  const t = parts.get("t")?.[0];
  const sigs = parts.get("v1") ?? [];
  if (!t || sigs.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;

  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  return sigs.some((s) => {
    const b = Buffer.from(s);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

/**
 * Hosted Stripe Customer Portal URL — cancel, change card, download invoices.
 * The customer id isn't stored locally, so it's resolved from the user's most
 * recent subscription via the Stripe API. Returns null when the user has never
 * had a subscription (nothing to manage).
 *
 * Note: the portal must be activated once in the Stripe dashboard
 * (Settings → Billing → Customer portal → Save) per mode (test/live).
 */
export async function createBillingPortalUrl(userId: number): Promise<string | null> {
  const row = await one<{ provider_sub_id: string }>(
    `select provider_sub_id from subscriptions
     where user_id = $1 order by updated_at desc limit 1`,
    [userId]
  );
  if (!row?.provider_sub_id) return null;

  const subRes = await fetch(`${STRIPE_API}/subscriptions/${row.provider_sub_id}`, {
    headers: { Authorization: `Bearer ${stripeKey()}` },
  });
  if (!subRes.ok) throw new Error(`Stripe subscription lookup failed: ${subRes.status} ${await subRes.text()}`);
  const sub = (await subRes.json()) as { customer: string };

  const params = new URLSearchParams({
    customer: sub.customer,
    return_url: `${process.env.APP_URL}/dashboard/account`,
  });
  const res = await fetch(`${STRIPE_API}/billing_portal/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Stripe portal session failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { url: string };
  return json.url;
}

/** Map Stripe subscription statuses onto the app's paid-state vocabulary. */
function mapStatus(s: string): string {
  if (s === "trialing") return "on_trial";
  return s; // active | past_due | canceled | unpaid | incomplete | ...
}

/** Idempotent upsert of subscription state from a Stripe webhook event. */
export async function handleWebhook(rawBody: string): Promise<void> {
  const event = JSON.parse(rawBody);
  const eventName: string = event?.type ?? "unknown";

  await query(
    `insert into webhook_log (provider, event_name, payload) values ('stripe', $1, $2)`,
    [eventName, rawBody]
  );

  // Subscription lifecycle events carry everything we need.
  if (!eventName.startsWith("customer.subscription.")) return;

  const sub = event?.data?.object ?? {};
  const subId: string = String(sub.id ?? "");
  const priceId: string = String(sub?.items?.data?.[0]?.price?.id ?? "");
  const status: string = mapStatus(String(sub.status ?? "unknown"));
  const metaUserId = sub?.metadata?.user_id;
  const email: string | undefined = undefined; // subscription objects don't carry email; user_id metadata is set at checkout

  let userId: number | null = metaUserId ? Number(metaUserId) : null;
  if (!userId && email) {
    const u = await one<{ id: number }>(
      `insert into users (email) values ($1)
       on conflict (email) do update set email = excluded.email returning id`,
      [email]
    );
    userId = u?.id ?? null;
  }
  if (!userId || !subId) return;

  const renewsAt = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
  const endsAt = sub.ended_at
    ? new Date(sub.ended_at * 1000).toISOString()
    : sub.cancel_at
      ? new Date(sub.cancel_at * 1000).toISOString()
      : null;

  await query(
    `insert into subscriptions (user_id, provider_sub_id, variant_id, status, renews_at, ends_at, updated_at)
     values ($1, $2, $3, $4, $5, $6, now())
     on conflict (provider_sub_id) do update set
       status = excluded.status,
       variant_id = excluded.variant_id,
       renews_at = excluded.renews_at,
       ends_at = excluded.ends_at,
       updated_at = now()`,
    [userId, subId, priceId, status, renewsAt, endsAt]
  );

  await query(
    `update webhook_log set processed = true
     where id = (select max(id) from webhook_log where provider = 'stripe')`
  );
}

/** Feature gate. `active` and `on_trial` count as paid. */
export async function isPro(userId: number): Promise<boolean> {
  const row = await one(
    `select 1 from subscriptions
     where user_id = $1 and status in ('active','on_trial') limit 1`,
    [userId]
  );
  return !!row;
}

export type Plan = "free" | "pro" | "agency";

/**
 * Plan tier. The Stripe price on the active subscription decides:
 * an Agency price id → agency, any other paid price → pro.
 */
export async function getPlan(userId: number): Promise<Plan> {
  const row = await one<{ variant_id: string | null }>(
    `select variant_id from subscriptions
     where user_id = $1 and status in ('active','on_trial')
     order by updated_at desc limit 1`,
    [userId]
  );
  if (!row) return "free";
  const agencyIds = [
    process.env.STRIPE_AGENCY_PRICE_ID,
    process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID,
    // Back-compat: honor the old Lemon Squeezy variant if it's still configured.
    process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID,
  ].filter(Boolean);
  if (row.variant_id && agencyIds.includes(row.variant_id)) return "agency";
  return "pro";
}
