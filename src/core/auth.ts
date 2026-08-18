/**
 * Magic-link auth. No passwords, no password resets, no credential breaches.
 *
 * Flow:
 *   1. POST email -> requestLogin(email) stores a single-use token, emails a link.
 *   2. User clicks /api/auth/verify?token=... -> verifyLogin(token) returns the user.
 *   3. App sets a signed session cookie via createSessionCookie(); read it with readSession().
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { query, one } from "./db";
import { sendEmail } from "./email";

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
  await query(
    `insert into login_tokens (token, email, expires_at)
     values ($1, $2, now() + interval '${TOKEN_TTL_MIN} minutes')`,
    [token, normalized]
  );

  const url = `${process.env.APP_URL}/api/auth/verify?token=${token}`;
  await sendEmail({
    to: normalized,
    subject: `Your sign-in link for ${appName}`,
    html: `<p>Click to sign in to ${appName}:</p>
           <p><a href="${url}">Sign in</a> (expires in ${TOKEN_TTL_MIN} minutes)</p>
           <p>If you didn't request this, ignore this email.</p>`,
  });
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
