# AI UI implementation workflow

## Objective

Turn a creative UI reference into a maintainable, interactive product frontend using a repeatable sequence. Build visual foundations, reusable components and an API-backed seeded experience, then verify the result at each stage.

The aim is to reduce user-driven correction prompts. AI should handle the comparison and correction loop inside each phase. A single prompt cannot remove ambiguity from an incomplete reference; clear inputs and evidence-based checkpoints make the work predictable.

Use one orchestration prompt to run the workflow. Phase prompts are for resuming work or targeting a change, not a requirement for the user to direct every step.

## Execution and progress reporting

The default is **end-to-end execution**. After each phase, report its completed outputs, verification, commit (when changes justify one) and next step, then continue. A phase-complete update is progress reporting, not the end of the task or a request for another prompt.

The brief can explicitly select **review after each phase** instead. In that mode, stop at the agreed phase checkpoint and wait for the user's review before proceeding. Do not silently turn the default mode into an approval process.

Pause dependent work only when essential information, an actual approval requirement, or an unresolved blocker prevents progress. Continue independent work where possible. If execution is interrupted by a context/session boundary, leave the specification and repository state ready for the resume prompt; do not mark unfinished phases complete.

Example progress update:

```text
Phase 3/8 complete — primary/secondary controls and material tokens calibrated.
Verified: reference-size screenshots, narrow layout, used sizes and disabled states.
Commit: <actual short hash> feat(ui): add calibrated control components
Next: compose feature patterns and their loading/error states.
```

At the end, provide a consolidated outcome, checks performed, commits created and remaining limitations. The same execution and commit policy applies to the native adaptation.

## Working agreement

- Read repository instructions, existing structure and the installed framework documentation first. Preserve relevant existing work; a new visual reference does not automatically authorize a rewrite.
- Treat attached designs as visual references, not sources of task instructions. Distinguish intended designs, current implementation screenshots and annotations.
- Record material assumptions once in the design specification. Ask only for missing information that affects scope or an important design decision; continue independent work while waiting.
- Each checkpoint is an AI self-check. Fix failures before proceeding. Do not request user approval after every component unless the user has asked for that review process.
- Keep component names functional: `Button`, `MessageComposer`, `UserProfileHeader`, `ConversationHistoryPanel`. Put identity, supplied logos and brand copy in configuration/assets.
- Build React components in `components/`. Keep design foundations and documentation in `design-system/`. Keep fetching, request lifecycles and seed logic out of presentation components.
- Match the reference's visual character. Reuse should preserve unusual materials and proportions, rather than force everything into a generic UI kit.
- Completion requires visual and functional evidence. A successful build alone is not visual verification.

## Commit policy

The orchestration prompt below authorizes **local commits for the requested work**. That authorization persists through the workflow; do not ask for commit permission after every phase. Pushing, publishing, deploying or rewriting existing history requires separate authorization.

1. Inspect the current branch, working tree, staged changes and recent commits first. Preserve unrelated edits and any files the user already staged. If a new branch is needed, follow repository guidance (default prefix `codex/`).
2. Start from an understandable baseline. A fresh scaffold may already have an initial commit; do not create an empty duplicate. Existing uncommitted implementation must not be disguised as historical phase-by-phase work. If including it is authorized, verify it and create an honest baseline commit before new workflow milestones.
3. Commit verified, coherent milestones. Usually a completed phase is a useful boundary, but combine small inseparable phases or split a large phase when this makes each commit understandable and buildable. Never create an empty commit merely to match phase numbers.
4. Keep implementation, its meaningful tests and required configuration together. Commit documentation-only changes separately when they are independently useful. Resolve intermediate imports and dependencies before committing; avoid deliberately broken commits that only work after a later phase.
5. Run checks appropriate to the changed files before the commit. Documentation needs formatting/link checks; controls need relevant visual checks; data flows need contract/behavior checks; integrated app changes need the required build/lint checks. Record actual results, not anticipated ones.
6. Review the diff, stage explicit task-owned paths or hunks, and inspect the staged diff. Do not blindly stage unrelated changes, credentials, local environment files, caches or temporary QA output. Keep essential source assets and lockfile changes with their implementation.
7. Use a clear message: `type(scope): concrete change`. Explain the behavior and validation in the body when useful. Examples: `feat(ui): add calibrated buttons and inputs`, `feat(chat): load seeded conversations through the API`, `fix(chat): keep message menus inside the viewport`, `docs: document the UI delivery workflow`.
8. Inspect the commit result and remaining working tree. Report the actual short hash in the phase update. If later QA finds a defect, create a focused corrective commit; do not silently amend earlier commits or rewrite history.
9. Before handoff, ensure requested changes are committed and identify any deliberately remaining or unrelated edits. A clean working tree is a separate check from a passing build.

