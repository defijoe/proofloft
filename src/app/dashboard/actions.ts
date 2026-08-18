"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  readSession,
  SESSION_COOKIE,
  requestLogin,
  query,
  one,
  createCheckoutUrl,
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
  } catch {
    /* uniform response */
  }
  redirect("/dashboard?sent=1");
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

export async function checkoutAction(formData: FormData) {
  const user = currentUser();
  const plan = String(formData.get("plan") ?? "pro");
  const variantId =
    plan === "agency"
      ? process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID
      : process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
  if (!variantId) throw new Error(`No variant configured for plan: ${plan}`);

  const url = await createCheckoutUrl({
    variantId,
    userEmail: user.email,
    userId: user.id,
  });
  await track("testimonial", "checkout_started", { userId: user.id, meta: { plan } });
  redirect(url);
}
