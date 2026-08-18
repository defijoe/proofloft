import { NextRequest, NextResponse } from "next/server";
import { query, one, track, sendEmail } from "@factory/core";

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
    `select u.id, u.email, f.name from forms f join users u on u.id = f.user_id where f.id = $1`,
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
    html: `<p><b>${authorName}</b>${authorTitle ? ` (${authorTitle})` : ""} left a ${rating}★ testimonial on <b>${owner.name}</b>:</p>
           <blockquote>${body.replace(/</g, "&lt;")}</blockquote>
           <p><a href="${process.env.APP_URL}/dashboard">Approve it in your dashboard →</a></p>`,
  }).catch(() => {}); // notification failure must not fail the submission

  return new NextResponse(
    `<html><body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center">
       <h2>Thank you! 💛</h2><p>Your testimonial was sent.</p>
     </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
