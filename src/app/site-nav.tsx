"use client";
// Marketing nav. Hidden on /dashboard (it has its own header) and on the
// public client-facing pages (/f capture forms, /w walls) — those are shared
// with a client's audience, who shouldn't see our menu or session buttons.
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "./mark";
import NavAuth from "./nav-auth";

export const CHROME_FREE = ["/dashboard", "/f/", "/w/"];

export default function SiteNav() {
  const pathname = usePathname();
  if (pathname && CHROME_FREE.some((p) => pathname.startsWith(p))) return null;

  return (
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
  );
}
