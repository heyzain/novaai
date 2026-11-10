"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { UserProfileHeader } from "./user-profile-header";
import { ConversationHistoryItem } from "./conversation-history-item";

export function ConversationHistoryPanel({
  items,
  selectedId,
  onSelect,
  onClear,
  onRestore,
  onGift,
  restoreLabel = "Restore examples",
  profile,
}: {
  items: readonly { id: string; title: string; description: string }[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  onRestore: () => void;
  onGift: () => void;
  restoreLabel?: string;
  profile?: { name: string; plan: string; avatarSrc: string };
}) {
  const headingId = useId();
  return (
    <div className="nova-history-shell">
      <aside className="nova-history-panel" aria-labelledby={headingId}>
        <UserProfileHeader {...profile} onGift={onGift} />
        <div className="nova-history-section">
          <h3 id={headingId}>History</h3>
          {items.length ? (
            <ul className="nova-history-list">
              {items.map((item) => (
                <li key={item.id}>
                  <ConversationHistoryItem
                    title={item.title}
                    description={item.description}
                    active={selectedId === item.id}
                    onClick={() => onSelect(item.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="nova-history-empty">
              <Icon name="history-folder" size={28} />
              <p>No conversations yet.</p>
              <Button size="sm" onClick={onRestore}>
                {restoreLabel}
              </Button>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            className="nova-history-delete"
            onClick={onClear}
          >
            <Icon name="trash" size={20} />
            Delete History
          </Button>
        )}
      </aside>
    </div>
  );
}
