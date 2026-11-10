"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { Icon } from "@/components/ui/icon";
import type { Message } from "@/chat/contracts";

export function MessageActions({
  message,
  onCopy,
  onDownload,
  onFeedback,
  onRegenerate,
  onEdit,
  regenerating = false,
}: {
  message: Message;
  onCopy: () => void;
  onDownload: () => void;
  onFeedback: (feedback: "up" | "down") => void;
  onRegenerate: () => void;
  onEdit: () => void;
  regenerating?: boolean;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!moreOpen) return;
    const menu = menuRef.current;
    const trigger = moreRef.current?.querySelector("button");
    if (!menu || !trigger) return;
    const anchor = trigger.getBoundingClientRect();
    const popup = menu.getBoundingClientRect();
    const threadBottom =
      moreRef.current?.closest(".chat-thread")?.getBoundingClientRect()
        .bottom ?? innerHeight;
    const left = Math.max(
      8,
      Math.min(anchor.right - popup.width, innerWidth - popup.width - 8),
    );
    const below = anchor.bottom + 6;
    const top =
      below + popup.height <= Math.min(threadBottom, innerHeight) - 8
        ? below
        : Math.max(8, anchor.top - popup.height - 6);
    Object.assign(menu.style, {
      left: `${left}px`,
      top: `${top}px`,
      visibility: "visible",
    });
  }, [moreOpen]);
  useEffect(() => {
    if (!moreOpen) return;
    function outside(event: PointerEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
        moreRef.current
          ?.querySelector<HTMLButtonElement>("[aria-haspopup]")
          ?.focus();
      }
    }
    function dismissOnScroll(event: Event) {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      )
        return;
      setMoreOpen(false);
    }
    const dismissOnResize = () => setMoreOpen(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", dismissOnScroll, true);
    window.addEventListener("resize", dismissOnResize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", dismissOnScroll, true);
      window.removeEventListener("resize", dismissOnResize);
    };
  }, [moreOpen]);
  return (
    <div
      className="chat-message-actions"
      role="group"
      aria-label={
        message.role === "assistant"
          ? "Response actions"
          : "Your message actions"
      }
    >
      <IconButton
        variant="ghost"
        icon="copy"
        label="Copy message"
        onClick={onCopy}
      />
      {message.role === "assistant" ? (
        <>
          <IconButton
            variant="ghost"
            icon="thumbs-up"
            label="Good response"
            active={message.feedback === "up"}
            onClick={() => onFeedback("up")}
          />
          <IconButton
            variant="ghost"
            icon="thumbs-down"
            label="Poor response"
            active={message.feedback === "down"}
            onClick={() => onFeedback("down")}
          />
          <IconButton
            className="chat-action-secondary"
            variant="ghost"
            icon="download"
            label="Download response"
            onClick={onDownload}
          />
          <IconButton
            className="chat-action-secondary"
            variant="ghost"
            icon="refresh"
            label="Regenerate response"
            disabled={regenerating}
            onClick={onRegenerate}
          />
        </>
      ) : (
        <IconButton
          variant="ghost"
          icon="edit"
          label="Edit message"
          onClick={onEdit}
        />
      )}
      <div className="chat-message-more" ref={moreRef}>
        <IconButton
          variant="ghost"
          icon="more"
          label="More message actions"
          aria-haspopup="true"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen(!moreOpen)}
        />
        {moreOpen && (
          <div className="chat-action-menu" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                onCopy();
                setMoreOpen(false);
              }}
            >
              <Icon name="copy" size={16} />
              Copy message
            </button>
            <button
              type="button"
              onClick={() => {
                onDownload();
                setMoreOpen(false);
              }}
            >
              <Icon name="download" size={16} />
              Save as text
            </button>
            {message.role === "assistant" && (
              <button
                type="button"
                disabled={regenerating}
                onClick={() => {
                  onRegenerate();
                  setMoreOpen(false);
                }}
              >
                <Icon name="refresh" size={16} />
                Refresh response
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
