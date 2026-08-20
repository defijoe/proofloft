"use client";
// Marketing footer. Hidden on the same routes as the nav — the dashboard has
// its own shell, and public client-facing pages (/f, /w) stay chrome-free
// (the wall's badge is the only branding there).
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "./mark";
import { CHROME_FREE } from "./site-nav";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname && CHROME_FREE.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="wrap">
      <footer className="footer">
        <div className="cols">
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--ink)", fontFamily: "var(--display)", fontWeight: 700 }}>
              <Mark size={18} /> Proofloft
            </span>{" "}
            — testimonials for every client you have.
            <br />Operated by Media Yard LLC. Payments securely processed by Stripe.
            <br />Minimal data by design: testimonials and emails, nothing else.
            <br />Support: <a href="mailto:hello@proofloft.com">hello@proofloft.com</a>
            <br />© {new Date().getFullYear()} Media Yard LLC. All rights reserved.
          </div>
          <div style={{ textAlign: "right" }}>
            <Link href="/about">About us</Link>
            <br />
            <Link href="/docs/embed">How to embed</Link>
            <br />
            <Link href="/vs/senja">Proofloft vs Senja</Link>
            <br />
            <Link href="/vs/testimonial-to">Proofloft vs Testimonial.to</Link>
            <br />
            <Link href="/legal/terms">Terms of Service</Link>
            <br />
            <Link href="/legal/privacy">Privacy Policy</Link>
            <br />
            <Link href="/legal/ai">AI Disclosure</Link>
            <br />
            <Link href="/dashboard">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
