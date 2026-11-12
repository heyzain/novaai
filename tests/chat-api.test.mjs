import assert from "node:assert/strict";
import { test } from "node:test";

// Run against `npm run dev` or `npm start`. No browser/test dependencies required.
const base = process.env.API_TEST_URL ?? "http://127.0.0.1:3000";
async function request(path, init) {
  const response = await fetch(`${base}/api/chat${path}`, {
    ...init,
    signal: AbortSignal.timeout(20000),
  });
  return { response, body: await response.json() };
}
const post = (input) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});

test("bootstrap supplies a consistent profile, lists and initial conversation", async () => {
  const {
    response,
    body: { data },
  } = await request("");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(data.profile.name, "Emma Grace");
  const ids = new Set(data.conversations.map((item) => item.id));
  assert.equal(ids.size, data.conversations.length);
  assert.ok([...data.historyIds, ...data.recentIds].every((id) => ids.has(id)));
  assert.deepEqual(new Set(data.historyIds), ids);
  assert.ok(ids.has(data.activeConversation.id));
  assert.equal(data.activeConversation.messages[0].images.length, 3);
  assert.ok(
    data.activeConversation.messages.every(
      (message) =>
        typeof message.outlineTitle === "string" &&
        message.outlineTitle.length > 0,
    ),
  );
  assert.ok(data.conversations.every((item) => !("messages" in item)));
});

test("conversation details are fetched separately; missing IDs return a typed 404", async () => {
  const [found, missing] = await Promise.all([
    request("/conversations/query"),
    request("/conversations/missing"),
  ]);
  assert.equal(found.response.status, 200);
  assert.equal(found.body.data.id, "query");
  assert.ok(found.body.data.messages.length > 0);
  assert.equal(missing.response.status, 404);
  assert.equal(missing.body.error.code, "NOT_FOUND");
});

test("invalid JSON and message bodies return 400 instead of executing replies", async () => {
  const invalid = [
    null,
    {},
    { conversationId: "mountains", prompt: "   ", tool: null },
    { conversationId: "mountains", prompt: "x".repeat(12001), tool: null },
    { conversationId: "mountains", prompt: "Hello", tool: 42 },
    {
      conversationId: "mountains",
      prompt: "Hello",
      tool: null,
      regenerate: "yes",
    },
  ];
  const results = await Promise.all(
    invalid.map((body) => request("/responses", post(body))),
  );
  results.push(
    await request("/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }),
  );
  for (const { response, body } of results) {
    assert.equal(response.status, 400);
    assert.equal(body.error.code, "INVALID_REQUEST");
  }
});

test("reply and regeneration work for seed and new tab-local conversations", async () => {
  const [reply, regenerated] = await Promise.all([
    request(
      "/responses",
      post({
        conversationId: "new-local-chat",
        prompt: "Suggest a mountain tour",
        tool: "search",
      }),
    ),
    request(
      "/responses",
      post({
        conversationId: "mountains",
        prompt: "Try another approach",
        tool: null,
        regenerate: true,
      }),
    ),
  ]);
  for (const result of [reply, regenerated]) {
    assert.equal(result.response.status, 201);
    assert.equal(result.body.data.role, "assistant");
    assert.ok(result.body.data.id);
    assert.ok(result.body.data.text);
  }
  assert.notEqual(reply.body.data.id, regenerated.body.data.id);
  assert.notEqual(reply.body.data.text, regenerated.body.data.text);
  const {
    body: { data },
  } = await request("");
  assert.equal(data.activeConversation.messages.length, 3);
  assert.ok(!data.conversations.some((item) => item.id === "new-local-chat"));
});
