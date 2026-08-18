import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, handleWebhook } from "@factory/core";

// Lemon Squeezy webhook receiver. Point the LS webhook here; secret in env.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  try {
    await handleWebhook(rawBody);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("webhook error", e);
    // 500 → LS retries automatically. The raw payload is already in webhook_log.
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
