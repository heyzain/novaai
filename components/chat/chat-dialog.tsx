import type { ReactNode, RefObject } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { canFocus } from "@/lib/focus";

export function ChatDialog({
  title,
  children,
  onClose,
  dialogRef,
  variant = "default",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
  variant?: "default" | "search" | "image";
}) {
  return (
    <dialog
      ref={dialogRef}
      className={`chat-dialog chat-dialog--${variant}`}
      aria-labelledby="chat-dialog-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !event.nativeEvent.isComposing) {
          event.preventDefault();
          onClose();
        } else if (event.key === "Tab") {
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button, a[href], input, textarea, select, [tabindex]",
            ),
          ).filter(
            (element) =>
              element.tabIndex >= 0 &&
              !element.matches(":disabled") &&
              canFocus(element),
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <div className="chat-dialog-heading">
        <h2 id="chat-dialog-title">{title}</h2>
        <IconButton
          variant="ghost"
          icon="close"
          label="Close dialog"
          onClick={onClose}
        />
      </div>
      {children}
    </dialog>
  );
}
