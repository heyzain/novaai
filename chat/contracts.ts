/** Shared HTTP contracts. Keep these independent of React and server implementations. */
export type ImageAsset = { src: string; alt: string };
export type Profile = { name: string; plan: string; avatarSrc: string };
export type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  outlineTitle?: string;
  images?: ImageAsset[];
  feedback?: "up" | "down" | null;
};
export type ConversationSummary = {
  id: string;
  title: string;
  description: string;
  navigationTitle?: string;
};
export type Conversation = ConversationSummary & { messages: Message[] };
export type ChatBootstrap = {
  profile: Profile;
  conversations: ConversationSummary[];
  recentIds: string[];
  historyIds: string[];
  activeConversation: Conversation;
};
export type ReplyRequest = {
  conversationId: string;
  prompt: string;
  tool: string | null;
  regenerate?: boolean;
};
export type ApiSuccess<T> = { data: T };
export type ApiFailure = { error: { code: string; message: string } };
