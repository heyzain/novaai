# Frontend and seed API

This is an API-ready frontend demo, not a persistent chat service. There is intentionally no database, authentication, billing or AI integration.

## Responsibilities

| Location                           | Responsibility                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                             | Two application pages (`/`, `/design-system`), layout, metadata and thin HTTP handlers                                                      |
| `components/ui/`                   | One module per reusable control, generic icons, and shared component styles                                                                 |
| `components/chat/`                 | ChatInterface, MessageComposer, ConversationHistoryPanel, UserProfileHeader, PremiumPlanCard, actions, dialog, skeletons and request errors |
| `components/branding/app-logo.tsx` | Functionally named AppLogo, with identity supplied by `config/app-brand.ts`                                                                 |
| `components/design-system/`        | Documentation-only DesignSystemShowcase and ConversationPreview                                                                             |
| `chat/contracts.ts`                | Shared request and response types, independent of React                                                                                     |
| `chat/server/seed.ts`              | Server-only sample profile, conversations and image metadata                                                                                |
| `chat/server/seed-service.ts`      | Seed source and illustrative reply behavior; future backend connection point                                                                |
| `chat/server/http.ts`              | Consistent JSON envelopes, no-store headers, error mapping and optional demo latency                                                        |
| `chat/chat-api.ts`                 | Browser fetch boundary, response validation, cancellation and 15-second timeout                                                             |
| `chat/use-chat-data.ts`            | Data loading, cached conversation details, local edits, reply lifecycle and retries                                                         |
| `chat/use-adaptive-panels.ts`      | Responsive drawer state, focus management and viewport behavior                                                                             |
| `chat/chat.css`                    | Product layout, responsive panel and loading-state styles                                                                                   |
| `design-system/`                   | Visual tokens, documentation styles, example data and usage guide; no React components                                                      |
| `tests/`                           | Repeatable HTTP contract tests                                                                                                              |

Components use direct imports and functional filenames/exports rather than a brand-named component API or large primitive/pattern barrels. The existing `nova-` CSS/token namespace is retained to preserve the approved visual styling and avoid selector collisions; it is not the component API. Product UI imports no seed fixtures, and documentation examples remain independent of the live app.

Only the home and design system pages remain. The separate button/composer review routes, their links and their comparison-only assets have been removed. The full UI reference image remains part of the design-system documentation. API routes and framework metadata/404 behavior are unaffected.

## HTTP contract

| Method | Path                          | Response data                                                                    |
| ------ | ----------------------------- | -------------------------------------------------------------------------------- |
| GET    | `/api/chat`                   | Profile, conversation summaries, recent/history IDs and the initial conversation |
| GET    | `/api/chat/conversations/:id` | One complete seed conversation; 404 for missing IDs                              |
| POST   | `/api/chat/responses`         | One illustrative assistant message                                               |

Success is `{ data: ... }`. Errors are `{ error: { code, message } }`. Responses have `Cache-Control: no-store`. POST accepts `{ conversationId, prompt, tool, regenerate? }`; `tool` is a string or null, and `prompt` must contain 1–12,000 characters. The tool is metadata only; these endpoints do not run web searches, code, or AI tools.

Each successful seed request waits randomly 1, 2 or 3 seconds **on the server**. Initial data, uncached conversation changes, and assistant replies have skeleton states. Loaded conversation details are cached only for the current mounted tab to avoid unnecessary reloads. Loading failures show a retry action. A failed reply retains the user's message and retries without adding it twice. Switching conversations aborts outdated detail requests; pending replies stay associated with their original conversation.

Set `NOVA_DEMO_DELAY=false` in `.env.local` and restart the server to disable artificial latency. Remove this simulation when connecting real services; keep real loading/error handling.

## Persistence and migration

The API is stateless and its fixtures are read-only. New chats, edits, feedback, history deletion/Undo and settings belong to the current mounted tab and reset on refresh. No mutable global server store is used, so visitors do not share accidental edits. This is not CRUD persistence disguised as a production backend.

To connect a backend, replace the seed source behind the HTTP routes while keeping `contracts.ts` stable. If the external service has different shapes, translate them at that boundary. Persisted mutations should then be added to `chat-api.ts` and the operations in `use-chat-data.ts`; presentation components need not know the database or provider. Authentication/authorization would belong at the API boundary if later required.

## Verification and remaining limits

Run `npm run lint` and `npm run build`. With the app running, run `npm run test:api`; set `API_TEST_URL` to test another local preview. Contract tests cover payloads, invalid inputs, missing conversations, replies, regeneration and seed isolation. Browser QA also exercises mobile drawers, skeletons, error/retry states, quick navigation and reply ownership.

The frontend has a clearer data boundary and test coverage, but this does not certify deployment readiness. Remaining work for a shipped product depends on its scope: real persistence/integrations, deployment configuration, monitoring, and broader automated browser/accessibility coverage. Repository organization and a clean Git working tree are separate checks; inspect Git status at handoff rather than inferring it from a successful build.
