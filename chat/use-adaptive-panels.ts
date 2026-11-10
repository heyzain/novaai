"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { canFocus } from "@/lib/focus";

type Panel = "conversations" | "history";
const focusable =
  'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

function subscribe(callback: () => void) {
  const queries = [
    matchMedia("(max-width: 1100px)"),
    matchMedia("(max-width: 1250px)"),
  ];
  queries.forEach((query) => query.addEventListener("change", callback));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", callback));
}
function snapshot() {
  return matchMedia("(max-width: 1100px)").matches
    ? "compact"
    : matchMedia("(max-width: 1250px)").matches
      ? "medium"
      : "wide";
}
function serverSnapshot() {
  return "wide";
}

export function scrollBehavior(): ScrollBehavior {
  return matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function useAdaptivePanels() {
  const mode = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const compact = mode === "compact";
  const historyDrawer = mode !== "wide";
  const [panel, setPanel] = useState<Panel | null>(null);
  const activePanel =
    panel === "conversations"
      ? compact
        ? panel
        : null
      : historyDrawer
        ? panel
        : null;
  const conversationsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const close = () => setPanel(null);
    const queries = [
      matchMedia("(max-width: 1100px)"),
      matchMedia("(max-width: 1250px)"),
    ];
    queries.forEach((query) => query.addEventListener("change", close));
    return () =>
      queries.forEach((query) => query.removeEventListener("change", close));
  }, []);

  useEffect(() => {
    if (!activePanel) return;
    const element =
      activePanel === "conversations"
        ? conversationsRef.current
        : historyRef.current;
    if (!element) return;
    const previous = returnFocus.current;
    const getTargets = () =>
      Array.from(element.querySelectorAll<HTMLElement>(focusable)).filter(
        canFocus,
      );
    const frame = requestAnimationFrame(() =>
      (getTargets()[0] || element).focus({ preventScroll: true }),
    );
    function keydown(event: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setPanel(null);
      }
      if (event.key !== "Tab") return;
      const targets = getTargets();
      const first = targets[0],
        last = targets.at(-1);
      if (!first || !last) {
        event.preventDefault();
        element?.focus();
        return;
      }
      const outside = !element?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || outside)
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    let start: { x: number; y: number } | null = null;
    function touchstart(event: TouchEvent) {
      start = null;
      if ((event.target as Element).closest("input, textarea, select")) return;
      const touch = event.touches[0];
      start = { x: touch.clientX, y: touch.clientY };
    }
    function touchend(event: TouchEvent) {
      if (!start) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x,
        dy = touch.clientY - start.y;
      if (
        Math.abs(dx) > 80 &&
        Math.abs(dx) > Math.abs(dy) * 1.5 &&
        (activePanel === "conversations" ? dx < 0 : dx > 0)
      )
        setPanel(null);
      start = null;
    }
    document.addEventListener("keydown", keydown);
    element.addEventListener("touchstart", touchstart, { passive: true });
    element.addEventListener("touchend", touchend, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keydown);
      element.removeEventListener("touchstart", touchstart);
      element.removeEventListener("touchend", touchend);
      if (!document.querySelector("dialog[open]")) {
        const target = canFocus(previous)
          ? previous
          : Array.from(
              document.querySelectorAll<HTMLElement>(
                "[data-panel-trigger], .chat-conversations-top button, .chat-thread",
              ),
            ).find(canFocus);
        target?.focus({ preventScroll: true });
      }
    };
  }, [activePanel]);

  function togglePanel(name: Panel) {
    if (activePanel === name) {
      setPanel(null);
      return;
    }
    const focused = document.activeElement as HTMLElement | null;
    returnFocus.current = focused?.matches("button")
      ? focused
      : document.querySelector<HTMLElement>(
          name === "conversations"
            ? '[data-panel-trigger="conversations"]'
            : '[data-panel-trigger="history"]',
        );
    setPanel(name);
  }

  const closePanel = useCallback(() => setPanel(null), []);
  return {
    compact,
    historyDrawer,
    activePanel,
    mobileSidebarOpen: activePanel === "conversations",
    historyOpen: activePanel === "history",
    conversationsRef,
    historyRef,
    togglePanel,
    closePanel,
  };
}

/** Keep the composer in the visible viewport when a mobile keyboard opens. */
export function useChatViewport(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const viewport = window.visualViewport;
    if (!root || !viewport) return;
    const update = () => {
      if (viewport.scale !== 1) return;
      if (matchMedia("(max-width: 1100px)").matches)
        root.style.setProperty(
          "--chat-viewport-height",
          `${viewport.height}px`,
        );
      else root.style.removeProperty("--chat-viewport-height");
    };
    update();
    viewport.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => {
      viewport.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
      root.style.removeProperty("--chat-viewport-height");
    };
  }, [rootRef]);
}
