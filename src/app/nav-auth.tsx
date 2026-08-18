"use client";
// Session-aware nav actions. Client-side check via /api/auth/me so the layout
// (and every static page under it) stays statically rendered — reading cookies
// in the root layout would force the whole app dynamic.
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavAuth() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setEmail(d?.email ?? null))
      .catch(() => {});
  }, []);

  if (email) {
    return (
      <>
        <a href="/api/auth/logout">Sign out</a>
        <Link href="/dashboard" className="btn btn-sm">Dashboard</Link>
      </>
    );
  }
  return (
    <>
      <Link href="/dashboard">Sign in</Link>
      <Link href="/dashboard" className="btn btn-sm">Start free</Link>
    </>
  );
}
