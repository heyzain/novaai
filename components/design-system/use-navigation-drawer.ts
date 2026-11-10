"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { canFocus } from "@/lib/focus";

const subscribe = (callback: () => void) => {
  const query = matchMedia("(max-width: 680px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const snapshot = () => matchMedia("(max-width: 680px)").matches;
const serverSnapshot = () => false;

export function useNavigationDrawer(open: boolean, onClose: () => void) {
  const compact = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isOpen = compact && open;

  useEffect(() => {
    const query = matchMedia("(max-width: 680px)");
    const closeOnDesktop = () => {
      if (!query.matches) onClose();
    };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const targets = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), [tabindex="0"]',
        ),
      ).filter(canFocus);
    const frame = requestAnimationFrame(() =>
      (
        drawer.querySelector<HTMLButtonElement>(".ds-nav-close") ?? targets()[0]
      )?.focus({ preventScroll: true }),
    );
    function keydown(event: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const list = targets(),
        first = list[0],
        last = list.at(-1);
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      const outside = !drawer?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || outside)
      ) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = previousOverflow;
      if (!document.querySelector("dialog[open]") && canFocus(trigger))
        trigger.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  return { compact, isOpen, drawerRef, triggerRef };
}
