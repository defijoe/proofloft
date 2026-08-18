import { NextRequest, NextResponse } from "next/server";
import { readSession, SESSION_COOKIE } from "@factory/core";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json(user ? { email: user.email } : null);
}
