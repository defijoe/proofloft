// Comparison page. Claims sourced from senja.io/pricing (checked Aug 2026).
// RE-VERIFY QUARTERLY — competitor pricing pages change, and a stale claim kills trust.
import Link from "next/link";
import { CompareLayout, Row } from "../compare";

export const metadata = {
  title: "Proofloft vs Senja (2026) — pricing compared for agencies",
  description:
    "Senja is a great testimonial tool for SaaS. If you're an agency with many clients, per-project pricing adds up. Honest comparison, current pricing.",
};

export default function VsSenja() {
  return (
    <CompareLayout
      competitor="Senja"
      intro={
        <>
          Senja is a polished, well-loved testimonial tool — if you run one product,
          it&rsquo;s an easy recommendation. This comparison is for a different buyer: the
          agency or freelancer managing testimonials for <i>many clients</i>, where
          Senja&rsquo;s per-project pricing changes the math. Pricing below from senja.io/pricing,
          checked August 2026.
        </>
      }
      rows={[
        Row("Entry paid plan", "$29/mo Starter (3 forms, 1 project)", "$19/mo Pro (unlimited forms)"),
        Row("Plan for multiple workspaces", "$59/mo Pro: 5 projects, then $10/mo each", "$49/mo Agency: unlimited client workspaces"),
        Row("10 client workspaces", "~$109/mo (Pro + 5 extra projects)", "$49/mo flat"),
        Row("Free plan", "15 testimonials, 1 form, strong widget library", "10 testimonials, 1 form, 1 wall"),
        Row("Video testimonials", "Yes, incl. HD export & reels", "Not yet — text first, video on roadmap"),
        Row("Social imports (X, LinkedIn…)", "18 platforms", "Not yet"),
        Row("Consent capture on submission", "Via form settings", "Built into every form, stored with timestamp"),
        Row("Who it's really for", "SaaS & creators with one brand", "Agencies & freelancers with many clients"),
      ]}
      verdict={
        <>
          Honest verdict: if you need video testimonials and social imports today,
          use Senja — it&rsquo;s excellent. If your job is collecting and showing proof
          for ten different clients, flat-rate unlimited workspaces is the entire
          reason this product exists.
        </>
      }
    />
  );
}
