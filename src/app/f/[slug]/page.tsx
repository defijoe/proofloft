// Public capture form: what the customer's client sees at /f/<slug>.
import { notFound } from "next/navigation";
import { one } from "@factory/core";

export const dynamic = "force-dynamic";

export default async function CaptureForm({ params }: { params: { slug: string } }) {
  const form = await one<{ id: number; name: string; headline: string }>(
    `select id, name, headline from forms where slug = $1`,
    [params.slug]
  );

  if (!form) notFound(); // renders the branded 404

  return (
    <main className="capture">
      <div className="capture-card">
        <div className="stars" style={{ fontSize: 18, marginBottom: 12 }}>★★★★★</div>
        <h1>{form.headline}</h1>
        <p className="capture-sub">
          Share a few words about working with {form.name}. It takes about a minute.
        </p>

        <form method="POST" action="/api/submit" style={{ display: "grid", gap: 12, marginTop: 24 }}>
          <input type="hidden" name="form_id" value={form.id} />
          <input className="dash-input" name="author_name" required placeholder="Your name" />
          <input className="dash-input" name="author_title" placeholder="Role & company (optional)" />
          <textarea
            className="dash-area"
            name="body"
            required
            minLength={20}
            rows={5}
            placeholder="What was it like? Be specific — results, before/after, favorite part."
          />
          <label className="capture-rating">
            Rating{" "}
            <select className="dash-input" name="rating" defaultValue="5" style={{ width: 90, display: "inline-block", flex: "none" }}>
              <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
            </select>
          </label>
          {/* Consent checkbox — the legal load-bearing element. Stored on the row. */}
          <label className="consent-box">
            <input type="checkbox" name="consent" required />{" "}
            I give {form.name} permission to display this testimonial, my name and role on
            their website and marketing materials.
          </label>
          <button type="submit" className="btn" style={{ width: "100%" }}>Submit testimonial</button>
        </form>
      </div>
      <p className="capture-note">
        Collected with <a href="/" style={{ fontWeight: 600, color: "#8a5c06", textDecoration: "none" }}>Proofloft</a> — written by a real person, never AI.
      </p>
    </main>
  );
}
