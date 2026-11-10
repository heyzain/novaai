"use client";

// Documentation-only examples; product data is served by chat/server/.
import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { AppLogo } from "@/components/branding/app-logo";
import { MessageComposer } from "@/components/chat/message-composer";

const originalReply =
  "Absolutely! I can suggest several ready-made mountain tours, from relaxing scenic trips to more active hiking experiences.";

export function ConversationPreview({
  notify,
}: {
  notify: (message: string) => void;
}) {
  const [messages, setMessages] = useState<
    { id: number; text: string; role: "user" | "assistant" }[]
  >([]);
  const [liked, setLiked] = useState(false);
  const messageId = useRef(0);
  function send(text: string, tool: string | null) {
    const userId = ++messageId.current;
    const assistantId = ++messageId.current;
    setMessages((current) => [
      ...current,
      { id: userId, text, role: "user" },
      {
        id: assistantId,
        text: `This is a local design-system preview${tool ? ` with ${tool.toLowerCase()} selected` : ""}. Your message was received. Connect your AI service to provide a live response.`,
        role: "assistant",
      },
    ]);
  }
  async function copyReply() {
    try {
      await navigator.clipboard.writeText(originalReply);
      notify("Response copied");
    } catch {
      notify("Clipboard unavailable in this browser");
    }
  }
  return (
    <div className="conversation-demo">
      <div className="conversation-top">
        <span>
          <span className="live-dot" />
          Conversation preview
        </span>
        <button
          type="button"
          onClick={() => {
            setMessages([]);
            setLiked(false);
            notify("Conversation reset");
          }}
        >
          <Icon name="refresh" size={14} />
          Reset
        </button>
      </div>
      <div
        className="conversation-messages"
        role="log"
        aria-label="Conversation messages"
        aria-live="polite"
      >
        <div className="date-separator">
          <Badge tone="date">Today</Badge>
        </div>
        <div className="demo-message assistant">
          <AppLogo size={32} />
          <div>
            <strong>Nova AI</strong>
            <p>
              Good ideas start with a little curiosity.
              <br />
              Where would you like to go next?
            </p>
          </div>
        </div>
        <div className="demo-message user">
          <p>Let’s find a little mountain escape.</p>
          <Avatar size="sm" />
        </div>
        <div className="demo-message assistant">
          <AppLogo size={32} />
          <div>
            <strong>Nova AI</strong>
            <p>{originalReply}</p>
            <div className="message-actions">
              <button
                type="button"
                aria-label="Copy response"
                onClick={copyReply}
              >
                <Icon name="copy" size={15} />
              </button>
              <button
                type="button"
                aria-label="Like response"
                aria-pressed={liked}
                className={liked ? "is-liked" : ""}
                onClick={() => setLiked(!liked)}
              >
                <Icon name="heart" size={15} />
              </button>
              <button
                type="button"
                aria-label="Regenerate demo response"
                onClick={() => notify("Demo response regenerated")}
              >
                <Icon name="refresh" size={15} />
              </button>
            </div>
          </div>
        </div>
        {messages.map((message) => (
          <div key={message.id} className={`demo-message ${message.role}`}>
            {message.role === "assistant" ? <AppLogo size={32} /> : null}
            <div>
              {message.role === "assistant" ? <strong>Nova AI</strong> : null}
              <p>{message.text}</p>
            </div>
            {message.role === "user" ? <Avatar size="sm" /> : null}
          </div>
        ))}
      </div>
      <MessageComposer onSend={send} />
      <p className="demo-footnote">
        Interactive local preview · No AI service connected
      </p>
    </div>
  );
}
