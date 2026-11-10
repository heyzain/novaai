import { AppLogo } from "@/components/branding/app-logo";

export function MessageSkeleton({ reply = false }: { reply?: boolean }) {
  return (
    <div
      className="chat-message chat-assistant chat-message-skeleton"
      role="status"
      aria-label={reply ? "Nova is preparing a reply" : "Loading conversation"}
    >
      <AppLogo size={44} />
      <h2>Nova AI</h2>
      <div className="chat-assistant-content" aria-hidden="true">
        <span className="chat-skeleton chat-skeleton-line" />
        <span className="chat-skeleton chat-skeleton-line" />
        <span className="chat-skeleton chat-skeleton-line chat-skeleton-line--short" />
        {!reply && (
          <div className="chat-skeleton-photos">
            {[0, 1, 2].map((id) => (
              <span className="chat-skeleton" key={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