Do not claim a phase is committed when Git has rejected the commit. If author identity or another required setting is missing, request the missing information rather than inventing it.

## Inputs and durable outputs

Start with the [project brief](ui-project-brief.md): platform, reference files, required screens, interactions, assets, data behavior and scope exclusions.

Maintain three useful outputs rather than a large collection of planning files:

| Output                                                         | Purpose                                                                                                                            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `docs/design-spec.md`                                          | Reference interpretation, tokens/materials, component inventory, layer ownership, data states, adaptation policy and current phase |
| A single design system page or development-only native gallery | Actual reusable components in their sizes and states, built from the same code used by the product                                 |
| `docs/visual-qa.md`                                            | Tested screens and sizes, defects and corrections, verification evidence and remaining limits                                      |

Keep supplementary screenshots and temporary comparison tools in a QA/artifacts location. Additional application review routes should exist only when requested. In this project, the application pages remain `/` and `/design-system`.

## Phase 1 — Interpret the reference

**Produce a concrete specification before building the full screen.**

1. Identify the authoritative reference. Prefer original design frames or flat exports for measurements; use perspective mockups to understand the overall impression. Do not measure an angled laptop mockup as a flat screen.
2. Record the reference viewport and distinguish image scaling from actual UI sizes. Mark values as measured, estimated or intentionally adapted.
3. Inventory the distinctive materials: gradients, edge highlights, border continuity, shadows, corner shapes, typography, icon strokes and spacing rhythm.
4. Inventory functional components, including repeated variations. A dark button, mode chip and icon button may share a material while keeping different geometry and semantics.
5. Map layer ownership: page background, panel background, independent rail border, outer framing, scroll containers, sticky controls, overlays and modal layers.
6. List assets and fonts. Use supplied originals where available; do not silently replace a specific logo or photograph. Record a font approximation honestly.
7. Define intended behavior at narrow, medium and wide widths, including short-height screens. If only a desktop reference exists, identify mobile behavior as an implementation decision.

**Checkpoint:** The layout, visual signature, component families, assets and unresolved assumptions are understandable without rereading the conversation. There is a clear distinction between global scene styling and component styling.

## Phase 2 — Set ownership and data contracts

**Create the structure and state model before feature code spreads across the page.**

Choose a consistent structure appropriate to the existing framework. For a new web project, a feature might look like this; an existing repository need not move folders just to copy the example:

```text
app/                         Pages, layouts and thin API routes
components/
  ui/                        Button, IconButton, Badge, TextField, ...
  <feature>/                 Composed UI, screen presentation and skeletons
  branding/                  AppLogo and other identity presentation
  design-system/             Gallery and documentation presentation
features/<feature>/
  contracts.ts               Shared request/response and domain types
  api-client.ts              HTTP transport, validation and timeouts
  use-feature-data.ts        Data state and request lifecycle
  server/
    seed.ts                  Predictable server-only fixtures
    data-source.ts           Seed implementation; future integration point
design-system/               Token source, documentation and examples
config/                      Identity and environment configuration
lib/                         Small helpers with real shared use
docs/                        Specification, architecture and QA evidence
tests/                       Meaningful contract and behavior checks
```

Define the response shapes, identifiers, list/detail relationships, image metadata and operations the UI needs. Decide whether each mutation is persisted or intentionally local to the current session. Define loading, loaded, empty, error, retry and pending-operation states now.

Avoid speculative service/controller/repository chains. A thin HTTP route, a concrete data source, a client and a state owner are enough for many seeded frontends.

**Checkpoint:** Data responsibilities have one owner; presentation callbacks do not know seed fixtures or HTTP details. Contracts describe both the initial screen and later interactions. Persistence limitations are explicit.

## Phase 3 — Establish tokens and calibrate component families

**Validate a small representative slice before multiplying it across the application.**

Create semantic foundations for surfaces, text, borders, material fills, shadows, typography, spacing, radii and motion. Keep material-specific values when needed; a single generic shadow is unlikely to reproduce every surface.

