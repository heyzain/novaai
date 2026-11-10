"use client";

import { Children, type ButtonHTMLAttributes } from "react";

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <button
      type={type}
      className={`nova-button nova-button--${variant} nova-button--${size} ${className}`}
      {...props}
    >
      {variant === "primary" || variant === "secondary" ? (
        <span className="nova-button-label">
          {variant === "secondary"
            ? Children.map(children, (child) =>
                typeof child === "string" || typeof child === "number" ? (
                  <span className="nova-button-text">{child}</span>
                ) : (
                  child
                ),
              )
            : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
