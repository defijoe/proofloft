/**
 * Magic-link + one-time-code auth. No passwords, no password resets, no credential breaches.
 *
 * Flow:
 *   1. POST email -> requestLogin(email) stores a single-use token AND a 6-digit code, emails both.
 *   2a. User clicks /api/auth/verify?token=... -> verifyLogin(token) returns the user.
 *   2b. Or types the code on the sign-in page -> verifyLoginCode(email, code) returns the user.
 *       (The code path exists so sign-in works even when a link scanner or Safe Browsing
 *        interstitial gets between the user and the URL — no link, nothing to block.)
 *   3. App sets a signed session cookie via createSessionCookie(); read it with readSession().
 */
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { query, one } from "./db";
import { sendEmail } from "./email";
import { brandedEmail } from "./email-templates";
import { track } from "./events";

const TOKEN_TTL_MIN = 15;
const SESSION_TTL_DAYS = 30;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET missing or too short (32+ chars)");
  return s;
}

export interface SessionUser {
  id: number;
  email: string;
}

export async function requestLogin(email: string, appName: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) throw new Error("invalid email");

  const token = randomBytes(32).toString("hex");
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0"); // crypto-strong, no modulo bias
  await query(
    `insert into login_tokens (token, email, expires_at)
     values ($1, $3, now() + interval '${TOKEN_TTL_MIN} minutes'),
            ($2, $3, now() + interval '${TOKEN_TTL_MIN} minutes')`,
    [token, `code:${normalized}:${code}`, normalized]
  );

  const url = `${process.env.APP_URL}/api/auth/verify?token=${token}`;
  await sendEmail({
    to: normalized,
    subject: `Your sign-in link for ${appName}`,
    html: brandedEmail({
      preheader: `Click the button to sign in — the link expires in ${TOKEN_TTL_MIN} minutes.`,
      heading: `Sign in to ${appName}`,
      bodyHtml:
        `<p style="margin:0 0 6px">Click the button below to sign in. The link is single-use and expires in <b>${TOKEN_TTL_MIN} minutes</b>.</p>`,
      ctaLabel: `Sign in to ${appName}`,
      ctaUrl: url,
      afterCtaHtml:
        `<p style="margin:20px 0 8px;font-size:13px;color:#6e6e73">Button not working? Enter this code on the sign-in page instead:</p>` +
        `<div style="display:inline-block;background:#f7f0de;border-radius:10px;padding:8px 16px;` +
        `font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:20px;font-weight:700;` +
        `letter-spacing:6px;color:#1d1d1f">${code}</div>`,
      footnote: `If you didn't request this email, you can safely ignore it — nobody can sign in without this link. You can also paste this into your browser: ${url}`,
    }),
  });
}

/**
 * Verify a typed 6-digit code. Single-use, expiring, and throttled:
 * after 5 wrong guesses for an address inside the TTL window, further
 * attempts are rejected outright (a 6-digit space must not be brute-forceable).
 */
export async function verifyLoginCode(email: string, code: string): Promise<SessionUser | null> {
  const normalized = email.trim().toLowerCase();
  const cleaned = code.replace(/\D/g, "");
  if (!/^\d{6}$/.test(cleaned)) return null;

  const fails = await one<{ n: string }>(
    `select count(*) as n from events
     where app = 'core' and name = 'login_code_failed'
       and created_at > now() - interval '${TOKEN_TTL_MIN} minutes'
       and meta->>'email' = $1`,
    [normalized]
  );
  if (Number(fails?.n ?? 0) >= 5) return null;

  const row = await one<{ email: string }>(
    `update login_tokens set used_at = now()
     where token = $1 and used_at is null and expires_at > now()
     returning email`,
    [`code:${normalized}:${cleaned}`]
  );
  if (!row) {
    await track("core", "login_code_failed", { meta: { email: normalized } });
    return null;
  }

  const user = await one<{ id: number; email: string }>(
    `insert into users (email) values ($1)
     on conflict (email) do update set email = excluded.email
     returning id, email`,
    [normalized]
  );
  return user;
}

export async function verifyLogin(token: string): Promise<SessionUser | null> {
  const row = await one<{ email: string }>(
    `update login_tokens set used_at = now()
     where token = $1 and used_at is null and expires_at > now()
     returning email`,
    [token]
  );
  if (!row) return null;

  const user = await one<{ id: number; email: string }>(
    `insert into users (email) values ($1)
     on conflict (email) do update set email = excluded.email
     returning id, email`,
    [row.email]
  );
  return user;
}

/** Signed cookie value: base64(json).hmac — verify with readSession(). */
export function createSessionCookie(user: SessionUser): string {
  const payload = Buffer.from(
    JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + SESSION_TTL_DAYS * 864e5 })
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function readSession(cookieValue: string | undefined): SessionUser | null {
  if (!cookieValue) return null;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { id: data.id, email: data.email };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "factory_session";
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_DAYS * 86400,
};