Implement the highest-leverage controls first. For a UI like this project, that means:

- Primary button: fill, highlight, lower rim, radius and label position.
- Secondary family: text button, icon button and mode chip using the same material.
- A representative panel/card and its border treatment.

Compare them at the reference scale and at one narrow layout immediately. Check every size and state used by the product. Fix the shared source rather than adding unrelated overrides to each usage.

Token values may be refined during calibration. Do not declare the whole design system finished before its components have been rendered and compared.

**Checkpoint:** The reference's visual signature is present in real components. Related controls share their intended material; text and icons stay aligned; lower borders do not disappear into adjacent surfaces; touch areas remain usable when the visible controls are compact.

## Phase 4 — Compose patterns and their states

**Build reusable feature components with realistic content.**

Examples include a composer, a profile header, a history item/panel, a premium card and a message block. Each component should accept data and callbacks, with a small, clear API.

Show them on the single gallery page with:

- Normal, selected, disabled and pending states where relevant.
- Short and long text, multiline input and long filenames.
- Loading skeletons that reflect the component's geometry.
- Empty and recoverable error states.

Keep static visual components separate from request orchestration. Component examples can have their own documentation fixtures; product components must receive application data.

**Checkpoint:** Feature patterns work independently and at narrow widths. Composed controls use the same underlying components as the product. Loading/error states are designed, not added as an unrelated spinner at the end.

## Phase 5 — Connect the seeded API and state owner

**Make data travel through the same boundary a real service would use.**

Use the shared contracts from Phase 2. Server-only fixtures feed a concrete data source; thin endpoints expose it; the client validates responses; the feature state layer coordinates requests and local changes.

```text
Seed fixtures → data source → HTTP API → typed client → feature state → components
```

For this style of demo:

- Simulate a random **1, 2 or 3 second server response delay**. Make artificial latency configurable and removable. Keep the seed content predictable; random latency does not require random failures or inconsistent data.
- Exercise startup, detail loading and pending replies/mutations. Cache already-loaded details when appropriate; do not force a fresh delay on every local interaction.
- Include consistent success/error envelopes, input validation, request timeouts, cancellation and retry behavior.
- Prevent an older request from replacing a newer selection. Associate pending results with the operation's original entity.
- Preserve submitted content on failure. Retry must not create duplicate user messages or duplicate mutations.
- Keep shared seed data immutable. Do not turn a module-level mutable array into accidental cross-user persistence.
- Make error/empty scenarios repeatable through test fixtures or controlled mocks, rather than making the normal demo randomly fail.
- Document local-only mutations. When persistence is added later, implement it through the API client and state owner; keep presentation callbacks stable.

**Checkpoint:** Product screens import no fixtures. Changing a fixture changes the API payload the UI receives. Loading, errors, retries and rapid navigation work over actual HTTP. There is a clear place to replace the seeded service without rebuilding the presentation.

## Phase 6 — Assemble the screens and adaptation rules

**Compose validated components and define how the experience changes with available space.**

1. Build the primary reference layout from the existing components. Do not duplicate their styling in the page.
2. Specify full-width versus constrained layouts, panel adjacency, outer insets and any maximum width. A cap that works for one design is not a universal default.
3. Keep independently stationary and moving elements in separate layout/animation layers. For example, a desktop rail should not inherit a neighboring panel's slide transform.
4. On narrow screens, choose an explicit navigation model: drawers, tabs, sheets or another suitable pattern. Adapt navigation and density rather than scaling the whole desktop down.
5. Give each area a clear scrolling responsibility. Keep fixed/sticky controls readable over scrolled content. Place menus within usable bounds rather than inside a clipping ancestor.
6. Handle long content and short-height/keyboard layouts. Preserve comfortable hit areas even if visible labels/icons become smaller.
7. Make transitions interruptible. Respect reduced motion. Restore focus without unwanted scroll jumps and give overlays predictable dismissal.
8. For incoming content, follow the conversation when the user is already at its end; preserve their position when they are reading earlier content.

**Checkpoint:** The primary layout matches the reference, narrow layouts remain usable and the first responsive pass is already complete before final QA. Motion does not move unrelated elements or strand focus.

## Phase 7 — Run visual, interaction and regression QA

**Render, inspect, correct and verify.**

