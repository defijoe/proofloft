/**
 * Branded transactional email shell. Email-safe: single-column table layout,
 * fully inline styles, system font stack, no external images. Matches the
 * warm-gradient style guide (cream canvas, white rounded card, black pill CTA,
 * yellow accents).
 */

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export function brandedEmail(opts: {
  /** Hidden inbox-preview line. */
  preheader?: string;
  heading: string;
  /** Inner HTML for the body. Escape any user content before passing. */
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  /** Small gray line under the card, e.g. "If you didn't request this…" */
  footnote?: string;
}): string {
  const cta =
    opts.ctaLabel && opts.ctaUrl
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 4px"><tr><td>
           <a href="${opts.ctaUrl}"
              style="display:inline-block;background:#1d1d1f;color:#ffffff;text-decoration:none;
                     font-weight:600;font-size:15px;padding:13px 30px;border-radius:999px;font-family:${FONT}">
             ${opts.ctaLabel}
           </a>
         </td></tr></table>`
      : "";

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background-color:#f7f0de">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f0de">
    <tr><td align="center" style="padding:36px 16px 48px">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <tr><td style="padding:0 8px 18px;font-family:${FONT}">
          <span style="font-size:21px;font-weight:700;color:#1d1d1f;letter-spacing:-0.3px">Proof<span style="color:#e8960c">loft</span></span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:22px;padding:36px 38px;font-family:${FONT}">
          <h1 style="margin:0 0 14px;font-size:23px;font-weight:700;color:#1d1d1f;letter-spacing:-0.4px">${opts.heading}</h1>
          <div style="font-size:15px;line-height:1.65;color:#57503f">${opts.bodyHtml}</div>
          ${cta}
        </td></tr>
        ${opts.footnote ? `<tr><td style="padding:16px 10px 0;font-family:${FONT};font-size:12.5px;line-height:1.6;color:#6d685b">${opts.footnote}</td></tr>` : ""}
        <tr><td style="padding:26px 10px 0;font-family:${FONT};font-size:12px;line-height:1.7;color:#6d685b">
          Proofloft — testimonials for every client you have.<br />
          Operated by Media Yard LLC ·
          <a href="https://proofloft.com/legal/privacy" style="color:#6d685b">Privacy</a> ·
          <a href="https://proofloft.com/legal/terms" style="color:#6d685b">Terms</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Yellow star row for ratings, e.g. stars(5). */
export function starsHtml(rating: number): string {
  return `<span style="color:#e8960c;letter-spacing:2px">${"★".repeat(Math.min(5, Math.max(1, rating)))}</span>`;
}
