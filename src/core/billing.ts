/**
 * Lemon Squeezy (Merchant of Record) billing.
 *
 * Why MoR: Lemon Squeezy is the legal seller. Global VAT / sales-tax registration,
 * collection, remittance, invoices, dunning and refunds are THEIR obligation.
 * A solo operator should never be the merchant of record. Swappable for
 * Paddle/Polar — keep this interface, change the internals.
 *
 * Setup: create a Product + Variant in LS, put the variant id in env, point the
 * LS webhook at /api/billing/webhook with LEMONSQUEEZY_WEBHOOK_SECRET.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { query, one } from "./db";

const LS_API = "https://api.lemonsqueezy.com/v1";

/** Hosted checkout URL for a user. LS handles payment UI, tax, receipts. */
export async function createCheckoutUrl(opts: {
  variantId: string;
  userEmail: string;
  userId: number;
}): Promise<string> {
  const res = await fetch(`${LS_API}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: opts.userEmail,
            custom: { user_id: String(opts.userId) },
          },
        },
        relationships: {
          store: { data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: "variants", id: opts.variantId } },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`LS checkout failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data: { attributes: { url: string } } };
  return json.data.attributes.url;
}

/** Verify X-Signature header (HMAC-SHA256 of raw body). ALWAYS verify before trusting. */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const digest = createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "")
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Idempotent upsert of subscription state from a webhook payload. */
export async function handleWebhook(rawBody: string): Promise<void> {
  const payload = JSON.parse(rawBody);
  const eventName: string = payload?.meta?.event_name ?? "unknown";

  await query(
    `insert into webhook_log (provider, event_name, payload) values ('lemonsqueezy', $1, $2)`,
    [eventName, rawBody]
  );

  if (!eventName.startsWith("subscription_")) return;

  const attrs = payload?.data?.attributes ?? {};
  const subId: string = String(payload?.data?.id ?? "");
  const customUserId = payload?.meta?.custom_data?.user_id;
  const email: string | undefined = attrs.user_email;

  // Resolve the user: prefer the custom user_id we attached at checkout, fall back to email.
  let userId: number | null = customUserId ? Number(customUserId) : null;
  if (!userId && email) {
    const u = await one<{ id: number }>(
      `insert into users (email) values ($1)
       on conflict (email) do update set email = excluded.email returning id`,
      [email.toLowerCase()]
    );
    userId = u?.id ?? null;
  }
  if (!userId || !subId) return;

  await query(
    `insert into subscriptions (user_id, provider_sub_id, variant_id, status, renews_at, ends_at, updated_at)
     values ($1, $2, $3, $4, $5, $6, now())
     on conflict (provider_sub_id) do update set
       status = excluded.status,
       variant_id = excluded.variant_id,
       renews_at = excluded.renews_at,
       ends_at = excluded.ends_at,
       updated_at = now()`,
    [
      userId,
      subId,
      String(attrs.variant_id ?? ""),
      String(attrs.status ?? "unknown"),
      attrs.renews_at ?? null,
      attrs.ends_at ?? null,
    ]
  );

  await query(
    `update webhook_log set processed = true
     where id = (select max(id) from webhook_log where provider = 'lemonsqueezy')`
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
 * Plan tier. The LS variant on the active subscription decides:
 * LEMONSQUEEZY_AGENCY_VARIANT_ID → agency, any other paid variant → pro.
 */
export async function getPlan(userId: number): Promise<Plan> {
  const row = await one<{ variant_id: string | null }>(
    `select variant_id from subscriptions
     where user_id = $1 and status in ('active','on_trial')
     order by updated_at desc limit 1`,
    [userId]
  );
  if (!row) return "free";
  const agencyVariant = process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID;
  if (agencyVariant && row.variant_id === agencyVariant) return "agency";
  return "pro";
}
