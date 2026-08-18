import { NextRequest, NextResponse } from "next/server";
import { requestLogin } from "@factory/core";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  try {
    await requestLogin(email, "Proofloft");
  } catch {
    // Same response either way — never reveal whether an email exists.
  }
  return NextResponse.json({ ok: true, message: "Check your email for a sign-in link." });
}