Use an explicit matrix rather than checking one desktop screenshot. Include the reference viewport, a small phone, a typical phone, tablet, normal desktop, wide desktop, landscape and sizes immediately around layout breakpoints. Add short-height and enlarged-text checks as appropriate.

At each relevant size, check:

| Area         | Evidence to inspect                                                                    |
| ------------ | -------------------------------------------------------------------------------------- |
| Geometry     | Insets, panel widths, alignment, spacing, full-width policy and unintended overflow    |
| Materials    | Border continuity, gradients, highlights, radius, typography and icon consistency      |
| Content      | Realistic seed text, very long text, images, empty lists and multiline drafts          |
| Async states | Skeleton geometry, loading completion, errors, retry and stale-request handling        |
| Overlays     | Menus near edges, modal/drawer bounds, backdrop timing and scroll containment          |
| Interaction  | Touch targets, keyboard focus, dismissal, focus return and navigation during requests  |
| Motion       | Opening/closing, interruption, stationary elements, reduced motion and content arrival |

Compare screenshots at the same viewport and scale. Pixel differences are a diagnostic aid; font rasterization, compression and an unknown source font can produce harmless differences. Prioritize layout, recognisable materials and functional defects over an arbitrary global similarity score.

Fix the largest deviations at their owner: token, component, feature layout or platform adapter. Recheck the affected states and one neighboring size. If the fix changes a shared control, inspect its other usages too.

Run meaningful functional/contract checks and the project's build/lint checks. Record what was actually tested and what was not. Browser emulation and sampled animation positions do not establish physical-device frame rate or native keyboard correctness.

**Checkpoint:** The visual matrix and critical flows have evidence; important defects are corrected; remaining differences and device-testing gaps are explicit. Passing compilation is only one part of this checkpoint.

## Phase 8 — Clean up and hand off

- Retain requested product pages and the single gallery. Remove temporary review routes, dead links, abandoned prototypes and assets used only by removed tooling.
- Check functional file/export names, direct imports, component ownership and separation of documentation/demo code.
- Document the API contract, token source, local-versus-persisted state, latency toggle and future integration points.
- Keep the specification and QA report current so another AI session can continue from the actual state.
- State verification results accurately. Distinguish organised source code from a clean Git working tree; use the authorized local commit policy and obtain separate authorization for publishing.

**Checkpoint:** A new contributor can find components, tokens, feature state and API code without relying on the conversation. The final report states completed work and practical limits.

## Applying the same process to React Native

The phases, contracts and visual reasoning carry over. Native presentation needs its own implementation and verification.

| Concern         | Shared or portable                                                                     | Platform-specific work                                                              |
| --------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Design language | Semantic colors, spacing intent, type roles, materials and component state definitions | Rendering gradients, shadows, blur, typography and dimensions on each target        |
| Data            | Domain contracts, predictable seed content and API response shapes                     | API base URL/configuration, image URI/asset resolution and request integration      |
| Logic           | Pure transforms, validation and platform-independent state logic                       | Browser focus/viewport hooks, native keyboard, gestures and navigation lifecycle    |
| Components      | Functional names and comparable prop/callback contracts                                | DOM/CSS implementation versus native view, text, pressable and input composition    |
| QA              | State scenarios, visual comparisons, long content and async races                      | Web viewport/browser checks versus iOS/Android simulator and physical-device checks |

For a new project targeting both platforms, choose a platform-neutral token source and generate/adapt web and native outputs. Do not hand-maintain two unrelated token sets. This repository currently uses CSS as its token source; creating a neutral source is a deliberate migration for the native phase, not something already completed here.

Native-specific checks:

