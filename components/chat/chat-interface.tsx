"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Toggle } from "@/components/ui/toggle";
import { Toast } from "@/components/ui/toast";
import { MessageComposer } from "@/components/chat/message-composer";
import { ConversationHistoryPanel } from "@/components/chat/conversation-history-panel";
import { PremiumPlanCard } from "@/components/chat/premium-plan-card";
import { Icon } from "@/components/ui/icon";
import { AppLogo } from "@/components/branding/app-logo";
import { canFocus } from "@/lib/focus";
import type { ImageAsset, Message } from "@/chat/contracts";
import { useChatData } from "@/chat/use-chat-data";
import { MessageActions } from "./message-actions";
import { ChatDialog } from "./chat-dialog";
import { ConversationSearch } from "./conversation-search";
import { MessageSkeleton } from "./message-skeleton";
import { ConversationListSkeleton } from "./conversation-list-skeleton";
import { HistoryPanelSkeleton } from "./history-panel-skeleton";
import { RequestError } from "./request-error";

import {
  scrollBehavior,
  useAdaptivePanels,
  useChatViewport,
} from "@/chat/use-adaptive-panels";

type Modal =
  | "search"
  | "settings"
  | "profile"
  | "upgrade"
  | "gift"
  | "edit"
  | "image"
  | null;

