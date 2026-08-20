// Self-serve data export: the signed-in owner downloads every testimonial and
// its consent record across ALL their forms — archived ones included, because
// consent records are legal records and belong in the export.
// GET /api/export?format=csv | json  (defaults to csv)
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE, query } from "@factory/core";

export const dynamic = "force-dynamic";

type Row = {
  form_name: string; form_slug: string; form_archived: boolean;
  author_name: string; author_title: string | null; body: string;
  rating: number | null; hide_rating: boolean; approved: boolean;
  consent: boolean; source: string | null; source_url: string | null;
  created_at: string;
};

const COLUMNS: (keyof Row)[] = [
  "form_name", "form_slug", "form_archived",
  "author_name", "author_title", "body",
  "rating", "hide_rating", "approved",
  "consent", "source", "source_url", "created_at",
];

/**
 * CSV-escape a value: RFC 4180 quoting, plus a leading apostrophe on cells
 * that spreadsheet apps would otherwise execute as formulas (=, +, -, @).
 */
function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  let s = v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export async function GET(req: NextRequest) {
  const user = readSession(cookies().get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rows = await query<Row>(
    `select f.name as form_name, f.slug as form_slug, f.archived as form_archived,
            t.author_name, t.author_title, t.body,
            t.rating, t.hide_rating, t.approved, t.consent,
            t.source, t.source_url, t.created_at
     from testimonials t join forms f on f.id = t.form_id
     where f.user_id = $1
     order by t.created_at asc`,
    [user.id]
  );

  const format = req.nextUrl.searchParams.get("format") === "json" ? "json" : "csv";
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "json") {
    return NextResponse.json(
      {
        exported_at: new Date().toISOString(),
        account_email: user.email,
        testimonial_count: rows.length,
        testimonials: rows,
      },
      {
        headers: {
          "Content-Disposition": `attachment; filename="proofloft-export-${stamp}.json"`,
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const lines = [COLUMNS.join(",")];
  for (const r of rows) lines.push(COLUMNS.map((c) => csvCell(r[c])).join(","));

  return new NextResponse(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="proofloft-export-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
