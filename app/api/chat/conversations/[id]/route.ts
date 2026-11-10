import { chatSource } from "@/chat/server/seed-service";
import { apiData, apiError, demoRequest } from "@/chat/server/http";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return demoRequest(request, () => {
    const conversation = chatSource.conversation(id);
    return conversation
      ? apiData(conversation)
      : apiError("NOT_FOUND", "This conversation could not be found.", 404);
  });
}
