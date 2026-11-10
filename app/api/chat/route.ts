import { chatSource } from "@/chat/server/seed-service";
import { apiData, demoRequest } from "@/chat/server/http";

export function GET(request: Request) {
  return demoRequest(request, () => apiData(chatSource.bootstrap()));
}
