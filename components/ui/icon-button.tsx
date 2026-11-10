"use client";

import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./icon";

export function IconButton({
  icon,
  label,
  active,
  variant = "secondary",
  size = "md",
  className = "",
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: IconName;
  label: string;
  active?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      type="button"
      className={`nova-icon-button nova-icon-button--${variant} nova-icon-button--${size} ${active ? "is-active" : ""} ${className}`}
      aria-label={label}
      aria-pressed={active}
      title={label}
      {...props}
    >
      <Icon name={icon} size={size === "lg" ? 24 : size === "sm" ? 18 : 20} />
    </button>
  );
}
