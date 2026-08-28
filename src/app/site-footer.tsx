"use client";
// Marketing footer — card groups (Product / Company / Legal) over a brand bar,
// matching the treatment on our other properties. Hidden on the same routes as
// the nav — the dashboard has its own shell, and public client-facing pages
// (/f, /w) stay chrome-free (the wall's badge is the only branding there).
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "./mark";
import { CHROME_FREE } from "./site-nav";

function FootCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <div className="text-[12px] font-bold uppercase tracking-widest text-ink-3">{title}</div>
      <div className="mt-3 space-y-2 text-[14.5px]">{children}</div>
    </div>
  );
}

function FootLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-ink-2 no-underline underline-offset-2 hover:text-ink hover:underline">
      {children}
    </Link>
  );
}

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname && CHROME_FREE.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-2 font-sans">
      <footer>
        <div className="grid gap-4 sm:grid-cols-3">
          <FootCard title="Product">
            <FootLink href="/docs/embed">How to embed</FootLink>
            <FootLink href="/vs/senja">Proofloft vs Senja</FootLink>
            <FootLink href="/vs/testimonial-to">Proofloft vs Testimonial.to</FootLink>
            <FootLink href="/dashboard">Sign in</FootLink>
          </FootCard>
          <FootCard title="Company">
            <FootLink href="/about">About us</FootLink>
            <FootLink href="/blog">Blog</FootLink>
            <FootLink href="/support">Support center</FootLink>
            <a href="mailto:hello@proofloft.com" className="block text-ink-2 no-underline underline-offset-2 hover:text-ink hover:underline">
              hello@proofloft.com
            </a>
          </FootCard>
          <FootCard title="Legal">
            <FootLink href="/legal/terms">Terms of Service</FootLink>
            <FootLink href="/legal/privacy">Privacy Policy</FootLink>
            <FootLink href="/legal/ai">AI Disclosure</FootLink>
            <FootLink href="/legal/dpa">Data Processing Agreement</FootLink>
          </FootCard>
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-white p-6 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <span className="inline-flex items-center gap-2 font-display text-[15px] font-bold text-ink">
              <Mark size={18} /> Proofloft
            </span>
            <p className="m-0 mt-1 text-[13px] leading-relaxed text-ink-3">
              Testimonials for every client you have. Minimal data by design — testimonials and
              emails, nothing else. Payments securely processed by Stripe.
            </p>
          </div>
          <p className="m-0 mt-3 shrink-0 text-[13px] leading-relaxed text-ink-3 sm:mt-0 sm:text-right">
            © {new Date().getFullYear()} Media Yard LLC.
            <br />
            Also from us: <a href="https://getreviewloft.com" target="_blank" rel="noopener" className="text-ink-2">ReviewLoft</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
