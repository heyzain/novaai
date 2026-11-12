import type { Message } from "./contracts";

export type ConversationOutlineEntry = {
  targetId: string;
  messageId: string;
  title: string;
  detail: string;
  kind: "message" | "photos";
};

export const messageTargetId = (id: string) =>
  `message-${encodeURIComponent(id)}`;
export const photosTargetId = (id: string) =>
  `photos-${encodeURIComponent(id)}`;

function outlineTitle(message: Message) {
  const supplied = message.outlineTitle?.trim();
  const text = message.text
    .replace(/\s+/g, " ")
    .replace(/^(?:hi|hello|hey|absolutely|sure|of course)[!,. :]+/i, "")
    .replace(/^[#>*\s]+/, "")
    .trim();
  const title =
    supplied ||
    text.split(/[.!?](?:\s|$)/)[0] ||
    (message.role === "user" ? "Your message" : "Nova’s reply");
  const characters = Array.from(title);
  if (characters.length <= 64) return title;
  const cut = characters.slice(0, 64).join("");
  const space = cut.lastIndexOf(" ");
  return `${space > 40 ? cut.slice(0, space) : cut}…`;
}

/** Derived from the loaded conversation; no second list of conversation history. */
export function createConversationOutline(messages: readonly Message[]) {
  const entries: ConversationOutlineEntry[] = [];
  for (const message of messages) {
    entries.push({
      targetId: messageTargetId(message.id),
      messageId: message.id,
      title: outlineTitle(message),
      detail: message.role === "user" ? "Your message" : "Nova AI",
      kind: "message",
    });
    if (message.images?.length) {
      entries.push({
        targetId: photosTargetId(message.id),
        messageId: message.id,
        title: "Photos",
        detail: `${message.images.length} ${message.images.length === 1 ? "image" : "images"}`,
        kind: "photos",
      });
    }
  }
  return entries;
}
