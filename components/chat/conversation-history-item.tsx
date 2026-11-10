"use client";

import { Icon } from "@/components/ui/icon";

export function ConversationHistoryItem({
  title,
  description,
  active = false,
  onClick,
}: {
  title: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`nova-history ${active ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      title={title}
    >
      <span
        className="nova-icon-button nova-icon-button--secondary nova-history-icon"
        aria-hidden="true"
      >
        <Icon name="history-folder" />
      </span>
      <span className="nova-history-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
    </button>
  );
}
