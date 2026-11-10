import type { ReplyRequest } from "@/chat/contracts";
import { chatSource } from "@/chat/server/seed-service";
import { apiData, apiError, demoRequest } from "@/chat/server/http";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_REQUEST", "Send a valid JSON request.", 400);
  }
  if (!body || typeof body !== "object")
    return apiError("INVALID_REQUEST", "A message is required.", 400);
  const input = body as Record<string, unknown>;
  if (
    typeof input.conversationId !== "string" ||
    !input.conversationId.trim() ||
    input.conversationId.length > 200 ||
    typeof input.prompt !== "string" ||
    !input.prompt.trim() ||
    input.prompt.length > 12000 ||
    !(
      input.tool === null ||
      (typeof input.tool === "string" && input.tool.length <= 40)
    ) ||
    !(input.regenerate === undefined || typeof input.regenerate === "boolean")
  ) {
    return apiError(
      "INVALID_REQUEST",
      "Include a conversation and a message of 1–12,000 characters.",
      400,
    );
  }
  return demoRequest(request, () =>
    apiData(chatSource.reply(input as ReplyRequest), 201),
  );
}
