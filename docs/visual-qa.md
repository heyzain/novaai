# Responsive visual QA

Reviewed the home and design system pages in headless Chromium using screenshots, DOM measurements, touch emulation, keyboard interaction and sampled animation positions.

## Coverage

Home viewport sizes: 320×568, 360×740, 390×844, 430×932, 568×320, 768×1024, 820×1180, 1100×800, 1110×800, 1250×800, 1280×720, 1395×906, 1920×1080 and 2560×1350.

Design system sizes: 320×568, 390×844, 568×320, 768×1024, 1110×800, 1395×906 and 1920×1080. Additional multiline-draft checks used 390×320, 568×320 and 844×390 to simulate short landscape or keyboard-height viewports.

No page-level horizontal overflow or browser exceptions were found in the viewport capture pass. Photos and mode rows retain intentional internal horizontal scrolling on narrow screens. The approved normal desktop layout and component materials remain intact.

## Corrected findings

| Finding                                                                           | Correction                                                                                                                                                     |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Message menus were clipped by the conversation scroller near its bottom edge      | `components/chat/message-actions.tsx` positions the menu within viewport bounds, preferring space above when necessary; scrolling or resizing dismisses it     |
| Long replies appeared below the visible area even when following the conversation | `components/chat/chat-interface.tsx` follows completed replies when already at the bottom, while preserving position when reading earlier messages             |
| Scrolled messages overlapped the compact navigation header                        | `chat/chat.css` adds a restrained background behind visible header controls                                                                                    |
| The composer used too much vertical space on short screens                        | Short-height layouts put text and actions on the same row with smaller spacing, preserving multiline input and touch targets                                   |
| The send action fell below 44px at intermediate touch widths                      | `components/ui/styles.css` enforces a 44px minimum for coarse pointers; short-screen product styles do the same                                                |
| Documentation navigation controls were only 26–31px tall                          | Mobile menu, return-to-chat, export and close controls now have 44px targets; mobile form text is 16px                                                         |
| Documentation drawer allowed focus behind it and background scrolling             | `components/design-system/use-navigation-drawer.ts` adds focus trapping, inert background, scroll lock, Escape/close, focus restoration and breakpoint cleanup |
| Documentation backdrop disappeared abruptly during drawer close                   | Its opacity and visibility now transition with the drawer                                                                                                      |
| Focus outlines on documentation links were clipped by their scroll container      | Navigation focus rings now draw inside their controls                                                                                                          |
| Native controls could inherit a light browser theme                               | The app declares a dark color scheme; dialogs contain their own overscroll                                                                                     |

## Interaction checks

- Every message-menu item remains hit-testable; Escape restores focus to its trigger.
- Long replies follow to the end; scrolling up during a pending reply preserves reading position.
- Documentation Tab/Shift+Tab stays inside the open drawer. Search handoff, Escape, close, body-scroll restoration and desktop/mobile breakpoint changes recover correctly.
- Short-screen multiline drafts fit the visible area and retain 44px action targets.
- Desktop collapse and expand keep the action rail stationary with no horizontal scroll offset.
- Mobile panel transitions tolerate reversal mid-animation. Reduced-motion settings remove sliding.
- Drawer positions are sampled during opening and closing to check for snapping or direction reversals.
- Seed loading, errors/retry, rapid conversation changes and mobile message actions are rechecked after the changes.

Build and lint are also run after the corrections. Guideline reference: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Limits

These are Chromium browser-emulation checks, not a frame-rate guarantee on physical devices. Native iOS Safari/Android keyboard behavior, actual notched-device safe areas, screen-reader announcements and low-powered-device animation performance still need device testing. Keyboard-height checks resize the viewport rather than opening a real phone keyboard.
