"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Message } from "./contracts";
import { createConversationOutline } from "./conversation-outline";
import { scrollBehavior } from "./use-adaptive-panels";

export function useConversationOutline({
  conversationId,
  messages,
  ready,
  threadRef,
}: {
  conversationId: string;
  messages: readonly Message[];
  ready: boolean;
  threadRef: RefObject<HTMLDivElement | null>;
}) {
  const entries = useMemo(
    () => (ready ? createConversationOutline(messages) : []),
    [messages, ready],
  );
  const [selection, setSelection] = useState({
    conversationId: "",
    targetId: "",
  });
  const pendingScroll = useRef<number | null>(null);
  const currentTargetId =
    selection.conversationId === conversationId &&
    entries.some((entry) => entry.targetId === selection.targetId)
      ? selection.targetId
      : entries[0]?.targetId;

  useEffect(() => {
    const thread = threadRef.current;
    pendingScroll.current = null;
    if (!thread || !entries.length) return;
    let frame = 0;
    function update() {
      frame = 0;
      if (!thread) return;
      if (pendingScroll.current !== null) {
        if (Math.abs(thread.scrollTop - pendingScroll.current) < 2)
          pendingScroll.current = null;
        return;
      }
      const targets = entries.flatMap((entry) => {
        const element = document.getElementById(entry.targetId);
        return element && thread.contains(element) ? [{ entry, element }] : [];
      });
      if (!targets.length) return;
      const line = thread.getBoundingClientRect().top + 32;
      let targetId = targets[0].entry.targetId;
      for (const target of targets) {
        if (target.element.getBoundingClientRect().top <= line)
          targetId = target.entry.targetId;
      }
      if (
        thread.scrollHeight > thread.clientHeight + 2 &&
        thread.scrollHeight - thread.clientHeight - thread.scrollTop < 2
      )
        targetId = targets[targets.length - 1].entry.targetId;
      setSelection((current) =>
        current.conversationId === conversationId &&
        current.targetId === targetId
          ? current
          : { conversationId, targetId },
      );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function release() {
      pendingScroll.current = null;
      schedule();
    }
    function keydown(event: KeyboardEvent) {
      if (
        !event.defaultPrevented &&
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        release();
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(thread);
    const content = thread.querySelector(".chat-messages");
    if (content) resize.observe(content);
    thread.addEventListener("scroll", schedule, { passive: true });
    thread.addEventListener("wheel", release, { passive: true });
    thread.addEventListener("touchstart", release, { passive: true });
    thread.addEventListener("keydown", keydown);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      thread.removeEventListener("scroll", schedule);
      thread.removeEventListener("wheel", release);
      thread.removeEventListener("touchstart", release);
      thread.removeEventListener("keydown", keydown);
    };
  }, [conversationId, entries, threadRef]);

  function navigateTo(targetId: string) {
    const thread = threadRef.current;
    const target = document.getElementById(targetId);
    if (!thread || !target || !thread.contains(target)) return;
    const top = Math.max(
      0,
      Math.min(
        thread.scrollHeight - thread.clientHeight,
        thread.scrollTop +
          target.getBoundingClientRect().top -
          thread.getBoundingClientRect().top -
          16,
      ),
    );
    setSelection({ conversationId, targetId });
    pendingScroll.current = top;
    target.focus({ preventScroll: true });
    thread.scrollTo({ top, behavior: scrollBehavior() });
  }

  function navigateToEdge(edge: "start" | "end") {
    const thread = threadRef.current;
    if (!thread) return;
    const target = edge === "start" ? entries[0] : entries.at(-1);
    if (target) setSelection({ conversationId, targetId: target.targetId });
    const top =
      edge === "start" ? 0 : thread.scrollHeight - thread.clientHeight;
    pendingScroll.current = top;
    thread.focus({ preventScroll: true });
    thread.scrollTo({ top, behavior: scrollBehavior() });
  }

  return {
    entries,
    currentTargetId,
    navigateTo,
    goToStart: () => navigateToEdge("start"),
    goToLatest: () => navigateToEdge("end"),
  };
}
