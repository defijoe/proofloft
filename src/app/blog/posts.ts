// Blog post registry — the single source of truth for the index page and the
// sitemap. Each post is a static page at src/app/blog/<slug>/page.tsx; add the
// page AND a row here when publishing.
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO, shown as "Aug 20, 2026"
  minutes: number;
};

export const POSTS: PostMeta[] = [
  {
    slug: "how-to-ask-for-a-testimonial",
    title: "How to ask a client for a testimonial (without it being awkward)",
    description:
      "The best moment to ask, what to say, and three copy-paste email templates that get real, specific testimonials instead of polite one-liners.",
    date: "2026-08-20",
    minutes: 5,
  },
  {
    slug: "what-is-a-wall-of-love",
    title: "What is a wall of love — and why every agency needs one",
    description:
      "A wall of love turns scattered praise into a single page that sells for you. What it is, where to use it, and how to build one in minutes.",
    date: "2026-08-20",
    minutes: 4,
  },
];

export function postDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
