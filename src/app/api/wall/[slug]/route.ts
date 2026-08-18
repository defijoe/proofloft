import { NextRequest, NextResponse } from "next/server";
import { query, one } from "@factory/core";

// Public JSON feed of APPROVED testimonials, consumed by /embed.js on customer sites.
// CORS: open (configured in next.config.mjs) — this data is public by design.
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const form = await one<{ id: number }>(`select id from forms where slug = $1`, [params.slug]);
  if (!form) return NextResponse.json({ error: "not found" }, { status: 404 });

  const items = await query(
    `select author_name, author_title, body, rating, created_at
     from testimonials
     where form_id = $1 and approved = true and consent = true
     order by created_at desc limit 50`,
    [form.id]
  );

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}
