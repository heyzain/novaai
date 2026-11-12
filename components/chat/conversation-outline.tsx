"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import type { ConversationOutlineEntry } from "@/chat/conversation-outline";

export function ConversationOutline({
  title,
  entries,
  currentTargetId,
  status,
  visible,
  updatingMessageId,
  onNavigate,
}: {
  title: string;
  entries: readonly ConversationOutlineEntry[];
  currentTargetId?: string;
  status: "loading" | "ready" | "error";
  visible: boolean;
  updatingMessageId?: string;
  onNavigate: (targetId: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible) return;
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !item) return;
    const bounds = list.getBoundingClientRect();
    const target = item.getBoundingClientRect();
    if (target.top < bounds.top) list.scrollTop += target.top - bounds.top - 4;
    else if (target.bottom > bounds.bottom)
      list.scrollTop += target.bottom - bounds.bottom + 4;
  }, [currentTargetId, visible]);

  return (
    <section
      className="chat-outline"
      aria-labelledby="chat-outline-heading"
      aria-busy={status === "loading"}
    >
      <div className="chat-outline-heading">
        <h2 id="chat-outline-heading">In this chat</h2>
        {status === "ready" && entries.length > 0 && (
          <span>{entries.length}</span>
        )}
      </div>
      {status === "ready" && entries.length > 0 && (
        <p className="chat-outline-title" title={title}>
          {title}
        </p>
      )}
      <div className="chat-outline-scroll" ref={listRef}>
        {status === "loading" ? (
          <div className="chat-outline-skeleton">
            <span className="chat-sr-only" role="status">
              Loading chat outline
            </span>
            <div aria-hidden="true">
              {[0, 1, 2, 3].map((id) => (
                <span className="chat-skeleton chat-skeleton-line" key={id} />
              ))}
            </div>
          </div>
        ) : status === "error" ? (
          <p className="chat-outline-empty">
            The outline will appear when this conversation loads.
          </p>
        ) : entries.length ? (
          <nav aria-label="In this chat">
            <ol>
              {entries.map((entry) => (
                <li key={entry.targetId}>
                  <button
                    type="button"
                    title={entry.title}
                    aria-controls={
                      entry.messageId === updatingMessageId
                        ? undefined
                        : entry.targetId
                    }
                    aria-current={
                      entry.targetId === currentTargetId
                        ? "location"
                        : undefined
                    }
                    disabled={entry.messageId === updatingMessageId}
                    onClick={() => onNavigate(entry.targetId)}
                  >
                    <Icon
                      name={entry.kind === "photos" ? "grid" : "chat"}
                      size={16}
                    />
                    <span>
                      <span className="chat-outline-label">{entry.title}</span>
                      <span className="chat-outline-detail">
                        {entry.messageId === updatingMessageId
                          ? "Updating…"
                          : entry.detail}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        ) : (
          <p className="chat-outline-empty">
            Your messages and photos will appear here as you chat.
          </p>
        )}
      </div>
    </section>
  );
}
