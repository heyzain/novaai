"use client";

import { Icon } from "./icon";

export function Toast({
  message,
  action,
  className = "",
}: {
  message: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div
      className={`nova-toast ${message ? "is-visible" : ""} ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="nova-toast-icon" aria-hidden="true">
        <Icon name="check" size={16} />
      </span>
      <span className="nova-toast-message">{message}</span>
      {message && action && (
        <button
          type="button"
          className="nova-toast-action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
