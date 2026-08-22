// Inbound email forwarder. Resend receives mail for proofloft.com (MX record),
// posts an email.received webhook here, and we forward the message to the
// operator's real inbox via Resend's forward helper.
//
// Env: RESEND_API_KEY, RESEND_WEBHOOK_SECRET (whsec_..., from the webhook's
// signing secret), FORWARD_TO (destination inbox), FORWARD_FROM (an address on
// the verified domain, e.g. forwards@proofloft.com).
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Verify the Svix signature — accept nothing that isn't signed by Resend.
  try {
    resend.webhooks.verify({
      payload,
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? "",
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
    });
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(payload);
  if (event?.type !== "email.received") return NextResponse.json({ ok: true });

  // The Resend account receives mail for multiple domains (proofloft.com,
  // getreviewloft.com), and email.received webhooks fire ACCOUNT-wide — every
  // endpoint sees every domain's mail. Only forward mail actually addressed
  // to our domain, or each app would forward the other's messages too.
  const OUR_DOMAIN = "@proofloft.com";
  const recipients = [
    ...(Array.isArray(event.data?.to) ? event.data.to : []),
    ...(Array.isArray(event.data?.cc) ? event.data.cc : []),
  ].map((r: unknown) => String(r).toLowerCase());
  if (!recipients.some((r) => r.includes(OUR_DOMAIN))) {
    return NextResponse.json({ ok: true }); // another domain's mail — not ours
  }

  const to = process.env.FORWARD_TO;
  if (!to) {
    console.log("[inbound] FORWARD_TO not set — dropping", event?.data?.email_id);
    return NextResponse.json({ ok: true });
  }

  try {
    await resend.emails.receiving.forward({
      emailId: event.data.email_id,
      to,
      from: process.env.FORWARD_FROM ?? "forwards@proofloft.com",
    });
  } catch (err) {
    console.error("[inbound] forward failed", err);
    // Non-2xx → Resend retries the webhook, so transient failures self-heal.
    return NextResponse.json({ error: "forward failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
