# Nova design system

A fresh, self-contained system derived from the supplied Nova AI screenshot. The app's `/design-system` route is the interactive system reference; `/` is the full chat interface.

## Files and usage

- `tokens.css`: authoritative semantic CSS variables, imported at the application root.
- `tokens.ts`: token inventory and browser-side JSON export from computed CSS values.
- `examples.ts`: documentation-only history examples.
- `showcase.css`: documentation styles for `/design-system`.
- `../components/ui/`: individual Button, IconButton, Badge, Card, TextField, Toggle, Chip, Avatar and Icon modules, plus shared component styles in `styles.css`.
- `../components/chat/`: MessageComposer, UserProfileHeader, ConversationHistoryItem, ConversationHistoryPanel, PremiumPlanCard, ChatInterface, dialog, actions and loading components.
- `../components/branding/app-logo.tsx`: AppLogo, which reads the supplied asset from `../config/app-brand.ts`.
- `../components/design-system/`: DesignSystemShowcase and ConversationPreview, used only by the documentation page.

```tsx
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { MessageComposer } from "@/components/chat/message-composer";

<Button variant="primary" size="md">Upgrade now</Button>
<Button variant="secondary">New chat</Button>
<TextField label="Chat name" placeholder="A new idea" />
<MessageComposer onSend={(message, tool) => { /* connect to your application */ }} />
```

Import `design-system/tokens.css` and `components/ui/styles.css` directly from the application root layout, before the app global stylesheet. The `/design-system` page imports its own `showcase.css`. This lets Next.js resolve the files directly rather than passing local CSS imports through the Tailwind loader. Load Geist Sans and Geist Mono or override `--nova-font-sans` and `--nova-font-mono`. Product components do not require Tailwind or external component libraries.

## Reference interpretation

All values are estimates from a raster image, normalized into a coherent system. The screenshot does not identify its original font, exact colors, or hidden interaction states. Geist Sans is the selected close match. AppLogo uses the supplied master PNG named **Glossy Blue N Monogram App Icon**, stored unchanged at `public/brand/Glossy Blue N Monogram App Icon.png`. Every current Nova logo uses that shared asset, including the sidebar, identity specimen, assistant avatars, footer, and playground. App favicons and touch icons are size derivatives of the same PNG. Avatar supports photographs and initials; the profile header uses Emma's portrait extracted from the supplied reference. Success, warning, form validation, hover, focus, selected, and disabled states are extensions to make the system usable.

### Colors

| Role            | Token                   | Value     |
| --------------- | ----------------------- | --------- |
| Main canvas     | `--nova-bg-canvas`      | `#070A12` |
| Sidebar / panel | `--nova-bg-panel`       | `#101118` |
| Raised control  | `--nova-bg-raised`      | `#191A23` |
| Primary action  | `--nova-accent`         | `#3979ED` |
| Highlight       | `--nova-accent-light`   | `#83B3FF` |
| Main text       | `--nova-text-primary`   | `#F4F5F9` |
| Secondary text  | `--nova-text-secondary` | `#A1A3B2` |
| Muted text      | `--nova-text-muted`     | `#7B7E91` |
| Destructive     | `--nova-danger`         | `#FF7D8E` |

Keep supporting controls neutral. User messages retain `--nova-gradient-blue`; the logo's appearance comes directly from the supplied PNG. Primary buttons have their own measured material (`--nova-button-primary-fill`): a continuous blue gradient with a restrained inset top light, regular-weight pale text, and proportionally rounded corners. Subtle borders convey grouping, not essential text information.

### Primary blue button

The primary button can be tried in the Buttons section of `/design-system`.

```tsx
<Button variant="primary" size="xl">
  Upgrade Now
</Button>
```

At the supplied reference scale, the button is 296 × 80px with 28px corners, 24px regular text, and a 1px softly lit rim. `size="xl"` reproduces those dimensions. The 36 / 44 / 52px control sizes retain their existing layout sizes; primary corners and labels scale at 0.35× and 0.30× the control height. The primary-button tokens are isolated from the logo, composer, and chat gradients. The editable text uses local Geist Sans; raster compression and the unidentified source font may leave small pixel differences.

### Secondary dark button

The secondary button can be tried in the Buttons section of `/design-system`. The supplied New chat crop is reproduced with a 342 × 82px button, 28px corners, 24px regular text, a 36px icon box, and a 6px icon-to-label gap. The plus is a real vector icon and the label remains editable.

```tsx
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

<Button variant="secondary" size="xl">
  <Icon name="plus" />
  New chat
</Button>;
```

