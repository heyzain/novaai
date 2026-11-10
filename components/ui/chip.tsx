"use client";

import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./icon";

export function Chip({
  icon,
  children,
  selected = false,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconName;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      className={`nova-chip ${selected ? "is-selected" : ""} ${className}`}
      aria-pressed={selected}
      {...props}
    >
      {icon ? <Icon name={icon} size={15} /> : null}
      {children}
    </button>
  );
}
