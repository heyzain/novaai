import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
  size = "md",
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "success" | "date";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={`nova-badge nova-badge--${tone} nova-badge-size--${size}`}>
      {tone === "success" ? <span className="nova-status-dot" /> : null}
      {children}
    </span>
  );
}