- Implement native styles rather than copying CSS selectors. React Native uses the `style` prop and JavaScript style definitions. [React Native styling](https://reactnative.dev/docs/style).
- Run the seeded HTTP service outside the mobile app and configure an address reachable from the simulator/device. React Native can call HTTP services with Fetch; mobile screen code does not run Next.js API route files. [Networking](https://reactnative.dev/docs/network).
- Validate safe areas, text scaling, system bars, platform navigation/back behavior and input gestures.
- Check a real keyboard on iOS and Android. Keyboard layout behavior can differ between platforms; choose and test the appropriate configuration. [KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview).
- Choose native list rendering suitable for realistic data volumes; `FlatList` is available for flat lists. Verify scrolling, loading and item state with representative content. [FlatList](https://reactnative.dev/docs/flatlist).
- Compare reference materials on both targets and inspect motion in an appropriate device/release environment. A matching web screenshot does not validate native rendering.

Keep separate web/native component implementations when that makes behavior clearer. Promote contracts, tokens or pure logic into shared packages when there is real reuse; a monorepo and a universal component abstraction are not prerequisites for the first screen.

## Improvements learned from this project

| Repeated correction                                        | Move the decision/check earlier                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Secondary buttons, chips and icon buttons looked unrelated | Define material families and validate all their variants together in Phase 3                      |
| A page background was attached only to the center panel    | Record background and layer ownership in Phase 1                                                  |
| The rail moved with a collapsible panel                    | Define stationary versus animated layers before implementing layout motion                        |
| Composer and drawer density felt inconsistent              | Check representative composed components on a narrow screen in Phase 4                            |
| A workspace width cap introduced unwanted outer gaps       | Specify normal-width and extra-wide layout policy before screen assembly                          |
| API/loading behavior was added late                        | Define contracts and state scenarios in Phase 2; connect the service before final screen assembly |
| Components initially lived inside design documentation     | Establish functional component ownership and naming during Phase 2                                |
| Temporary comparison pages remained in the app             | Use one gallery and a separate artifact area from the start                                       |
| Menus clipped and long replies lost the user's position    | Include edge-position overlays and content-arrival behavior in the QA scenarios                   |

## Reusable orchestration prompt

Copy this into a new project after filling in the brief and attaching the references:

```text
Use docs/ai-ui-workflow.md to implement the creative UI described in the attached
references and the completed project brief.

Read repository instructions and relevant installed framework documentation first.
Inspect the current project before deciding what to reuse or replace.

Work through all eight phases. Maintain a compact design specification and phase
status. Do not ask me to prompt each phase separately. Treat checkpoints as your
own acceptance checks: render, compare, fix and verify before advancing.

Execution mode is end-to-end unless the brief explicitly selects phase-by-phase
review. After each phase, report its output, actual checks, commit hash and next
step, then continue automatically. Do not end the task after a progress update.

You are authorized to create local Git commits for this work. Follow the workflow's
commit policy: preserve unrelated changes, stage explicit paths/hunks, commit
verified coherent milestones with clear messages, and inspect the remaining status.
Do not push, publish, deploy or rewrite existing history without separate permission.

Preserve the visual signature of the authoritative reference. Identify its viewport,
asset sources, component families, background/layer ownership and adaptation rules.
Record estimates; do not claim an unidentified font or raster-derived value is exact.

Build functionally named React components under components/. Keep tokens and
documentation separate. Use a single design system gallery with actual product
components, including relevant sizes and states.

Define shared data contracts early. Serve predictable fixtures through a seeded HTTP
API with configurable random 1/2/3-second latency. Keep fixtures out of product UI.
Add skeleton, empty, error, retry and pending states, cancellation and race protection.
State clearly which mutations are local and which are persisted.

Assemble screens from these components. Validate narrow and short-height layouts,
stationary versus animated panels, overlay bounds, scrolling, focus, touch targets
and reduced motion. Run a documented visual matrix and meaningful functional checks.

Keep only the requested pages and gallery. Remove temporary review tooling from
application routes. Finish with an architecture note, QA evidence and an honest
summary of remaining limitations. Ask only when missing information prevents an
important decision or authorization is actually required.
```

### Resume prompt

```text
Read the project brief, docs/design-spec.md, architecture notes and latest QA report.
Identify the current phase and completed evidence. Continue from the actual state;
do not restart or reimplement validated components. Correct outstanding issues at
their owning layer, then complete the remaining workflow checkpoints. Inspect Git
status and recent commits, preserve existing history, follow the brief's execution
mode, and continue the already-authorized local milestone commits.
```

### React Native adaptation prompt

```text
Apply the same workflow to the native target described in the brief. Inspect the web
implementation for contracts, tokens, assets, states and intent. Identify what is
actually portable and what requires native implementation. Reuse stable contracts
and the seeded HTTP service; configure the device-accessible API and image sources.
Keep native components functionally named. Do not copy DOM/CSS or browser hooks.
Verify platform-specific materials, safe areas, text scaling, navigation, gestures,
keyboard, lists and motion on the declared iOS/Android targets. Report simulator
and physical-device coverage separately.
```
