import { NextRequest, NextResponse } from "next/server";
import { verifyLogin, createSessionCookie, SESSION_COOKIE, sessionCookieOptions, track } from "@factory/core";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const user = await verifyLogin(token);
  if (!user) {
    return NextResponse.redirect(new URL("/?login=expired", process.env.APP_URL));
  }
  await track("testimonial", "login", { userId: user.id });
  const res = NextResponse.redirect(new URL("/dashboard", process.env.APP_URL));
  res.cookies.set(SESSION_COOKIE, createSessionCookie(user), sessionCookieOptions);
  return res;
}
