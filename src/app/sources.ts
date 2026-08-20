// Shared labels for imported-testimonial sources. Keys match the values
// stored in testimonials.source (see db/003-testimonial-source.sql and
// importTestimonialAction). null/unknown source = collected via the form.
export const SOURCE_LABELS: Record<string, string> = {
  email: "Email",
  x: "X",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  google: "Google",
  g2: "G2",
  other: "the web",
};

export function sourceLabel(source: string | null | undefined): string | null {
  if (!source) return null;
  return SOURCE_LABELS[source] ?? SOURCE_LABELS.other;
}
