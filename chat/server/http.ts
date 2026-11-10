import "server-only";
import { setTimeout } from "node:timers/promises";
import { connection } from "next/server";
import type { ApiFailure, ApiSuccess } from "../contracts";

export function apiData<T>(data: T, status = 200) {
  return Response.json({ data } satisfies ApiSuccess<T>, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export function apiError(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } } satisfies ApiFailure, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/** Demo latency belongs to the seed API, never to presentation components. */
export async function demoRequest(
  request: Request,
  respond: () => Response | Promise<Response>,
) {
  await connection();
  try {
    if (process.env.NOVA_DEMO_DELAY !== "false") {
      await setTimeout((1 + Math.floor(Math.random() * 3)) * 1000, undefined, {
        signal: request.signal,
      });
    }
    return await respond();
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    console.error("Chat API request failed", error);
    return apiError(
      "INTERNAL_ERROR",
      "We couldn’t load that. Please try again.",
      500,
    );
  }
}
