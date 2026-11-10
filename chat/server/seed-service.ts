import "server-only";
import { randomUUID } from "node:crypto";
import type {
  ChatBootstrap,
  Conversation,
  Message,
  ReplyRequest,
} from "../contracts";
import {
  conversations,
  historyIds,
  mountainReply,
  profile,
  recentIds,
} from "./seed";

/** Replace this data source when connecting a backend; HTTP contracts and UI stay stable. */
export const chatSource = {
  bootstrap(): ChatBootstrap {
    return structuredClone({
      profile,
      conversations: conversations.map(
        ({ id, title, description, navigationTitle }) => ({
          id,
          title,
          description,
          navigationTitle,
        }),
      ),
      recentIds,
      historyIds,
      activeConversation: conversations[0],
    });
  },
  conversation(id: string): Conversation | undefined {
    const conversation = conversations.find((item) => item.id === id);
    return conversation ? structuredClone(conversation) : undefined;
  },
  reply(input: ReplyRequest): Message {
    const text = input.regenerate
      ? input.conversationId === "mountains"
        ? "Of course! A peaceful lakeside stay or a scenic hiking trip could be a lovely mountain escape. Share your preferred dates and activity level so we can narrow it down."
        : "Let’s try a different angle. What matters most to you, and what would a successful outcome look like?"
      : /mountain|hiking|lake|tour/i.test(input.prompt)
        ? mountainReply
        : "Let’s explore that together. What would you like to focus on first?";
    return { id: randomUUID(), role: "assistant", text };
  },
};
