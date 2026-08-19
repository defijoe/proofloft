import type { ReactNode } from "react";
import SiteNav from "./site-nav";
import SiteFooter from "./site-footer";
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
        <SiteFooter />
      </body>
    </html>
  );
}
