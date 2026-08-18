// Comparison page. Claims sourced from testimonial.to/pricing (checked Aug 2026).
// RE-VERIFY QUARTERLY — competitor pricing pages change, and a stale claim kills trust.
import Link from "next/link";
import { CompareLayout, Row } from "../compare";

export const metadata = {
  title: "Proofloft vs Testimonial.to (2026) — pricing compared for agencies",
  description:
    "Testimonial.to pioneered video testimonials. For agencies with many clients, per-space pricing adds up fast. Honest comparison with current pricing.",
};

export default function VsTestimonialTo() {
  return (
    <CompareLayout
      competitor="Testimonial.to"
      intro={
        <>
          Testimonial.to pioneered the video-testimonial category and remains the
          reference for video-first social proof. This page compares it for one
          specific buyer: agencies managing proof for many clients, where per-space
          pricing is the deciding factor. Pricing from testimonial.to/pricing, checked
          August 2026.
        </>
      }
      rows={[
        Row("Entry paid plan", "$25/mo Starter (1 space, still only 2 videos)", "$19/mo Pro (unlimited forms & testimonials)"),
        Row("Plan for multiple workspaces", "$50/mo Ultimate per space (~$600/yr per extra space)", "$49/mo Agency: unlimited client workspaces"),
        Row("10 client workspaces", "~$500/mo equivalent", "$49/mo flat"),
        Row("Free plan", "10 text + 2 video, 1 space", "10 testimonials, 1 form, 1 wall"),
        Row("Video testimonials", "Yes — the category leader", "Not yet — text first, video on roadmap"),
        Row("Branding removal", "Only from Ultimate ($50/mo)", "From Pro ($19/mo)"),
        Row("Consent capture on submission", "Standard terms", "Built into every form, stored with timestamp"),
        Row("Who it's really for", "Brands that want video proof", "Agencies & freelancers with many clients"),
      ]}
      verdict={
        <>
          Honest verdict: for video-first proof on one brand, Testimonial.to is the
          category leader and worth its price. For text-first proof across many
          client workspaces at a flat rate, that&rsquo;s us — and it&rsquo;s not close on cost.
        </>
      }
    />
  );
}
