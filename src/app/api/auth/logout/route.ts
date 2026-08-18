import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@factory/core";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = NextResponse.redirect(new URL("/", process.env.APP_URL ?? "http://localhost:3000"));
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