The neutral button has separate fill, border, and shadow tokens. Its face settles to `#171821`; depth comes from a narrow top light, vertical inner rims, and a soft perimeter. Smaller secondary sizes keep 36 / 44 / 52px heights, with the text, icon, gap, and radius scaled from the reference.

Mode chips use the same secondary fill, directional edge lighting, borders, and shadow through a shared CSS rule. This applies to Brainstorm, Web search, and Code in the composer and to the selection examples. Chips retain compact sizing, icon spacing, and radii. Selected chips add a blue tint and blue border over that material; they do not replace it with a flat background. Native switches and status badges remain separate controls with their own semantics.

### Date badge

`<Badge tone="date">Today</Badge>` is the standalone conversation date pill: a flat dark navy-teal face, full capsule shape, a narrow bright top rim, and pale regular text. The default is 80 × 40px with 14px type. `size="lg"` matches the supplied crop at 120 × 60px with 21px type; `size="sm"` is 64 × 32px. The label sits slightly above the geometric center to match the reference. Its material is isolated in `badge-date-*` tokens. It does not include a backdrop, stars, or divider. Other badge tones retain their existing styles.

The optional `.date-separator` wrapper adds a decorative divider around the date badge. Both lines touch the pill, brighten toward it, and fade to transparent at the outer edges. A separate five-pixel radial layer adds the restrained glow around the one-pixel highlight. The two materials are exported as `date-divider-line` and `date-divider-glow`. These styles live with the reusable components and do not add a scene background.

### Icon buttons

`IconButton` shares the approved button materials: `secondary` is the default dark surface, `primary` uses the blue gradient, and `ghost` is a bare supporting action. Sizes are `sm` (36px), `md` (44px), and `lg` (64px), with proportionally rounded corners. The surface examples are actual icon buttons; their mobile presentation scales to 49px. The composer send action uses the primary small icon button, and attachment uses ghost. Every icon button requires an accessible `label`; optional `active` adds `aria-pressed` and a blue selected treatment for secondary controls.

```tsx
<IconButton icon="plus" label="New chat" variant="secondary" />
<IconButton icon="send-solid" label="Send message" variant="primary" size="sm" />
<IconButton icon="paperclip" label="Attach a file" variant="ghost" />
```

`Icon` in `components/ui/icon.tsx` is the shared SVG implementation. The 24 interface symbols use a 24-unit grid, rounded 1.5-unit outlines, and transparent cutouts for filled shapes. `/design-system#icons` lists each actual icon with its component name; clicking an item copies its usage. `/icons` redirects to that section. Reference crops and comparison demos are removed. `IconTile` shares the primary and secondary materials used by `IconButton`. For interactive controls use `IconButton` with an accessible label. The supplied `NovaIcons.tsx` API delegates to these components; its logo entry uses the existing PNG rather than redrawing it.

### Typography

Geist Sans: 400, 500, 600. Geist Mono is only for technical documentation and token values.

| Role    | Size | Line height | Weight |
| ------- | ---- | ----------- | ------ |
| Display | 44px | 1.15        | 600    |
| Heading | 24px | 1.15        | 600    |
| Title   | 16px | 1.6         | 600    |
| Body    | 14px | 1.6         | 400    |
| Caption | 12px | 1.6         | 400    |

Documentation chrome uses smaller type than product controls. Long paragraphs should stay under 80 characters per line. The source screenshot's body text is approximately 14–15px.

### Spacing, shape, and size

Four-pixel grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px. Use 8px within controls, 12–16px between related items, 20–24px within panels, and 32–48px between groups.

Radii: 10px chips/small inputs, 14px buttons/icon buttons, 18px cards/composer, 24px outer panels, pill only for badges and switches. Controls: 36 / 44 / 52px. Icons: 16 / 20 / 24px, 24px viewBox, 1.5px rounded stroke. Mark radius scales to 29% of its size.

### Materials

- Canvas is the deepest layer, with a restrained navy glow at the top of conversation areas.
- Panel surfaces sit above canvas. Use a 9% white border and subtle inset light.
- Raised controls combine a top-to-bottom glass gradient, 1px highlighted top edge, 3px faint inset rim, and short shadow. Avoid broad blurred glass over text.
- Primary blue runs from ice blue through blue to deep cobalt with a small inset highlight.
- Focus uses a visible 2px ring with a 4px offset. Input groups highlight with `:focus-within`.

### Reference layout

At the 1395 × 906 reference size: 76px navigation rail + 244px conversations sidebar + flexible conversation area + 324px history panel. The center has approximately 22px outer padding and a maximum usable width near 704px.

