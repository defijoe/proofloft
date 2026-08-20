// Dynamic Open Graph image for wall pages: branded card with the form's name,
// rendered on demand by next/og. Slack/LinkedIn/X fetch this when a wall link
// is pasted, so shares unfurl with the client's name instead of a bare URL.
import { ImageResponse } from "next/og";
import { one } from "@factory/core";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wall of love — collected with Proofloft";

export default async function OgImage({ params }: { params: { slug: string } }) {
  const form = await one<{ name: string }>(
    `select name from forms where slug = $1 and not archived`,
    [params.slug]
  );
  const name = form?.name ?? "Wall of love";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(155deg, #f2f1ee 0%, #f7f0de 55%, #f8e6a8 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#8a5c06",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Wall of love
        </div>
        <div
          style={{
            display: "flex",
            fontSize: name.length > 28 ? 58 : 76,
            fontWeight: 700,
            color: "#1a1611",
            marginTop: 20,
            lineHeight: 1.08,
            letterSpacing: -2,
          }}
        >
          {name}
        </div>
        {/* Five SVG stars — the OG renderer's bundled font has no ★ glyph. */}
        <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} width="52" height="52" viewBox="0 0 24 24">
              <path
                fill="#e8960c"
                d="M12 2l2.95 6.26 6.55.57-5 4.36 1.5 6.45L12 16.9l-6 2.74 1.5-6.45-5-4.36 6.55-.57z"
              />
            </svg>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 70, fontSize: 30, color: "#57503f" }}>
          <span style={{ fontWeight: 700, color: "#1a1611" }}>Proof</span>
          <span style={{ fontWeight: 700, color: "#e8960c" }}>loft</span>
          <span style={{ marginLeft: 16 }}>— real words from real people</span>
        </div>
      </div>
    ),
    size
  );
}
