"use client";
// Marketing nav. Hidden on /dashboard routes — the dashboard has its own
// header (logo, plan chip, account, sign out), so a second menu up top is
// just noise for signed-in users.
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "./mark";
import NavAuth from "./nav-auth";

export default function SiteNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

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
