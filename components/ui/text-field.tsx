"use client";

import { useId, type InputHTMLAttributes } from "react";
import { Icon, type IconName } from "./icon";

export function TextField({
  label,
  hint,
  error,
  icon,
  id,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  icon?: IconName;
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <div className={`nova-field ${className}`}>
      <label htmlFor={fieldId}>{label}</label>
      <div className="nova-input-wrap">
        {icon ? <Icon name={icon} size={18} /> : null}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error || hint ? `${fieldId}-description` : undefined
          }
          {...props}
        />
      </div>
      {error || hint ? (
        <span
          id={`${fieldId}-description`}
          className={error ? "nova-field-error" : "nova-field-hint"}
        >
          {error || hint}
        </span>
      ) : null}
    </div>
  );
}
