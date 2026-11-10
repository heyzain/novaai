# Creative UI project brief template

Copy this template to the project's `docs/design-spec.md`, fill in known inputs and let the AI expand it during Phase 1. Unknown fields should become visible assumptions or focused questions, rather than silent design changes.

## Intent and scope

- Product and primary user task:
- Platform: web / React Native / both:
- Existing project or fresh implementation:
- Existing code/assets that must be retained:
- Required pages/screens:
- Gallery location: `/design-system` on web, or a development-only native gallery:
- Explicitly excluded work, such as database, authentication, billing or live AI:
- What counts as a successful result:
- Execution mode: end-to-end with phase updates (default) / review after each phase:
- Local milestone commits: authorized by the orchestration prompt; record any exceptions:
- Existing branch, unrelated/staged changes to preserve, or commit naming requirements:
- Remote push/publish/deploy: not authorized unless explicitly specified:

## References and assets

| Input                                   | Location | Role / authority                                  |
| --------------------------------------- | -------- | ------------------------------------------------- |
| Original design file or flat screenshot |          | Primary visual reference                          |
| Perspective mockup                      |          | Overall appearance; not a flat measurement source |
| Current implementation screenshot       |          | Comparison only                                   |
| Supplied logo/icons/photos              |          | Reuse requirements                                |
| Fonts or typography guidance            |          | Exact supplied font or recorded approximation     |

- Reference viewport and image scale:
- Reference areas requiring the closest reproduction:
- Minor differences that are acceptable:
- Missing assets and allowed substitutions:

## Visual specification

- Visual signature / distinctive materials:
- Surface and text roles:
- Typography roles:
- Spacing, radii and border treatments:
- Primary and secondary control families:
- Component inventory with functional names:
- Token source of truth and platform outputs:

| Layer            | Background/border owner | Scroll owner | Stationary or animated |
| ---------------- | ----------------------- | ------------ | ---------------------- |
| Page/screen      |                         |              |                        |
| Navigation       |                         |              |                        |
| Main content     |                         |              |                        |
| Auxiliary panels |                         |              |                        |
| Composer/form    |                         |              |                        |
| Menus/modals     |                         |              |                        |

## Data and state

- Entities and identifiers:
- Initial payload and list/detail payloads:
- User operations and expected results:
- Persisted versus session-local mutations:
- Seed/API location and base URL:
- Default demo latency: random 1, 2 or 3 seconds at the server:
- How to disable latency:
- Deterministic empty/error fixtures or controlled test scenarios:
- Skeleton, empty, error, retry and pending states:
- Cancellation, rapid-selection and duplicate-submission rules:

## Adaptation and interaction

- Narrow-screen navigation model:
- Medium-screen panel behavior:
- Desktop and extra-wide width policy:
- Short-height / landscape / keyboard behavior:
- Touch target and density policy:
- Long text, filenames, images and multiline input behavior:
- Menu edge placement and dismissal:
- Focus, back navigation and scroll restoration:
- Motion, interruption and reduced-motion behavior:
- Incoming content / follow-to-end behavior:

## Native extension, when applicable

- Target iOS/Android versions and device classes:
- Existing navigation/runtime choice:
- Portable contracts, tokens and pure logic:
- Native-specific components and material rendering:
- Device-reachable API address and image asset strategy:
- Safe area, system bars, text scaling, keyboard, lists and gestures:
- Simulator and physical-device verification available:

## Verification and handoff

- Reference comparison viewport:
- Responsive/device matrix and breakpoint boundary checks:
- Critical functional and error/retry flows:
- Required build/lint/test commands:
- Visual evidence location:
- Remaining assumptions or testing limits:
- Required final application routes/screens:

## Phase status

| Phase                             | Status  | Evidence / outstanding issue |
| --------------------------------- | ------- | ---------------------------- |
| 1. Reference interpretation       | Pending |                              |
| 2. Ownership and contracts        | Pending |                              |
| 3. Tokens and calibrated controls | Pending |                              |
| 4. Composed patterns and states   | Pending |                              |
| 5. Seed API and state owner       | Pending |                              |
| 6. Screens and adaptation         | Pending |                              |
| 7. Visual and functional QA       | Pending |                              |
| 8. Cleanup and handoff            | Pending |                              |

Mark a phase complete only when its checkpoint has evidence. A technical checkpoint does not imply a new user-approval step.

In the default execution mode, report each phase's output, checks and actual commit hash, then continue. In review mode, wait at the agreed checkpoints. Keep commits coherent and buildable rather than making empty or artificial phase commits.
