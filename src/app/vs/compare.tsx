// Shared layout for /vs/* comparison pages.
import Link from "next/link";
import type { ReactNode } from "react";

export function Row(label: string, them: string, us: string) {
  return { label, them, us };
}

export function CompareLayout({
  competitor,
  intro,
  rows,
  verdict,
}: {
  competitor: string;
  intro: ReactNode;
  rows: { label: string; them: string; us: string }[];
  verdict: ReactNode;
}) {
  return (
    <main className="wrap-narrow" style={{ paddingTop: 30, paddingBottom: 40 }}>
      <p className="kicker">Honest comparison</p>
      <h1 style={{ fontSize: "clamp(30px, 4.5vw, 42px)", lineHeight: 1.12, margin: "0 0 16px" }}>
        Proofloft vs {competitor}{" "}
        <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>(2026)</span>
      </h1>
      <p className="lede">{intro}</p>

      <table className="cmp">
        <thead>
          <tr>
            <th></th>
            <th>{competitor}</th>
            <th className="us">Proofloft</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="lbl">{r.label}</td>
              <td>{r.them}</td>
              <td className="us">{r.us}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="verdict">{verdict}</div>

      <p style={{ marginTop: 30 }}>
        <Link href="/dashboard" className="btn">Try it free — 1 form, no card</Link>
      </p>
      <p className="fineprint">
        Competitor pricing and limits from their public pricing page, last checked August 2026.
        Spot an inaccuracy? Email us and we&rsquo;ll fix it same-day — this page only works if
        it&rsquo;s honest.
      </p>
    </main>
  );
}
