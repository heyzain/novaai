"use client";

import { useEffect, useRef, useState } from "react";
import { chatApi } from "./chat-api";
import type {
  Conversation,
  ConversationSummary,
  Message,
  Profile,
  ReplyRequest,
} from "./contracts";

type StoredConversation = ConversationSummary & { messages?: Message[] };
type ReplyJob = {
  conversationId: string;
  input: ReplyRequest;
  replaceId?: string;
};
const emptyConversation: Conversation = {
  id: "",
  title: "Nova AI",
  description: "",
  messages: [],
};
const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
const localId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Owns remote data, the tab's local edits, and in-flight request lifecycles. */
export function useChatData() {
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeId, setActiveId] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [deletedHistory, setDeletedHistory] = useState<string[] | null>(null);
  const [saveHistory, setSaveHistory] = useState(true);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [conversationStatus, setConversationStatus] = useState<
    "loading" | "ready" | "error"
  >("ready");
  const [conversationError, setConversationError] = useState("");
  const [pendingReply, setPendingReply] = useState<ReplyJob | null>(null);
  const [replyFailure, setReplyFailure] = useState<{
    job: ReplyJob;
    message: string;
  } | null>(null);
  const detailController = useRef<AbortController | null>(null);
  const replyController = useRef<AbortController | null>(null);
  const pendingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    chatApi
      .bootstrap(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setConversations(
          data.conversations.map((item) =>
            item.id === data.activeConversation.id
              ? data.activeConversation
              : item,
          ),
        );
        setProfile(data.profile);
        setHistoryIds(data.historyIds);
        setActiveId(data.activeConversation.id);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setError(errorMessage(error));
        setStatus("error");
      });
    return () => controller.abort();
  }, [attempt]);
  useEffect(
    () => () => {
      detailController.current?.abort();
      replyController.current?.abort();
    },
    [],
  );

  const stored = conversations.find((item) => item.id === activeId);
  const active: Conversation = stored
    ? { ...stored, messages: stored.messages ?? [] }
    : emptyConversation;
  const history = historyIds.flatMap((id) => {
    const item = conversations.find((conversation) => conversation.id === id);
    return item
      ? [{ id, title: item.title, description: item.description }]
      : [];
  });

  function retryBootstrap() {
    setStatus("loading");
    setError("");
    setAttempt((value) => value + 1);
  }
  function selectConversation(id: string) {
    const item = conversations.find((conversation) => conversation.id === id);
    if (!item) return;
    detailController.current?.abort();
    setActiveId(id);
    setSelectedHistoryId(id);
    setConversationError("");
    if (item.messages) {
      setConversationStatus("ready");
      return;
    }
    const controller = new AbortController();
    detailController.current = controller;
    setConversationStatus("loading");
    chatApi
      .conversation(id, controller.signal)
      .then((conversation) => {
        if (controller.signal.aborted) return;
        setConversations((current) =>
          current.map((item) => (item.id === id ? conversation : item)),
        );
        setConversationStatus("ready");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setConversationError(errorMessage(error));
        setConversationStatus("error");
      });
  }
  function newChat() {
    if (status !== "ready") return;
    detailController.current?.abort();
    const id = localId();
    setConversations((current) => [
      {
        id,
        title: "New chat",
        description: "Start a new conversation",
        messages: [],
      },
      ...current,
    ]);
    if (saveHistory) setHistoryIds((current) => [id, ...current]);
    setActiveId(id);
    setSelectedHistoryId(id);
    setConversationStatus("ready");
  }
  async function requestReply(job: ReplyJob) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    const controller = new AbortController();
    replyController.current = controller;
    setReplyFailure(null);
    setPendingReply(job);
    try {
      const message = await chatApi.reply(job.input, controller.signal);
      if (controller.signal.aborted) return;
      setConversations((current) =>
        current.map((item) =>
          item.id === job.conversationId
            ? {
                ...item,
                messages: job.replaceId
                  ? item.messages?.map((previous) =>
                      previous.id === job.replaceId
                        ? { ...message, id: previous.id }
                        : previous,
                    )
                  : [...(item.messages ?? []), message],
              }
            : item,
        ),
      );
    } catch (error) {
      if (!controller.signal.aborted)
        setReplyFailure({ job, message: errorMessage(error) });
    } finally {
      pendingRef.current = false;
      if (!controller.signal.aborted) setPendingReply(null);
    }
  }
  function send(text: string, tool: string | null) {
    if (
      status !== "ready" ||
      conversationStatus !== "ready" ||
      pendingRef.current ||
      !text.trim()
    )
      return;
    const id = activeId;
    const message: Message = { id: localId(), role: "user", text };
    setConversations((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              title: item.messages?.length ? item.title : text,
              description: text,
              messages: [...(item.messages ?? []), message],
            }
          : item,
      ),
    );
    void requestReply({
      conversationId: id,
      input: { conversationId: id, prompt: text, tool },
    });
  }
  function regenerate(message: Message) {
    void requestReply({
      conversationId: activeId,
      replaceId: message.id,
      input: {
        conversationId: activeId,
        prompt: message.text,
        tool: null,
        regenerate: true,
      },
    });
  }
  function updateMessage(id: string, update: Partial<Message>) {
    setConversations((current) =>
      current.map((item) =>
        item.id === activeId
          ? {
              ...item,
              messages: item.messages?.map((message) =>
                message.id === id
                  ? {
                      ...message,
                      ...(update.text !== undefined &&
                      update.text !== message.text
                        ? { outlineTitle: undefined }
                        : {}),
                      ...update,
                    }
                  : message,
              ),
            }
          : item,
      ),
    );
  }
  function clearHistory() {
    setDeletedHistory(historyIds);
    setHistoryIds([]);
  }
  function restoreHistory() {
    if (!deletedHistory) return;
    setHistoryIds((current) => [
      ...current,
      ...deletedHistory.filter((id) => !current.includes(id)),
    ]);
    setDeletedHistory(null);
  }

  return {
    active,
    activeId,
    conversations,
    profile,
    history,
    selectedHistoryId,
    saveHistory,
    setSaveHistory,
    deletedHistory,
    clearHistory,
    restoreHistory,
    status,
    error,
    conversationStatus,
    conversationError,
    pendingReply,
    replyFailure,
    retryBootstrap,
    selectConversation,
    newChat,
    send,
    regenerate,
    updateMessage,
    retryConversation: () => selectConversation(activeId),
    retryReply: () => {
      if (replyFailure) void requestReply(replyFailure.job);
    },
  };
}
