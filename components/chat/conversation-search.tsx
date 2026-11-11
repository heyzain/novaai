"use client";

import { useRef, type KeyboardEvent } from "react";
import type { ConversationSummary } from "@/chat/contracts";
import { Icon } from "@/components/ui/icon";

export function ConversationSearch({
  conversations,
  query,
  onQueryChange,
  onSelect,
}: {
  conversations: readonly ConversationSummary[];
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const results = conversations.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery),
  );

  function navigateResults(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(
      resultsRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    );
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    if (event.key === "ArrowUp" && index === 0) {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }
    const next =
      event.key === "ArrowDown"
        ? Math.min(index + 1, buttons.length - 1)
        : event.key === "ArrowUp"
          ? index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? buttons.length - 1
              : -1;
    if (next >= 0) {
      event.preventDefault();
      buttons[next]?.focus();
    }
  }

  return (
    <>
      <label className="chat-search-field">
        <Icon name="search" size={22} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || !results.length) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              const buttons = resultsRef.current?.querySelectorAll("button");
              buttons?.[
                event.key === "ArrowDown" ? 0 : results.length - 1
              ]?.focus();
            } else if (event.key === "Enter") {
              event.preventDefault();
              onSelect(results[0].id);
            }
          }}
          placeholder="Find a conversation…"
          aria-label="Search conversations"
          aria-controls="conversation-search-results"
          autoComplete="off"
          autoFocus
        />
        <kbd>Ctrl K</kbd>
      </label>
      <div
        id="conversation-search-results"
        className="chat-search-results"
        ref={resultsRef}
        onKeyDown={navigateResults}
        role="group"
        aria-label="Matching conversations"
      >
        {results.map((item) => (
          <button type="button" key={item.id} onClick={() => onSelect(item.id)}>
            <Icon name="chat" size={24} />
            <span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </span>
            <Icon name="arrow" size={18} />
          </button>
        ))}
        {!results.length && (
          <p role="status">No conversations found. Try a different search.</p>
        )}
      </div>
    </>
  );
}