export function ChatInterface() {
  const {
    compact,
    historyDrawer,
    activePanel,
    mobileSidebarOpen,
    historyOpen,
    conversationsRef,
    historyRef,
    togglePanel,
    closePanel,
  } = useAdaptivePanels();
  const rootRef = useRef<HTMLDivElement>(null);
  useChatViewport(rootRef);
  const data = useChatData();
  const {
    active,
    activeId,
    conversations,
    profile,
    recentIds,
    history,
    selectedHistoryId,
    saveHistory,
    setSaveHistory,
    deletedHistory,
    updateMessage,
    status,
    conversationStatus,
    pendingReply,
    replyFailure,
  } = data;
  const loading = status === "loading";
  const ready = status === "ready";
  const busy = loading || conversationStatus === "loading";
  const [lightboxImages, setLightboxImages] = useState<ImageAsset[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [showJump, setShowJump] = useState(false);
  const modalReturnFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollOnSend = useRef(false);
  const followReplies = useRef(true);
  const previousThread = useRef({ id: "", pending: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (modal) {
      if (!dialog.open)
        modalReturnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      const target =
        modal === "search" || modal === "edit"
          ? dialog.querySelector<HTMLInputElement | HTMLTextAreaElement>(
              "input, textarea",
            )
          : dialog.querySelector<HTMLButtonElement>(
              ".chat-dialog-heading button",
            );
      target?.focus({ preventScroll: true });
    } else if (dialog.open) {
      dialog.close();
      const previous = modalReturnFocus.current;
      if (canFocus(previous)) previous.focus({ preventScroll: true });
      else {
        const fallback = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".chat-canvas-controls button, .chat-rail button",
          ),
        ).find(canFocus);
        fallback?.focus({ preventScroll: true });
      }
    }
  }, [modal]);
  useEffect(() => {
    const previous = previousThread.current;
    const pending = pendingReply?.conversationId === activeId;
    if (previous.id !== activeId) {
      followReplies.current = true;
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    } else if (
      scrollOnSend.current ||
      (previous.pending && !pending && followReplies.current)
    ) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: scrollBehavior(),
      });
    }
    scrollOnSend.current = false;
    previousThread.current = { id: activeId, pending };
  }, [activeId, active.messages.length, pendingReply]);
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        closePanel();
        setModal("search");
        dialogRef.current
          ?.querySelector<HTMLInputElement>(".chat-search-field input")
          ?.focus({ preventScroll: true });
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => {
      document.removeEventListener("keydown", shortcut);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [closePanel]);

  function openModal(name: Exclude<Modal, null>) {
    closePanel();
    setModal(name);
  }
  function notify(message: string) {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setToast("");
    }, 4500);
  }
  function restoreHistory() {
    if (!deletedHistory) return;
    data.restoreHistory();
    notify("History restored");
    requestAnimationFrame(() => {
      const target =
        historyRef.current?.querySelector<HTMLButtonElement>(".nova-history");
      if (canFocus(target || null)) target?.focus({ preventScroll: true });
    });
  }
  function selectConversation(id: string) {
    data.selectConversation(id);
    closePanel();
    setModal(null);
  }
  function newChat() {
    data.newChat();
    closePanel();
    setModal(null);
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLTextAreaElement>(".chat-composer textarea")
        ?.focus(),
    );
  }
  function send(text: string, tool: string | null) {
    followReplies.current = true;
    scrollOnSend.current = true;
    data.send(text, tool);
  }
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      notify("Message copied");
    } catch {
      notify("Copy is unavailable. Please select and copy the message.");
    }
  }
  function download(message: Message) {
    const url = URL.createObjectURL(
      new Blob([message.text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "nova-response.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function toggleSidebar() {
    const willOpen = compact ? !mobileSidebarOpen : sidebarCollapsed;
    if (compact) togglePanel("conversations");
    else setSidebarCollapsed((current) => !current);
    if (!compact)
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLButtonElement>(
            willOpen
              ? ".chat-conversations-top > button"
              : ".chat-canvas-controls > button:first-child",
          )
          ?.focus({ preventScroll: true }),
      );
  }
  function actions(message: Message) {
    return (
      <MessageActions
        message={message}
        onCopy={() => copy(message.text)}
        onDownload={() => download(message)}
        onFeedback={(feedback) =>
          updateMessage(message.id, {
            feedback: message.feedback === feedback ? null : feedback,
          })
        }
        onRegenerate={() => data.regenerate(message)}
        regenerating={!!pendingReply}
        onEdit={() => {
          setEditMessage(message);
          setEditText(message.text);
          setModal("edit");
        }}
      />
    );
  }

  const titles: Record<Exclude<Modal, null>, string> = {
    search: "Search conversations",
    settings: "Settings",
    profile: "Your profile",
    upgrade: "A little more possibility.",
    gift: "Share a little possibility.",
    edit: "Edit your message",
    image: "Summer in the mountains",
  };
  return (
    <div
      ref={rootRef}
      className="nova-workspace"
      data-sidebar-collapsed={sidebarCollapsed}
      data-mobile-sidebar={mobileSidebarOpen}
      data-history-open={historyOpen}
      data-show-history={showHistory}
    >
      <a className="chat-skip-link" href="#conversation">
        Skip to conversation
      </a>
      <button
        type="button"
        className="chat-drawer-backdrop"
        aria-label="Close side panel"
        aria-hidden={!activePanel}
        inert={!activePanel}
        tabIndex={-1}
        onClick={closePanel}
      />
      <div className="chat-layout">
        <div
          className="chat-left-shell"
          id="primary-navigation"
          ref={conversationsRef}
          role={compact ? "dialog" : undefined}
          aria-label={compact ? "Navigation" : undefined}
          aria-modal={mobileSidebarOpen || undefined}
          aria-hidden={compact ? !mobileSidebarOpen : undefined}
          tabIndex={compact ? -1 : undefined}
          inert={compact ? !mobileSidebarOpen : historyOpen}
        >
          <nav
            className="chat-rail"
            aria-label="Main navigation"
            inert={historyOpen}
          >
            <button
              type="button"
              className="chat-home"
              aria-label="Nova home"
              onClick={() => selectConversation(recentIds[0] ?? activeId)}
            >
              <AppLogo size={52} />
            </button>
            <div className="chat-rail-divider" />
            <div className="chat-rail-links">
              <IconButton
                icon="search"
                label="Search conversations"
                onClick={() => openModal("search")}
              />
              <Link
                href="/design-system"
                className="nova-icon-button nova-icon-button--secondary chat-library-link"
                aria-label="Open design system"
                title="Design system"
              >
                <Icon name="grid" size={24} />
              </Link>
              <IconButton
                icon="people"
                label="Your profile"
                onClick={() => openModal("profile")}
              />
              <IconButton
                icon="settings"
                label="Settings"
                onClick={() => openModal("settings")}
              />
            </div>
            <IconButton
              className="chat-session"
              icon="logout"
              label="Start a new session"
              onClick={newChat}
            />
          </nav>
          <aside
            className="chat-conversations"
            id="conversation-sidebar"
            aria-label="Conversations"
            aria-hidden={compact ? !mobileSidebarOpen : sidebarCollapsed}
            tabIndex={-1}
            inert={
              compact ? !mobileSidebarOpen : sidebarCollapsed || historyOpen
            }
          >
            <div className="chat-conversations-top">
              <IconButton
                icon={compact ? "close" : "sidebar"}
                label={compact ? "Close navigation" : "Collapse conversations"}
                aria-controls={
                  compact ? "primary-navigation" : "conversation-sidebar"
                }
                aria-expanded={compact ? mobileSidebarOpen : !sidebarCollapsed}
                onClick={toggleSidebar}
              />
            </div>
            <Button
              className="chat-new-chat"
              onClick={newChat}
              disabled={!ready}
            >
              <Icon name="plus" />
              New chat
            </Button>
            <div className="chat-recents">
              {!ready ? (
                <ConversationListSkeleton loading={loading} />
              ) : (
                <>
                  <div className="chat-recent-group">
                    <h2>Today</h2>
                    {recentIds.slice(0, 1).map((id) => {
                      const item = conversations.find(
                        (conversation) => conversation.id === id,
                      )!;
                      return (
                        <button
                          key={id}
                          type="button"
                          className={activeId === id ? "is-current" : ""}
                          title={item.title}
                          onClick={() => selectConversation(id)}
                          aria-current={activeId === id ? "page" : undefined}
                        >
                          {item.navigationTitle ?? item.title}
                        </button>
                      );
                    })}
                  </div>
                  <div className="chat-recent-group">
                    <h2>Today</h2>
                    {recentIds.slice(1).map((id) => {
                      const item = conversations.find(
                        (conversation) => conversation.id === id,
                      )!;
                      return (
                        <button
                          key={id}
                          type="button"
                          className={activeId === id ? "is-current" : ""}
                          title={item.title}
                          aria-current={activeId === id ? "page" : undefined}
                          onClick={() => selectConversation(id)}
                        >
                          {item.title}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <PremiumPlanCard onUpgrade={() => openModal("upgrade")} />
          </aside>
        </div>

        <main
          className="chat-canvas"
          id="conversation"
          aria-label="Conversation"
          inert={!!activePanel}
        >
          <div className="chat-canvas-controls">
            <IconButton
              icon={compact ? "menu" : "sidebar"}
              data-panel-trigger="conversations"
              label={
                compact
                  ? "Open navigation"
                  : sidebarCollapsed
                    ? "Open conversations"
                    : "Collapse conversations"
              }
              aria-expanded={compact ? mobileSidebarOpen : !sidebarCollapsed}
              aria-controls={
                compact ? "primary-navigation" : "conversation-sidebar"
              }
              onClick={toggleSidebar}
            />
            <span className="chat-active-title" title={active.title}>
              {active.title}
            </span>
            <IconButton
              className="chat-quick-new"
              variant="ghost"
              icon="plus"
              label="New chat"
              disabled={!ready}
              onClick={newChat}
            />
            <IconButton
              icon="history-folder"
              data-panel-trigger="history"
              label={
                historyDrawer
                  ? "Open history"
                  : showHistory
                    ? "Hide history"
                    : "Show history"
              }
              aria-expanded={historyDrawer ? historyOpen : showHistory}
              aria-controls="chat-history"
              onClick={() => {
                if (historyDrawer) togglePanel("history");
                else {
                  setShowHistory((current) => !current);
                  if (!sidebarCollapsed && !showHistory)
                    requestAnimationFrame(() =>
                      scrollRef.current?.focus({ preventScroll: true }),
                    );
                }
              }}
            />
          </div>
          <div
            className="chat-thread"
            ref={scrollRef}
            onScroll={(event) => {
              const element = event.currentTarget;
              const remaining =
                element.scrollHeight - element.scrollTop - element.clientHeight;
              followReplies.current = remaining <= 120;
              setShowJump(remaining > 120);
            }}
            tabIndex={0}
            aria-label="Conversation messages"
          >
            <div className="date-separator">
              <Badge tone="date">Today</Badge>
            </div>
            <div
              className="chat-messages"
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-busy={busy}
            >
              {busy && <MessageSkeleton />}
              {status === "error" && (
                <RequestError
                  message={data.error}
                  onRetry={data.retryBootstrap}
                />
              )}
              {ready && conversationStatus === "error" && (
                <RequestError
                  message={data.conversationError}
                  onRetry={data.retryConversation}
                />
              )}
              {ready &&
                conversationStatus === "ready" &&
                !active.messages.length && (
                  <div className="chat-empty">
                    <AppLogo size={64} />
                    <h1>Where shall we go next?</h1>
                    <p>Start with a question. Follow your curiosity.</p>
                  </div>
                )}
              {!busy &&
                conversationStatus !== "error" &&
                active.messages.map((message) =>
                  pendingReply?.conversationId === activeId &&
                  pendingReply.replaceId === message.id ? (
                    <MessageSkeleton key={message.id} reply />
                  ) : message.role === "assistant" ? (
                    <article
                      className="chat-message chat-assistant"
                      key={message.id}
                      aria-label="Nova AI message"
                    >
                      <AppLogo size={44} />
                      <h2>Nova AI</h2>
                      <div className="chat-assistant-content">
                        <p>{message.text}</p>
                        {message.images && (
                          <div
                            className="chat-mountain-images"
                            role="group"
                            aria-label="Mountain photos"
                          >
                            {message.images.map((image, index) => (
                              <button
                                key={image.src}
                                type="button"
                                onClick={() => {
                                  setLightboxImages(message.images ?? []);
                                  setImageIndex(index);
                                  setModal("image");
                                }}
                                aria-label={`View image: ${image.alt}`}
                              >
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  width={190}
                                  height={166}
                                  preload={index === 0}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                        {actions(message)}
                      </div>
                    </article>
                  ) : (
                    <article
                      className="chat-message chat-user"
                      key={message.id}
                      aria-label="Your message"
                    >
                      <div className="chat-user-content">
                        <p>{message.text}</p>
                        {actions(message)}
                      </div>
                      <Avatar
                        src={profile?.avatarSrc}
                        alt={profile?.name ?? "Your profile"}
                      />
                    </article>
                  ),
                )}
              {pendingReply?.conversationId === activeId &&
                !pendingReply.replaceId && <MessageSkeleton reply />}
              {replyFailure?.job.conversationId === activeId && (
                <RequestError
                  message={replyFailure.message}
                  onRetry={data.retryReply}
                />
              )}
            </div>
          </div>
          <div className="chat-composer">
            {showJump && (
              <button
                type="button"
                className="chat-jump-latest"
                onClick={() =>
                  scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: scrollBehavior(),
                  })
                }
              >
                <Icon name="down" size={16} />
                Latest messages
              </button>
            )}
            <MessageComposer
              key={activeId}
              onSend={send}
              maxLength={12000}
              disabled={
                !ready || conversationStatus !== "ready" || !!pendingReply
              }
              placeholder={compact ? "Message Nova…" : undefined}
            />
          </div>
        </main>

        <div
          ref={historyRef}
          className="chat-history"
          id="chat-history"
          role={historyDrawer ? "dialog" : undefined}
          aria-label="Chat history"
          aria-modal={historyOpen || undefined}
          aria-hidden={historyDrawer ? !historyOpen : !showHistory}
          tabIndex={-1}
          inert={
            historyDrawer ? !historyOpen : !showHistory || mobileSidebarOpen
          }
        >
          <IconButton
            className="chat-history-close"
            variant="ghost"
            icon="close"
            label="Close history"
            onClick={closePanel}
          />
          {!ready ? (
            <HistoryPanelSkeleton loading={loading} />
          ) : (
            <ConversationHistoryPanel
              profile={profile ?? undefined}
              items={history}
              selectedId={selectedHistoryId}
              onSelect={selectConversation}
              onClear={() => {
                data.clearHistory();
                notify("History deleted");
                requestAnimationFrame(() =>
                  historyRef.current
                    ?.querySelector<HTMLButtonElement>(
                      ".nova-history-empty button",
                    )
                    ?.focus({ preventScroll: true }),
                );
              }}
              onRestore={deletedHistory ? restoreHistory : newChat}
              restoreLabel={deletedHistory ? "Restore history" : "New chat"}
              onGift={() => openModal("gift")}
            />
          )}
        </div>
      </div>
      <Toast
        className="chat-toast"
        message={toast}
        action={
          deletedHistory && toast === "History deleted"
            ? { label: "Undo", onClick: restoreHistory }
            : undefined
        }
      />

      <ChatDialog
        title={modal ? titles[modal] : "Nova"}
        onClose={() => setModal(null)}
        dialogRef={dialogRef}
        variant={
          modal === "image"
            ? "image"
            : modal === "search"
              ? "search"
              : "default"
        }
      >
        {modal === "search" && (
          <ConversationSearch
            conversations={conversations}
            query={search}
            onQueryChange={setSearch}
            onSelect={selectConversation}
          />
        )}
        {modal === "settings" && (
          <div className="chat-settings">
            <Toggle
              label="Save chat history"
              checked={saveHistory}
              onChange={setSaveHistory}
            />
            <Toggle
              label="Show history panel"
              checked={showHistory}
              onChange={setShowHistory}
            />
            <Link href="/design-system">
              <Icon name="grid" />
              Explore the Nova design system
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        )}
        {modal === "profile" && (
          <div className="chat-profile">
            <Avatar
              src={profile?.avatarSrc}
              alt={profile?.name ?? "Your profile"}
            />
            <h3>{profile?.name ?? "Your profile"}</h3>
            <p>{profile ? `${profile.plan} plan` : "Profile is loading…"}</p>
            <Button onClick={() => openModal("upgrade")} variant="primary">
              Explore Premium
            </Button>
          </div>
        )}
        {(modal === "upgrade" || modal === "gift") && (
          <div className="chat-plan-dialog">
            <span className="nova-icon-button nova-icon-button--primary">
              <Icon
                name={modal === "gift" ? "gift" : "crown-solid"}
                size={30}
              />
            </span>
            <p>
              {modal === "gift"
                ? "Give someone a little more room to explore with Nova Premium."
                : "Unlock advanced AI tools and more room for your ideas."}
            </p>
            <ul>
              <li>
                <Icon name="check" />
                More ways to brainstorm
              </li>
              <li>
                <Icon name="check" />
                Room for longer conversations
              </li>
              <li>
                <Icon name="check" />A little extra possibility
              </li>
            </ul>
            <Button variant="primary" onClick={() => setModal(null)}>
              Back to chat
            </Button>
          </div>
        )}
        {modal === "edit" && (
          <form
            className="chat-edit-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (editMessage && editText.trim()) {
                updateMessage(editMessage.id, { text: editText.trim() });
                setModal(null);
                notify("Message updated");
              }
            }}
          >
            <label htmlFor="edit-message">Your message</label>
            <textarea
              id="edit-message"
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              autoFocus
            />
            <Button type="submit" variant="primary" disabled={!editText.trim()}>
              Save changes
            </Button>
          </form>
        )}
        {modal === "image" && lightboxImages[imageIndex] && (
          <figure className="chat-lightbox">
            <Image
              src={lightboxImages[imageIndex].src}
              alt={lightboxImages[imageIndex].alt}
              width={760}
              height={664}
            />
            <figcaption>{lightboxImages[imageIndex].alt}</figcaption>
            <div>
              {lightboxImages.map((image, index) => (
                <button
                  type="button"
                  key={image.src}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                />
              ))}
            </div>
          </figure>
        )}
      </ChatDialog>
    </div>
  );
}
