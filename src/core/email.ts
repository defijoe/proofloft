import { Resend } from "resend";

let client: Resend | undefined;

export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<void> {
  // In dev without a key, log instead of sending — keeps local flows testable.
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email:dev] to=${opts.to} subject="${opts.subject}"\n${opts.html}`);
    return;
  }
  client ??= new Resend(process.env.RESEND_API_KEY);
  const { error } = await client.emails.send({
    from: process.env.EMAIL_FROM ?? "Factory <onboarding@resend.dev>",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
  if (error) throw new Error(`email send failed: ${error.message}`);
}
