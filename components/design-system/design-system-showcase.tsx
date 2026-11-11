"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { TextField } from "@/components/ui/text-field";
import { Toggle } from "@/components/ui/toggle";
import { Toast } from "@/components/ui/toast";
import { Icon, type IconName } from "@/components/ui/icon";
import { interfaceIconNames } from "@/components/ui/icon-catalog";
import { AppLogo } from "@/components/branding/app-logo";
import { ConversationHistoryPanel } from "@/components/chat/conversation-history-panel";
import { PremiumPlanCard } from "@/components/chat/premium-plan-card";
import { ConversationPreview } from "./conversation-preview";
import { useNavigationDrawer } from "./use-navigation-drawer";
import { historyExamples } from "@/design-system/examples";
import { palette, readTokens, tokenGroups } from "@/design-system/tokens";

const sections: {
  id: string;
  name: string;
  icon: IconName;
  group: string;
  description: string;
}[] = [
  {
    id: "overview",
    name: "Overview",
    icon: "grid",
    group: "Start here",
    description: "The visual language of Nova",
  },
  {
    id: "colors",
    name: "Color palette",
    icon: "palette",
    group: "Foundations",
    description: "Semantic colors and accents",
  },
  {
    id: "typography",
    name: "Typography",
    icon: "type",
    group: "Foundations",
    description: "Type scale, weights, and rhythm",
  },
  {
    id: "surfaces",
    name: "Surfaces & effects",
    icon: "layers",
    group: "Foundations",
    description: "Glass, elevation, and light",
  },
  {
    id: "spacing",
    name: "Spacing & radius",
    icon: "spacing",
    group: "Foundations",
    description: "A four-pixel spacing system",
  },
  {
    id: "components",
    name: "Components",
    icon: "square",
    group: "Build with Nova",
    description: "Buttons, inputs, and controls",
  },
  {
    id: "icons",
    name: "Iconography",
    icon: "sun",
    group: "Build with Nova",
    description: "Consistent rounded line icons",
  },
  {
    id: "patterns",
    name: "Patterns",
    icon: "chat",
    group: "Build with Nova",
    description: "Chat, history, and premium cards",
  },
  {
    id: "usage",
    name: "Getting started",
    icon: "book",
    group: "Resources",
    description: "Usage, accessibility, and layout",
  },
];
const tokenCount = Object.values(tokenGroups).reduce(
  (count, group) => count + group.length,
  0,
);
const codeExample = `import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { MessageComposer } from "@/components/chat/message-composer";

<Button variant="primary">Upgrade now</Button>
<TextField label="Chat name" placeholder="A new idea" />
<MessageComposer onSend={(message, tool) => console.log(message, tool)} />`;

function SectionHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}

