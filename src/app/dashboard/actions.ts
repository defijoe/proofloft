"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  readSession,
  SESSION_COOKIE,
  sessionCookieOptions,
  createSessionCookie,
  requestLogin,
  verifyLoginCode,
  query,
  one,
  createCheckoutUrl,
  createBillingPortalUrl,
  isPro,
  getPlan,
  track,
} from "@factory/core";

function currentUser() {
  const user = readSession(cookies().get(SESSION_COOKIE)?.value);
  if (!user) throw new Error("unauthorized");
  return user;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  try {
    await requestLogin(email, "Proofloft");
  } catch (e) {
    // Response stays uniform (anti-enumeration), but the failure must be observable.
    console.error("[login] magic-link send failed:", e);
  }
  redirect("/dashboard?sent=1");
}

export async function codeLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const code = String(formData.get("code") ?? "");
  const user = await verifyLoginCode(email, code);
  if (!user) redirect("/dashboard?sent=1&code=bad");
  cookies().set(SESSION_COOKIE, createSessionCookie(user!), sessionCookieOptions);
  redirect("/dashboard");
}

export async function createWorkspaceAction(formData: FormData) {
  const user = currentUser();
  const name = String(formData.get("name") ?? "").slice(0, 80).trim();
  if (!name) return;

  // Workspaces are the Agency feature. (Server-side gate — UI hiding is just UX.)
  const plan = await getPlan(user.id);
  if (plan !== "agency") return;

  await query(
    `insert into workspaces (user_id, name) values ($1, $2)
     on conflict (user_id, name) do nothing`,
    [user.id, name]
  );
  await track("testimonial", "workspace_created", { userId: user.id });
  revalidatePath("/dashboard");
}

export async function createFormAction(formData: FormData) {
  const user = currentUser();
  const name = String(formData.get("name") ?? "").slice(0, 120).trim();
  if (!name) return;

  // Free-plan gate: 1 form. (Server-side — the disabled button is just UX.)
  const pro = await isPro(user.id);
  const count = await one<{ n: string }>(`select count(*) as n from forms where user_id = $1`, [user.id]);
  if (!pro && Number(count?.n ?? 0) >= 1) return;

  // Optional workspace assignment — verify ownership, never trust the id alone.
  let workspaceId: number | null = null;
  const wsRaw = formData.get("workspace_id");
  if (wsRaw) {
    const ws = await one<{ id: number }>(
      `select id from workspaces where id = $1 and user_id = $2`,
      [Number(wsRaw), user.id]
    );
    workspaceId = ws?.id ?? null;
  }

  const slug =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) +
    "-" + Math.random().toString(36).slice(2, 7);

  await query(
    `insert into forms (user_id, slug, name, workspace_id) values ($1, $2, $3, $4)`,
    [user.id, slug, name, workspaceId]
  );
  await track("testimonial", "form_created", { userId: user.id });
  revalidatePath("/dashboard");
}

/** Allowed import sources — anything else is stored as "other". */
const IMPORT_SOURCES = ["email", "x", "linkedin", "instagram", "google", "g2", "other"] as const;

/**
 * Manual/social import: the owner pastes praise they received elsewhere
 * (an email quote, a post on X/LinkedIn/Instagram, a Google or G2 review).
 * Imports go live immediately — the owner adding it IS the approval — and the
 * required permission checkbox stands in for the form's consent grant.
 */
export async function importTestimonialAction(formData: FormData) {
  const user = currentUser();

  const formId = Number(formData.get("form_id"));
  const authorName = String(formData.get("author_name") ?? "").slice(0, 120).trim();
  const authorTitle = String(formData.get("author_title") ?? "").slice(0, 120).trim() || null;
  const body = String(formData.get("body") ?? "").slice(0, 2000).trim();
  const ratingRaw = Number(formData.get("rating"));
  const rating = ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : null;
  const sourceRaw = String(formData.get("source") ?? "other").toLowerCase();
  const source = (IMPORT_SOURCES as readonly string[]).includes(sourceRaw) ? sourceRaw : "other";
  const permission = formData.get("permission") === "on";

  let sourceUrl: string | null = String(formData.get("source_url") ?? "").trim() || null;
  if (sourceUrl) {
    try {
      const u = new URL(sourceUrl);
      if (u.protocol !== "https:" && u.protocol !== "http:") sourceUrl = null;
    } catch {
      sourceUrl = null; // silently drop malformed URLs rather than failing the import
    }
  }

  if (!formId || !authorName || !body || !permission) return;

  // Ownership check — never trust the form id alone.
  const form = await one<{ id: number }>(
    `select id from forms where id = $1 and user_id = $2`,
    [formId, user.id]
  );
  if (!form) return;

  await query(
    `insert into testimonials (form_id, author_name, author_title, body, rating, source, source_url, approved, consent)
     values ($1, $2, $3, $4, $5, $6, $7, true, true)`,
    [formId, authorName, authorTitle, body, rating, source, sourceUrl]
  );
  await track("testimonial", "testimonial_imported", { userId: user.id, meta: { source } });
  revalidatePath("/dashboard");
}

export async function approveAction(formData: FormData) {
  const user = currentUser();
  const id = Number(formData.get("id"));
  // Ownership check in the WHERE clause — never trust the id alone.
  await query(
    `update testimonials t set approved = true
     from forms f where t.id = $1 and t.form_id = f.id and f.user_id = $2`,
    [id, user.id]
  );
  revalidatePath("/dashboard");
}

/** Take a published testimonial off the wall — it returns to Pending approval. */
export async function unpublishAction(formData: FormData) {
  const user = currentUser();
  const id = Number(formData.get("id"));
  await query(
    `update testimonials t set approved = false
     from forms f where t.id = $1 and t.form_id = f.id and f.user_id = $2`,
    [id, user.id]
  );
  revalidatePath("/dashboard");
}

/** Permanently delete a testimonial (spam, duplicates, takedown requests). */
export async function deleteTestimonialAction(formData: FormData) {
  const user = currentUser();
  const id = Number(formData.get("id"));
  await query(
    `delete from testimonials t
     using forms f where t.id = $1 and t.form_id = f.id and f.user_id = $2`,
    [id, user.id]
  );
  await track("testimonial", "testimonial_deleted", { userId: user.id });
  revalidatePath("/dashboard");
}

export async function billingPortalAction() {
  const user = currentUser();
  let url: string | null = null;
  try {
    url = await createBillingPortalUrl(user.id);
  } catch (e) {
    // Most likely cause: Customer Portal not activated in the Stripe dashboard yet.
    console.error("[billing] portal session failed:", e);
    redirect("/dashboard/account?portal=error");
  }
  if (!url) redirect("/dashboard/account?portal=none");
  redirect(url!);
}

export async function checkoutAction(formData: FormData) {
  const user = currentUser();
  const plan = String(formData.get("plan") ?? "pro");
  const priceId =
    plan === "agency"
      ? process.env.STRIPE_AGENCY_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) throw new Error(`No Stripe price configured for plan: ${plan}`);

  const url = await createCheckoutUrl({
    priceId,
    userEmail: user.email,
    userId: user.id,
  });
  await track("testimonial", "checkout_started", { userId: user.id, meta: { plan } });
  redirect(url);
}
