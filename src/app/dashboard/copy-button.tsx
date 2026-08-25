"use client";
// Small copy-to-clipboard chip shown next to shareable links (form link, wall
// link, embed snippet). Flashes "✓ Copied" for a moment after a click.
import { useRef, useState } from "react";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older browsers / non-secure contexts: textarea + execCommand fallback.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className={`copy-btn${copied ? " ok" : ""}`} onClick={copy} aria-label={`Copy to clipboard: ${text}`}>
      {copied ? (
        <>✓ Copied</>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="12" height="12" rx="2.5" />
            <path d="M5 15H4.5A2.5 2.5 0 0 1 2 12.5v-8A2.5 2.5 0 0 1 4.5 2h8A2.5 2.5 0 0 1 15 4.5V5" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
