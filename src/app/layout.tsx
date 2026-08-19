import type { ReactNode } from "react";
import Link from "next/link";
import Mark from "./mark";
import SiteNav from "./site-nav";
import "./globals.css";

export const metadata = {
  title: "Proofloft — client testimonials for agencies, without per-client pricing",
  description:
    "Send a link, get a testimonial, embed a wall of love per client. Unlimited client workspaces on one flat plan.",
  icons: { icon: "/favicon.svg" },
};

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
        <SiteNav />
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
