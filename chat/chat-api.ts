import type {
  ChatBootstrap,
  Conversation,
  Message,
  ReplyRequest,
} from "./contracts";

type RecordValue = Record<string, unknown>;
const record = (value: unknown): value is RecordValue =>
  !!value && typeof value === "object";
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");
const summary = (value: unknown) =>
  record(value) &&
  typeof value.id === "string" &&
  typeof value.title === "string" &&
  typeof value.description === "string" &&
  (value.navigationTitle === undefined ||
    typeof value.navigationTitle === "string");
const message = (value: unknown): value is Message =>
  record(value) &&
  typeof value.id === "string" &&
  (value.role === "assistant" || value.role === "user") &&
  typeof value.text === "string" &&
  (value.outlineTitle === undefined ||
    typeof value.outlineTitle === "string") &&
  (value.images === undefined ||
    (Array.isArray(value.images) &&
      value.images.every(
        (image) =>
          record(image) &&
          typeof image.src === "string" &&
          typeof image.alt === "string",
      )));
const conversation = (value: unknown): value is Conversation =>
  summary(value) &&
  record(value) &&
  Array.isArray(value.messages) &&
  value.messages.every(message);
const bootstrap = (value: unknown): value is ChatBootstrap =>
  record(value) &&
  record(value.profile) &&
  typeof value.profile.name === "string" &&
  typeof value.profile.plan === "string" &&
  typeof value.profile.avatarSrc === "string" &&
  Array.isArray(value.conversations) &&
  value.conversations.every(summary) &&
  strings(value.recentIds) &&
  strings(value.historyIds) &&
  conversation(value.activeConversation) &&
  value.conversations.some(
    (item) =>
      record(item) && item.id === (value.activeConversation as Conversation).id,
  ) &&
  [...value.recentIds, ...value.historyIds].every((id) =>
    (value.conversations as RecordValue[]).some((item) => item.id === id),
  );

/** The only browser-to-server boundary. No fixtures or latency simulation live here. */
async function request<T>(
  path: string,
  valid: (value: unknown) => value is T,
  signal: AbortSignal,
  input?: ReplyRequest,
): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal.aborted) controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`/api/chat${path}`, {
      method: input ? "POST" : "GET",
      headers: input ? { "Content-Type": "application/json" } : undefined,
      body: input ? JSON.stringify(input) : undefined,
      cache: "no-store",
      signal: controller.signal,
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      throw new Error(
        record(payload) &&
          record(payload.error) &&
          typeof payload.error.message === "string"
          ? payload.error.message
          : "We couldn’t load that. Please try again.",
      );
    }
    if (!record(payload) || !valid(payload.data))
      throw new Error("We received an incomplete response. Please try again.");
    return payload.data;
  } catch (error) {
    if (signal.aborted) throw error;
    if (controller.signal.aborted)
      throw new Error("The request took too long. Please try again.");
    if (error instanceof SyntaxError)
      throw new Error("We received an incomplete response. Please try again.");
    if (error instanceof TypeError)
      throw new Error("Couldn’t connect. Check your connection and try again.");
    throw error;
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
  }
}

export const chatApi = {
  bootstrap: (signal: AbortSignal) => request("", bootstrap, signal),
  conversation: (id: string, signal: AbortSignal) =>
    request(`/conversations/${encodeURIComponent(id)}`, conversation, signal),
  reply: (input: ReplyRequest, signal: AbortSignal) =>
    request("/responses", message, signal, input),
};
