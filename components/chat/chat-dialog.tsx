import type { ReactNode, RefObject } from "react";
import { IconButton } from "@/components/ui/icon-button";

export function ChatDialog({
  title,
  children,
  onClose,
  dialogRef,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
  wide?: boolean;
}) {
  return (
    <dialog
      ref={dialogRef}
      className={`chat-dialog ${wide ? "chat-dialog--wide" : ""}`}
      aria-labelledby="chat-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
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