For a future product implementation: below approximately 1200px, make history a toggleable drawer. Below 900px, move conversations into a drawer. Below 680px, use a compact header and a single conversation column, with the composer at the bottom. These responsive rules are inferred; the image only supplies a desktop view. The documentation shell has its own independent responsive layout.

### Behavior and accessibility

Buttons support hover, press, keyboard focus, disabled and selected states. Destructive actions include a textual label. Inputs require visible labels and linked error/hint text. IconButton requires `label`. Switches use native checkbox behavior with `role="switch"`. The example tablist supports arrows, Home, and End. Search and plan preview use native modal dialogs for focus trapping, Escape dismissal, and focus return. Reduced motion is respected.

MessageComposer sends on Enter and adds a newline on Shift+Enter. Composition input is respected. Empty or disabled submissions are blocked. Tool chips select a mode and can be deselected; More opens Write, Analyze, and Translate options, with Escape and outside-click dismissal. Attachment selection is local metadata only; no files are uploaded. The microphone uses browser SpeechRecognition when available, appends final transcripts, and reports unsupported or denied access. Voice processing is provided by the browser. ConversationPreview is explicitly a local demonstration, not an AI integration. Connect MessageComposer's `onSend` to your application for real behavior.

### Input composer reference

Try the live component in the Patterns section of `/design-system`. The default `size="md"` caps the geometry at the original UI's 704px scale: approximately 134px overall height, 38px chips, 15px input text and a 44px send button. The composer can fill a wider conversation column without enlarging its controls. Below that width it scales down to its legible minimum. At container widths up to 520px, mode chips scroll horizontally, More stays visible, and the input gets a full-width 16px row above attachment, microphone and send controls. Mobile touch targets are at least 44px. An optional `placeholder` prop supports shorter application copy. Attachment filenames truncate safely and keep the remove action visible.

The enlarged crop comparison explicitly uses `size="lg"`: at 1× it is 1118 × 212px with 36px corners, 22px inner padding, four 60px tool chips, a 34px row gap, 24px input text and a 70px send icon button. These enlarged dimensions are for reference inspection. The default cap reuses `--nova-layout-content`; all other geometry still comes from the same composer tokens.

The shell has its own gradient border and glow. The tools retain the approved secondary Chip material, and send retains the approved primary IconButton material with a filled vector icon. The empty send action remains visibly blue to match the crop, with native disabled semantics and blocked empty submission. The text area grows for multiline input without a manual resize handle. The comparison page provides an original-size canvas, adjustable overlay, and a separate responsive instance. The screenshot's surrounding blue bar and the comparison canvas are not part of the reusable composer.

## Export

Use **Export tokens** in the reference page to download `nova-design-tokens.json`. The export resolves variables from `tokens.css`, including gradients, shadows, font families, spacing, size, radius, layout, and motion. If adding a CSS token, add its name to `tokenGroups` in `tokens.ts` so it appears in the export. Keep reusable styles under the `nova-` prefix and documentation-only styles under `ds-` or within `showcase.css`.

### Profile and history sidebar

`UserProfileHeader` combines the reference portrait, name, plan and the approved secondary Gift Offer button. It accepts `name`, `plan`, `avatarSrc`, and `onGift`. `ConversationHistoryPanel` composes that header, the divider, History heading, a list of `ConversationHistoryItem` buttons, and Delete History. Supply `items`, `selectedId`, `onSelect`, `onClear`, `onRestore`, and `onGift` to connect local or application state. Empty history has a restore action in the showcase. The Gift Offer callback only shows a preview notification; billing is not connected.

The panel follows the original 324px sidebar proportions. At that width cards are 68px tall with 52px glass icon tiles, 10px vertical gaps, 18px corners, 16px titles and 15.5px descriptions. Geometry scales with its container, including the enlarged reference crop. Titles and descriptions truncate within the card; their complete text remains available to assistive technology. Icon tiles share the approved secondary material without nesting a button inside a button. The `history` token group exports geometry and surfaces. The portrait is stored at `public/avatars/emma-grace.png`; initials remain the generic Avatar fallback.

### Premium Plan card

`PremiumPlanCard` uses the approved primary Button and blue icon-tile material, with a filled crown, illuminated navy surface, two-line description and Upgrade Now action. The reference geometry is 342 × 332px: 22px padding, 34px corners, an 82px crown tile, 26px title, 24/36px description and 296 × 80px button. It scales with its container, producing approximately 216 × 210px at the original sidebar width. The `premium` token group exports the geometry, surface, border, shadow and text color. Pass `onUpgrade` to connect plan selection; the showcase opens its existing plan-preview dialog.