function ButtonWorkbench({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState("Variants");
  const tabs = ["Variants", "Sizes", "States"];
  return (
    <Card className="button-workbench">
      <div className="specimen-heading">
        <span>
          <Icon name="square" size={16} />
          Buttons
        </span>
      </div>
      <div
        className="specimen-tabs"
        role="tablist"
        aria-label="Button examples"
      >
        {tabs.map((item, index) => (
          <button
            key={item}
            type="button"
            role="tab"
            id={`button-tab-${index}`}
            aria-selected={tab === item}
            aria-controls="button-examples"
            tabIndex={tab === item ? 0 : -1}
            onClick={() => setTab(item)}
            onKeyDown={(event) => {
              if (
                ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? tabs.length - 1
                      : (index +
                          (event.key === "ArrowRight" ? 1 : -1) +
                          tabs.length) %
                        tabs.length;
                setTab(tabs[next]);
                document.getElementById(`button-tab-${next}`)?.focus();
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        className="button-examples"
        id="button-examples"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`button-tab-${tabs.indexOf(tab)}`}
      >
        {tab === "Variants" ? (
          <>
            <div>
              <Button
                variant="primary"
                onClick={() => notify("Primary action selected")}
              >
                Upgrade Now
              </Button>
              <span>Primary</span>
            </div>
            <div>
              <Button onClick={() => notify("Secondary action selected")}>
                <Icon name="plus" size={17} />
                New chat
              </Button>
              <span>Secondary</span>
            </div>
            <div>
              <Button
                variant="ghost"
                onClick={() => notify("Ghost action selected")}
              >
                Learn more
                <Icon name="arrow" size={15} />
              </Button>
              <span>Ghost</span>
            </div>
            <div>
              <Button
                variant="danger"
                onClick={() =>
                  notify("Destructive variant preview — nothing deleted")
                }
              >
                <Icon name="trash" size={16} />
                Delete
              </Button>
              <span>Destructive</span>
            </div>
          </>
        ) : tab === "Sizes" ? (
          <>
            {(["sm", "md", "lg"] as const).map((size, index) => (
              <div key={size}>
                <Button
                  size={size}
                  onClick={() =>
                    notify(
                      `${["Small", "Medium", "Large"][index]} button selected`,
                    )
                  }
                >
                  New chat
                </Button>
                <span>
                  {["36px · Small", "44px · Medium", "52px · Large"][index]}
                </span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div>
              <Button onClick={() => notify("Default state selected")}>
                Default
              </Button>
              <span>Resting</span>
            </div>
            <div>
              <Button
                className="preview-hover"
                onClick={() => notify("Hover state selected")}
              >
                Hover
              </Button>
              <span>Highlighted edge</span>
            </div>
            <div>
              <Button
                className="preview-focus"
                onClick={() => notify("Focus state selected")}
              >
                Focused
              </Button>
              <span>Visible focus ring</span>
            </div>
            <div>
              <Button disabled>Unavailable</Button>
              <span>Disabled</span>
            </div>
          </>
        )}
      </div>
      <div className="specimen-footer">
        <span>
          <span className="tiny-dot" />
          Live component · Try it out
        </span>
        <code>
          {tab === "Variants"
            ? 'variant="primary"'
            : tab === "Sizes"
              ? 'size="md"'
              : "Native interaction states"}
        </code>
      </div>
    </Card>
  );
}

export function DesignSystemShowcase() {
  const [active, setActive] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const closeNavigation = useCallback(() => setMobileNav(false), []);
  const {
    compact: compactNavigation,
    isOpen: navigationOpen,
    drawerRef: navigationRef,
    triggerRef: navigationTriggerRef,
  } = useNavigationDrawer(mobileNav, closeNavigation);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [saveHistory, setSaveHistory] = useState(true);
  const [webSearch, setWebSearch] = useState(false);
  const [selectedTool, setSelectedTool] = useState("Brainstorm");
  const [chatName, setChatName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [historyVisible, setHistoryVisible] = useState(true);
  const searchRef = useRef<HTMLDialogElement>(null);
  const upgradeRef = useRef<HTMLDialogElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }
  function goTo(id: string) {
    setActive(id);
    setMobileNav(false);
    searchRef.current?.close();
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    window.history.replaceState(null, "", `#${id}`);
  }
  function openSearch() {
    closeNavigation();
    setQuery("");
    requestAnimationFrame(() => {
      searchRef.current?.showModal();
      searchRef.current?.querySelector("input")?.focus({ preventScroll: true });
    });
  }
  async function copy(value: string, success = "Copied to clipboard") {
    try {
      await navigator.clipboard.writeText(value);
      notify(success);
    } catch {
      notify("Clipboard unavailable. Select and copy the visible value.");
    }
  }
  function exportTokens() {
    const data = {
      name: "Nova",
      version: "1.0.0",
      description:
        "Image-derived design tokens. tokens.css is the source of truth.",
      tokens: readTokens(),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "nova-design-tokens.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`${tokenCount} design tokens exported`);
  }
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.showModal();
      }
      if (event.key === "Escape") setMobileNav(false);
    }
    document.addEventListener("keydown", handleKey);
    let frame = 0;
    const elements = sections.map((section) =>
      document.getElementById(section.id),
    );
    function updateSection() {
      frame = 0;
      // Measure all sections, including ones already in view during a large jump.
      const activationLine = Math.min(380, window.innerHeight * 0.35);
      let current = sections[0].id;
      for (const element of elements) {
        if (element && element.getBoundingClientRect().top <= activationLine) {
          current = element.id;
        }
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    }
    function queueSectionUpdate() {
      if (!frame) frame = requestAnimationFrame(updateSection);
    }
    window.addEventListener("scroll", queueSectionUpdate, { passive: true });
    window.addEventListener("resize", queueSectionUpdate);
    queueSectionUpdate();
    return () => {
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", queueSectionUpdate);
      window.removeEventListener("resize", queueSectionUpdate);
      cancelAnimationFrame(frame);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);
  const searchResults = sections.filter((item) =>
    `${item.name} ${item.description}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const emailError =
    emailTouched && email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Enter a valid email address."
      : undefined;

  return (
    <div className="ds-app">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <button
        type="button"
        className={`nav-backdrop ${navigationOpen ? "is-open" : ""}`}
        aria-label="Close navigation"
        aria-hidden="true"
        tabIndex={-1}
        inert={!navigationOpen}
        onClick={closeNavigation}
      />
      <aside
        ref={navigationRef}
        className={`ds-sidebar ${navigationOpen ? "is-open" : ""}`}
        id="system-navigation"
        aria-label="Design system navigation"
        role={compactNavigation ? "dialog" : undefined}
        aria-modal={navigationOpen || undefined}
        aria-hidden={compactNavigation ? !navigationOpen : undefined}
        inert={compactNavigation && !navigationOpen}
      >
        <IconButton
          className="ds-nav-close"
          variant="ghost"
          icon="close"
          label="Close navigation"
          onClick={closeNavigation}
        />
        <a
          className="ds-brand"
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            goTo("overview");
          }}
        >
          <AppLogo size={39} />
          <span>
            Nova<span>Design system</span>
          </span>
          <span className="brand-version">1.0</span>
        </a>
        <button className="sidebar-search" type="button" onClick={openSearch}>
          <Icon name="search" size={16} />
          <span>Quick search</span>
          <kbd>Ctrl K</kbd>
        </button>
        <nav>
          {["Start here", "Foundations", "Build with Nova", "Resources"].map(
            (group) => (
              <div className="nav-group" key={group}>
                <span className="nav-group-title">{group}</span>
                {sections
                  .filter((section) => section.group === group)
                  .map((section) => (
                    <a
                      href={`#${section.id}`}
                      key={section.id}
                      className={`nav-item ${active === section.id ? "is-active" : ""}`}
                      aria-current={
                        active === section.id ? "location" : undefined
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(section.id);
                      }}
                    >
                      <Icon name={section.icon} size={17} />
                      <span>{section.name}</span>
                      {section.id === "components" ? (
                        <span className="nav-count">9</span>
                      ) : null}
                    </a>
                  ))}
              </div>
            ),
          )}
        </nav>
        <div className="sidebar-bottom">
          <span className="sidebar-mini-mark">
            <AppLogo size={26} />
          </span>
          <div>
            Made for Nova AI<span>From reference to system</span>
          </div>
          <span className="sidebar-online" title="Version 1.0 available" />
        </div>
      </aside>

      <div className="ds-body" inert={navigationOpen}>
        <header className="ds-topbar">
          <div className="breadcrumb">
            <button
              ref={navigationTriggerRef}
              className="mobile-menu"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={navigationOpen}
              aria-controls="system-navigation"
              onClick={() => setMobileNav(!mobileNav)}
            >
              <Icon name={mobileNav ? "close" : "menu"} />
            </button>
            <span>Design system</span>
            <Icon name="chevron" size={13} />
            <strong
              title={sections.find((section) => section.id === active)?.name}
            >
              {sections.find((section) => section.id === active)?.name}
            </strong>
          </div>
          <div className="topbar-actions">
            <Link className="ds-open-chat" href="/" aria-label="Open chat">
              <Icon name="chat" size={15} />
              Open Nova
            </Link>
            <span className="dark-mode-label">
              <span />
              Dark by design
            </span>
            <Button size="sm" onClick={exportTokens}>
              <Icon name="download" size={14} />
              Export tokens
            </Button>
          </div>
        </header>

        <main id="main-content" className="ds-main">
          <section id="overview" className="overview-section">
            <div className="page-heading">
              <div className="page-heading-meta">
                <Badge tone="blue">Nova v1.0</Badge>
                <span>A visual language for thoughtful AI</span>
              </div>
              <h1>Every detail. One system.</h1>
              <p>
                The building blocks behind Nova. Deep surfaces, soft light, and
                a little blue.
                <br className="desktop-break" />A cohesive foundation for
                everything we create.
              </p>
            </div>

            <div className="identity-specimen">
              <div className="identity-grid" aria-hidden="true" />
              <div className="identity-copy">
                <div className="identity-wordmark">
                  <AppLogo size={64} />
                  <span>Nova AI</span>
                </div>
                <p>
                  A little clarity.
                  <br />A world of possibilities.
                </p>
                <span className="identity-caption">
                  Calm by nature. Intelligent by design.
                </span>
              </div>
              <div className="identity-preview" aria-hidden="true">
                <div className="mini-window-bar">
                  <span />
                  <span />
                  <span />
                  <span className="mini-window-name">
                    A space for your next idea
                  </span>
                </div>
                <div className="mini-chat">
                  <div className="mini-ai">
                    <AppLogo size={27} />
                    <div>
                      <strong>Nova AI</strong>
                      <p>
                        Big ideas start with a simple question.
                        <br />
                        What’s on your mind?
                      </p>
                    </div>
                  </div>
                  <div className="mini-bubble">Let’s make something great.</div>
                  <div className="mini-composer">
                    <span>Ask me something…</span>
                    <span className="mini-send">
                      <Icon name="send-solid" size={14} />
                    </span>
                  </div>
                </div>
              </div>
              <span className="identity-specimen-label">
                <span />
                The Nova signature
              </span>
            </div>

            <div className="overview-summary">
              <span>
                <Icon name="palette" size={16} />
                <strong>6</strong>core colors
              </span>
              <span>
                <Icon name="type" size={16} />
                <strong>1</strong>type family
              </span>
              <span>
                <Icon name="spacing" size={16} />
                <strong>4px</strong>base grid
              </span>
              <span>
                <Icon name="layers" size={16} />
                <strong>{tokenCount}</strong>design tokens
              </span>
              <a
                href="#usage"
                onClick={(e) => {
                  e.preventDefault();
                  goTo("usage");
                }}
              >
                Built to be reused
                <Icon name="diagonal" size={14} />
              </a>
            </div>
          </section>

          <section id="colors" className="ds-section">
            <SectionHeading
              title="Color, with intention."
              description="Quiet neutrals set the stage. Blue brings the focus."
            >
              <span className="section-note">
                <Icon name="copy" size={13} />
                Click a swatch to copy
              </span>
            </SectionHeading>
            <div className="palette-grid">
              {palette.map((color) => (
                <button
                  type="button"
                  className="color-swatch"
                  key={color.token}
                  onClick={() =>
                    copy(
                      getComputedStyle(document.documentElement)
                        .getPropertyValue(`--nova-${color.token}`)
                        .trim(),
                      `${color.name} copied`,
                    )
                  }
                  aria-label={`Copy ${color.name} color ${color.hex}`}
                >
                  <span
                    className="swatch-color"
                    style={{ background: `var(--nova-${color.token})` }}
                  >
                    <Icon name="copy" size={17} />
                  </span>
                  <span className="swatch-description">
                    <strong>{color.name}</strong>
                    <code>{color.hex}</code>
                  </span>
                </button>
              ))}
            </div>
            <div className="color-notes">
              <span>
                <i style={{ background: "var(--nova-text-secondary)" }} />
                Secondary text <code>#A1A3B2</code>
              </span>
              <span>
                <i style={{ background: "var(--nova-danger)" }} />
                Destructive <code>#FF7D8E</code>
              </span>
              <span>
                <i style={{ background: "var(--nova-success)" }} />
                Success <code>#8CDBB0</code>
              </span>
              <span>
                <i style={{ background: "var(--nova-warning)" }} />
                Warning <code>#EDC983</code>
              </span>
            </div>
          </section>

          <section id="typography" className="ds-section">
            <SectionHeading
              title="A clear voice."
              description="One typeface. A deliberate scale. Always easy to read."
            >
              <Badge>Geist Sans</Badge>
            </SectionHeading>
            <Card className="type-specimen">
              <div className="type-intro">
                <span className="large-aa">Aa</span>
                <div>
                  <h3>Geist Sans</h3>
                  <p>Clean, human, and quietly expressive.</p>
                </div>
                <div className="type-weights">
                  <span>
                    Regular <b>400</b>
                  </span>
                  <span>
                    Medium <b>500</b>
                  </span>
                  <span>
                    Semibold <b>600</b>
                  </span>
                </div>
                <p className="type-alphabet">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 &amp; @ ! ?
                </p>
              </div>
              <div className="type-scale">
                {[
                  {
                    name: "Display",
                    sample: "Space to think.",
                    size: 44,
                    line: "1.15",
                    weight: 600,
                  },
                  {
                    name: "Heading",
                    sample: "Your next great idea",
                    size: 24,
                    line: "1.15",
                    weight: 600,
                  },
                  {
                    name: "Title",
                    sample: "A conversation worth having",
                    size: 16,
                    line: "1.6",
                    weight: 600,
                  },
                  {
                    name: "Body",
                    sample: "A little curiosity can take you somewhere new.",
                    size: 14,
                    line: "1.6",
                    weight: 400,
                  },
                  {
                    name: "Caption",
                    sample: "Small details. A thoughtful experience.",
                    size: 12,
                    line: "1.6",
                    weight: 400,
                  },
                ].map((type) => (
                  <div className="type-scale-row" key={type.name}>
                    <div className="type-scale-meta">
                      <span>{type.name}</span>
                      <code>
                        {type.size} /{" "}
                        {Math.round(type.size * Number(type.line))}
                      </code>
                    </div>
                    <p
                      style={{
                        fontSize: type.size,
                        lineHeight: type.line,
                        fontWeight: type.weight,
                      }}
                    >
                      {type.sample}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <p className="foundation-note">
              Geist is a close implementation choice; the original font cannot
              be confirmed from the image. Body copy uses 1.6× line height.
            </p>
          </section>

          <section id="surfaces" className="ds-section">
            <SectionHeading
              title="Depth without the noise."
              description="Subtle layers and an illuminated edge give every surface its place."
            />
            <div className="surface-grid">
              <Card className="surface-specimen">
                <div className="surface-stack">
                  <span />
                  <span />
                  <span />
                </div>
                <div>
                  <h3>Layered surfaces</h3>
                  <p>
                    Canvas → panel → raised.
                    <br />A gentle shift, never a hard break.
                  </p>
                  <code>background + border</code>
                </div>
              </Card>
              <Card className="surface-specimen">
                <IconButton
                  className="glass-example"
                  icon="plus"
                  label="Preview secondary icon button"
                  variant="secondary"
                  size="lg"
                  onClick={() => notify("Secondary icon button selected")}
                />
                <div>
                  <h3>Soft glass</h3>
                  <p>
                    A top-edge highlight, an inset
                    <br />
                    rim, and a close shadow.
                  </p>
                  <code>--nova-button-secondary-shadow</code>
                </div>
              </Card>
              <Card className="surface-specimen">
                <IconButton
                  className="blue-example"
                  icon="send-solid"
                  label="Preview primary icon button"
                  variant="primary"
                  size="lg"
                  onClick={() => notify("Primary icon button selected")}
                />
                <div>
                  <h3>Focused light</h3>
                  <p>
                    Ice blue to cobalt.
                    <br />
                    Reserved for the next action.
                  </p>
                  <code>--nova-button-primary-fill</code>
                </div>
              </Card>
            </div>
          </section>

          <section id="spacing" className="ds-section">
            <SectionHeading
              title="Room for everything."
              description="A 4px rhythm keeps layouts balanced. Corners soften with scale."
            />
            <div className="spacing-grid">
              <Card className="spacing-card">
                <div className="specimen-heading">
                  <span>Spacing scale</span>
                  <code>Base · 4px</code>
                </div>
                <div className="spacing-bars">
                  {[4, 8, 12, 16, 24, 32, 48, 64].map((value) => (
                    <div key={value}>
                      <span className="spacing-bar-track">
                        <span style={{ height: value }} />
                      </span>
                      <code>{value}</code>
                    </div>
                  ))}
                </div>
                <p>
                  8px within controls · 16px between elements · 24px within
                  panels
                </p>
              </Card>
              <Card className="radius-card">
                <div className="specimen-heading">
                  <span>Corner radius</span>
                  <code>Soft, not circular</code>
                </div>
                <div className="radius-examples">
                  {[
                    { name: "Small", size: 10 },
                    { name: "Medium", size: 14 },
                    { name: "Large", size: 18 },
                    { name: "Panel", size: 24 },
                  ].map((radius) => (
                    <div key={radius.name}>
                      <span style={{ borderRadius: radius.size }} />
                      <code>{radius.size}px</code>
                      <span>{radius.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section id="components" className="ds-section">
            <SectionHeading
              title="Small pieces. Endless possibilities."
              description="Consistent building blocks, with the details already considered."
            >
              <Badge tone="success">Interactive</Badge>
            </SectionHeading>
            <ButtonWorkbench notify={notify} />
            <div className="component-grid">
              <Card className="input-specimen">
                <div className="specimen-heading">
                  <span>
                    <Icon name="search" size={16} />
                    Inputs
                  </span>
                  <code>TextField</code>
                </div>
                <TextField
                  label="Chat name"
                  value={chatName}
                  onChange={(event) => setChatName(event.target.value)}
                  placeholder="A new idea"
                  hint="Give your conversation a name."
                />
                <TextField
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  error={emailError}
                  hint="Try an invalid email to see the error state."
                />
              </Card>
              <Card className="controls-specimen">
                <div className="specimen-heading">
                  <span>
                    <Icon name="layers" size={16} />
                    Selection & status
                  </span>
                  <code>Toggle · Badge · Chip</code>
                </div>
                <Toggle
                  label="Save chat history"
                  checked={saveHistory}
                  onChange={setSaveHistory}
                />
                <Toggle
                  label="Enable web search"
                  checked={webSearch}
                  onChange={setWebSearch}
                />
                <div className="controls-divider" />
                <div className="badge-row">
                  <Badge>Free plan</Badge>
                  <Badge tone="blue">Nova Pro</Badge>
                  <Badge tone="success">Available</Badge>
                </div>
                <div className="chip-row">
                  <Chip
                    icon="bulb-input"
                    selected={selectedTool === "Brainstorm"}
                    onClick={() =>
                      setSelectedTool(
                        selectedTool === "Brainstorm" ? "" : "Brainstorm",
                      )
                    }
                  >
                    Brainstorm
                  </Chip>
                  <Chip
                    icon="web"
                    selected={selectedTool === "Web search"}
                    onClick={() =>
                      setSelectedTool(
                        selectedTool === "Web search" ? "" : "Web search",
                      )
                    }
                  >
                    Web search
                  </Chip>
                </div>
              </Card>
            </div>
          </section>

          <section id="icons" className="ds-section">
            <SectionHeading title="Icons" />
            <Card className="icon-specimen">
              <div className="icon-gallery">
                {interfaceIconNames.map((name) => (
                  <button
                    type="button"
                    key={name}
                    aria-label={`Copy ${name} icon usage`}
                    title={name}
                    onClick={() =>
                      copy(
                        `<Icon name="${name}" />`,
                        `${name} icon usage copied`,
                      )
                    }
                  >
                    <Icon name={name} size={24} />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </section>

          <section id="patterns" className="ds-section">
            <SectionHeading
              title="Better together."
              description="Foundations and components, assembled into familiar Nova moments."
            />
            <div className="patterns-grid">
              <Card className="chat-pattern">
                <ConversationPreview notify={notify} />
              </Card>
              <div className="side-patterns">
                <ConversationHistoryPanel
                  items={historyVisible ? historyExamples : []}
                  selectedId={selectedHistory}
                  onSelect={(id) => {
                    setSelectedHistory(id);
                    notify(
                      `${historyExamples.find((item) => item.id === id)?.title} selected`,
                    );
                  }}
                  onClear={() => {
                    setHistoryVisible(false);
                    setSelectedHistory(null);
                    notify("Demo history cleared");
                  }}
                  onRestore={() => setHistoryVisible(true)}
                  onGift={() => notify("Gift Offer selected")}
                />
                <PremiumPlanCard
                  onUpgrade={() => upgradeRef.current?.showModal()}
                />
              </div>
            </div>
            <div className="pattern-guidance">
              <Icon name="layers" size={17} />
              <p>
                One visual language, from the smallest icon to the whole
                conversation. Every pattern above uses the same tokens and
                components.
              </p>
            </div>
          </section>

          <section id="usage" className="ds-section">
            <SectionHeading
              title="Your next build starts here."
              description="Use the foundations. Compose the pieces. Keep it unmistakably Nova."
            />
            <Card className="usage-card">
              <div className="usage-toolbar">
                <span>
                  <Icon name="code" size={15} />
                  React · TypeScript
                </span>
                <button
                  type="button"
                  onClick={() => copy(codeExample, "Usage example copied")}
                >
                  <Icon name="copy" size={14} />
                  Copy code
                </button>
              </div>
              <pre>
                <code>{codeExample}</code>
              </pre>
            </Card>
            <div className="usage-rules">
              <div>
                <span className="rule-icon">
                  <Icon name="layers" size={18} />
                </span>
                <h3>Build from tokens</h3>
                <p>
                  Use semantic variables for surfaces, text, and actions. Change
                  a token once to keep every component in sync.
                </p>
              </div>
              <div>
                <span className="rule-icon">
                  <Icon name="grid" size={18} />
                </span>
                <h3>Respect the layout</h3>
                <p>
                  The reference uses a 76px rail, 244px sidebar, flexible
                  conversation, and 324px history panel. Collapse side panels on
                  smaller screens.
                </p>
              </div>
              <div>
                <span className="rule-icon">
                  <Icon name="check" size={18} />
                </span>
                <h3>Make it usable</h3>
                <p>
                  Keep keyboard focus visible, label icon buttons, support
                  reduced motion, and pair status colors with text.
                </p>
              </div>
            </div>
            <details className="reference-details">
              <summary>
                <span>
                  <Icon name="book" size={17} />
                  The original reference
                </span>
                <span>
                  See where it started
                  <Icon name="down" size={14} />
                </span>
              </summary>
              <div>
                <p>
                  Values are visually estimated from this image and normalized
                  for reuse. Success, warning, validation, and interaction
                  states extend the reference. Photography and the avatar are
                  content, not design tokens.
                </p>
                <Image
                  src="/nova-reference.png"
                  alt="Original Nova AI reference showing a dark three-panel chat interface, blue gradient controls, glass buttons, and history cards."
                  width={1395}
                  height={906}
                  sizes="(max-width: 768px) 100vw, 1000px"
                />
              </div>
            </details>
          </section>

          <footer className="ds-footer">
            <span>
              <AppLogo size={21} />
              Nova design system
              <span className="footer-divider" />
              Version 1.0
            </span>
            <span>Designed to feel like Nova.</span>
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                goTo("overview");
              }}
            >
              Back to top
              <Icon name="arrow" size={13} />
            </a>
          </footer>
        </main>
      </div>

      <dialog
        ref={searchRef}
        className="ds-dialog search-dialog"
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) searchRef.current?.close();
        }}
      >
        <div className="dialog-heading">
          <h2 id="search-title">Find in the system</h2>
          <button
            type="button"
            aria-label="Close search"
            onClick={() => searchRef.current?.close()}
          >
            <Icon name="close" size={19} />
          </button>
        </div>
        <TextField
          label="Search foundations and components"
          icon="search"
          value={query}
          autoFocus
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try colors, buttons, or spacing…"
        />
        <div className="search-results">
          {searchResults.length ? (
            searchResults.map((result) => (
              <button
                type="button"
                key={result.id}
                onClick={() => goTo(result.id)}
              >
                <Icon name={result.icon} size={19} />
                <span>
                  <strong>{result.name}</strong>
                  <span>{result.description}</span>
                </span>
                <Icon name="chevron" size={16} />
              </button>
            ))
          ) : (
            <p>No results. Try “color”, “type”, or “patterns”.</p>
          )}
        </div>
        <span className="dialog-hint">Esc to close · Tab to navigate</span>
      </dialog>
      <dialog
        ref={upgradeRef}
        className="ds-dialog upgrade-dialog"
        aria-labelledby="upgrade-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) upgradeRef.current?.close();
        }}
      >
        <div className="dialog-heading">
          <Badge tone="blue">Pattern preview</Badge>
          <button
            type="button"
            aria-label="Close plan preview"
            onClick={() => upgradeRef.current?.close()}
          >
            <Icon name="close" size={19} />
          </button>
        </div>
        <span className="dialog-crown">
          <Icon name="crown-solid" size={30} />
        </span>
        <h2 id="upgrade-title">A little more possibility.</h2>
        <p>
          This is the Nova premium pattern. In your product, this action opens
          plan selection and billing.
        </p>
        <ul>
          <li>
            <Icon name="check" size={16} />
            Advanced AI tools
          </li>
          <li>
            <Icon name="check" size={16} />
            More room for your ideas
          </li>
          <li>
            <Icon name="check" size={16} />A consistent Nova experience
          </li>
        </ul>
        <Button variant="primary" onClick={() => upgradeRef.current?.close()}>
          Back to the system
          <Icon name="arrow" size={15} />
        </Button>
      </dialog>
      <Toast className="ds-toast" message={toast} />
    </div>
  );
}
