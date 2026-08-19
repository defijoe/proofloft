import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, handleWebhook } from "@factory/core";

// Stripe webhook receiver. The Stripe webhook endpoint points here; secret in env.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  try {
    await handleWebhook(rawBody);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("webhook error", e);
    // 500 → Stripe retries automatically. The raw payload is already in webhook_log.
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
