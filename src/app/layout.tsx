import type { ReactNode } from "react";
import Link from "next/link";
import NavAuth from "./nav-auth";
import "./globals.css";

export const metadata = {
  title: "Proofloft — client testimonials for agencies, without per-client pricing",
  description:
    "Send a link, get a testimonial, embed a wall of love per client. Unlimited client workspaces on one flat plan.",
  icons: { icon: "/favicon.svg" },
};

// Logomark: a speech bubble (the testimonial) holding a star (the rating).
function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="plg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5a623" />
          <stop offset="1" stopColor="#e8780c" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C8.27 2 2 7.6 2 14.5c0 3.93 2.03 7.43 5.2 9.72l-1.18 5.4c-.2.92.74 1.63 1.55 1.16l5.53-3.2c.94.18 1.9.27 2.9.27 7.73 0 14-5.6 14-12.5S23.73 2 16 2z"
        fill="url(#plg)"
      />
      <path
        d="M16 7.6l2.14 4.33 4.78.7-3.46 3.37.82 4.76L16 18.51l-4.28 2.25.82-4.76-3.46-3.37 4.78-.7z"
        fill="#fff"
      />
    </svg>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Google Fonts: Space Grotesk (display) + Inter (body). Link-in-body is valid HTML and avoids build-time font fetching. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="wrap">
          <nav className="nav">
            <Link href="/" className="logo">
              <Mark />
              <span>Proof<em>loft</em></span>
            </Link>
            <div className="nav-links">
              <Link href="/#how">How it works</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/#faq">FAQ</Link>
              <Link href="/vs/senja">vs Senja</Link>
              <NavAuth />
            </div>
          </nav>
        </div>
        {children}
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
                <br />© {new Date().getFullYear()} Media Yard LLC. All rights reserved.
              </div>
              <div style={{ textAlign: "right" }}>
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
      </body>
    </html>
  );
}
