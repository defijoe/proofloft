"use client";
// Submit button that asks for confirmation before letting the form's server
// action fire. Used for destructive actions (delete) — unpublish is reversible
// and doesn't need it.
import type { ReactNode } from "react";

export default function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
