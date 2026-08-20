import { NextRequest, NextResponse } from "next/server";
import { query, one, track, sendEmail, brandedEmail, escapeHtml, starsHtml } from "@factory/core";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const formId = Number(form.get("form_id"));
  const authorName = String(form.get("author_name") ?? "").slice(0, 120).trim();
  const authorTitle = String(form.get("author_title") ?? "").slice(0, 160).trim();
  const body = String(form.get("body") ?? "").slice(0, 2000).trim();
  const rating = Math.min(5, Math.max(1, Number(form.get("rating") ?? 5)));
  const consent = form.get("consent") === "on";

  if (!formId || !authorName || body.length < 20 || !consent) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const owner = await one<{ id: number; email: string; name: string }>(
    `select u.id, u.email, f.name from forms f join users u on u.id = f.user_id where f.id = $1 and not f.archived`,
    [formId]
  );
  if (!owner) return NextResponse.json({ error: "form not found" }, { status: 404 });

  await query(
    `insert into testimonials (form_id, author_name, author_title, body, rating, consent)
     values ($1, $2, $3, $4, $5, $6)`,
    [formId, authorName, authorTitle || null, body, rating, consent]
  );

  await track("testimonial", "submission", { meta: { formId } });

  // Notify the owner — this email is the retention loop.
  await sendEmail({
    to: owner.email,
    subject: `New testimonial from ${authorName} 🎉`,
    html: brandedEmail({
      preheader: `${authorName} left a ${rating}★ testimonial on ${owner.name}.`,
      heading: `New ${rating}★ testimonial 🎉`,
      bodyHtml: `<p style="margin:0 0 6px"><b style="color:#1d1d1f">${escapeHtml(authorName)}</b>${
        authorTitle ? ` · ${escapeHtml(authorTitle)}` : ""
      } just submitted on <b style="color:#1d1d1f">${escapeHtml(owner.name)}</b> ${starsHtml(rating)}</p>
        <blockquote style="margin:14px 0 0;padding:2px 0 2px 16px;border-left:3px solid #f6cf4f;color:#1d1d1f;font-size:15.5px;line-height:1.6">
          ${escapeHtml(body)}
        </blockquote>`,
      ctaLabel: "Review & approve",
      ctaUrl: `${process.env.APP_URL}/dashboard`,
      footnote: `You're receiving this because someone submitted a testimonial to your Proofloft form "${escapeHtml(owner.name)}". It won't appear on your wall until you approve it.`,
    }),
  }).catch(() => {}); // notification failure must not fail the submission

  // Branded thank-you page (standalone HTML — the submitter may never have seen Proofloft before).
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thank you!</title></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;min-height:100vh;background:linear-gradient(155deg,#f2f1ee 0%,#f7f0de 60%,#f8e6a8 100%);display:flex;align-items:center;justify-content:center;padding:24px">
  <div style="background:#fff;border-radius:28px;box-shadow:0 14px 44px rgba(29,29,31,.10);max-width:440px;width:100%;padding:44px 40px;text-align:center">
    <div style="width:58px;height:58px;border-radius:50%;background:#f6cf4f;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:26px">✓</div>
    <h1 style="margin:0 0 8px;font-size:26px;color:#1d1d1f;letter-spacing:-0.5px">Thank you!</h1>
    <p style="margin:0;color:#57503f;font-size:15px;line-height:1.6">Your testimonial was sent to <b>${escapeHtml(owner.name)}</b>. They&rsquo;ll review it before it goes live.</p>
    <p style="margin:26px 0 0;font-size:12.5px;color:#6d685b">Collected with <a href="https://proofloft.com" style="color:#8a5c06;font-weight:600;text-decoration:none">Proofloft</a></p>
  </div>
</body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
