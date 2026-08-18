// Public capture form: what the customer's client sees at /f/<slug>.
import { one } from "@factory/core";

export const dynamic = "force-dynamic";

export default async function CaptureForm({ params }: { params: { slug: string } }) {
  const form = await one<{ id: number; name: string; headline: string }>(
    `select id, name, headline from forms where slug = $1`,
    [params.slug]
  );

  if (!form) {
    return (
      <main className="wrap-narrow" style={{ padding: "60px 24px" }}>
        <h1>Form not found</h1>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "30px 24px 60px" }}>
      <div className="card" style={{ padding: "34px 36px" }}>
        <div className="stars" style={{ marginBottom: 10 }}>★★★★★</div>
        <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>{form.headline}</h1>
        <p style={{ color: "var(--ink-2)", marginTop: 0 }}>
          Share a few words about working with {form.name}. It takes about a minute.
        </p>

        <form method="POST" action="/api/submit" style={{ display: "grid", gap: 14, marginTop: 22 }}>
          <input type="hidden" name="form_id" value={form.id} />
          <input className="field" name="author_name" required placeholder="Your name" />
          <input className="field" name="author_title" placeholder="Role & company (optional)" />
          <textarea
            className="field"
            name="body"
            required
            minLength={20}
            rows={5}
            placeholder="What was it like? Be specific — results, before/after, favorite part."
          />
          <label style={{ fontSize: 14, color: "var(--ink-2)" }}>
            Rating{" "}
            <select className="field" name="rating" defaultValue="5" style={{ width: 90, display: "inline-block" }}>
              <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
            </select>
          </label>
          {/* Consent checkbox — the legal load-bearing element. Stored on the row. */}
          <label style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
            <input type="checkbox" name="consent" required />{" "}
            I give {form.name} permission to display this testimonial, my name and role on
            their website and marketing materials.
          </label>
          <button type="submit" className="btn">Submit testimonial</button>
        </form>
      </div>
      <p style={{ textAlign: "center", fontSize: 12.5, color: "var(--ink-3)" }}>
        Collected with Proofloft
      </p>
    </main>
  );
}
