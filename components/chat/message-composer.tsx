"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { Icon } from "@/components/ui/icon";

const tools = [
  { name: "Brainstorm", icon: "bulb-input", key: "brainstorm" },
  { name: "Web Search", icon: "web", key: "search" },
  { name: "Code", icon: "code", key: "code" },
] as const;
const moreTools = ["Write", "Analyze", "Translate"];
interface VoiceRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult:
    | ((event: {
        resultIndex: number;
        results: {
          length: number;
          [index: number]: {
            isFinal: boolean;
            [index: number]: { transcript: string };
          };
        };
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export function MessageComposer({
  onSend,
  label = "Message Nova",
  disabled = false,
  size = "md",
  placeholder = "Ask me something...",
  maxLength,
}: {
  onSend: (message: string, tool: string | null) => void;
  label?: string;
  disabled?: boolean;
  size?: "md" | "lg";
  placeholder?: string;
  maxLength?: number;
}) {
  const [message, setMessage] = useState("");
  const [tool, setTool] = useState<string | null>(null);
  const [attachment, setAttachment] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<VoiceRecognition | null>(null);
  const moreId = useId();
  useEffect(() => {
    if (!moreOpen) return;
    function outside(event: PointerEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
        moreRef.current
          ?.querySelector<HTMLButtonElement>("[data-more-trigger]")
          ?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [moreOpen]);
  useEffect(
    () => () => {
      const voice = voiceRef.current;
      if (voice) {
        voice.onresult = null;
        voice.onend = null;
        voice.onerror = null;
        voice.abort();
      }
    },
    [],
  );
  useEffect(() => {
    if (disabled) voiceRef.current?.stop();
  }, [disabled]);
  function toggleVoice() {
    if (listening) {
      voiceRef.current?.stop();
      return;
    }
    const browser = window as typeof window & {
      SpeechRecognition?: new () => VoiceRecognition;
      webkitSpeechRecognition?: new () => VoiceRecognition;
    };
    const Recognition =
      browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Recognition) {
      setNotice(
        "Voice input is not supported in this browser. You can type your message instead.",
      );
      return;
    }
    const voice = new Recognition();
    voiceRef.current = voice;
    voice.lang = document.documentElement.lang || "en-US";
    voice.continuous = true;
    voice.interimResults = false;
    voice.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal)
          transcript += event.results[i][0].transcript;
      }
      if (transcript)
        setMessage((current) => `${current}${current ? " " : ""}${transcript}`);
    };
    voice.onend = () => setListening(false);
    voice.onerror = (event) => {
      setListening(false);
      setNotice(
        event.error === "not-allowed"
          ? "Allow microphone access in your browser to use voice input."
          : "Voice input could not continue. You can type your message or try again.",
      );
    };
    try {
      setNotice("");
      voice.start();
      setListening(true);
    } catch {
      setListening(false);
      setNotice(
        "Voice input could not start. You can type your message instead.",
      );
    }
  }
  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!message.trim() || disabled) return;
    onSend(message.trim(), tool);
    voiceRef.current?.stop();
    setMessage("");
    setAttachment("");
    if (fileRef.current) fileRef.current.value = "";
  }
  return (
    <div className="nova-composer-shell">
      <form
        className={`nova-composer nova-composer--${size}`}
        onSubmit={submit}
        aria-label={label}
        data-disabled={disabled || undefined}
      >
        <div className="nova-composer-tools">
          <div
            className="nova-composer-mode-scroll"
            role="group"
            aria-label="Message modes"
          >
            {tools.map((item) => (
              <Chip
                key={item.name}
                icon={item.icon}
                className={`nova-composer-tool--${item.key}`}
                disabled={disabled}
                selected={tool === item.name}
                onClick={() => setTool(tool === item.name ? null : item.name)}
              >
                {item.name}
              </Chip>
            ))}
          </div>
          <div className="nova-composer-more" ref={moreRef}>
            <Chip
              className="nova-composer-tool--more"
              selected={moreTools.includes(tool || "")}
              disabled={disabled}
              aria-expanded={moreOpen}
              aria-controls={moreId}
              data-more-trigger
              onClick={() => setMoreOpen(!moreOpen)}
            >
              {moreTools.includes(tool || "") ? tool : "More"}
            </Chip>
            {moreOpen ? (
              <div
                id={moreId}
                className="nova-composer-menu"
                role="group"
                aria-label="More tools"
              >
                {moreTools.map((name) => (
                  <button
                    type="button"
                    disabled={disabled}
                    key={name}
                    aria-pressed={tool === name}
                    onClick={() => {
                      setTool(tool === name ? null : name);
                      setMoreOpen(false);
                      moreRef.current
                        ?.querySelector<HTMLButtonElement>(
                          "[data-more-trigger]",
                        )
                        ?.focus();
                    }}
                  >
                    {name}
                    <Icon name={tool === name ? "check" : "arrow"} size={16} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {attachment ? (
          <div className="nova-composer-attachment">
            <Icon name="attach" size={13} />
            <span title={attachment}>{attachment}</span>
            <button
              type="button"
              disabled={disabled}
              aria-label="Remove attachment"
              onClick={() => {
                setAttachment("");
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              <Icon name="close" size={12} />
            </button>
          </div>
        ) : null}
        <div className="nova-composer-bottom">
          <input
            ref={fileRef}
            type="file"
            disabled={disabled}
            hidden
            onChange={(e) => setAttachment(e.target.files?.[0]?.name || "")}
          />
          <div className="nova-composer-actions">
            <IconButton
              icon="paperclip"
              className="nova-composer-attach"
              variant="ghost"
              disabled={disabled}
              label="Attach a file (local preview)"
              onClick={() => fileRef.current?.click()}
            />
            <IconButton
              icon="mic-input"
              className={`nova-composer-mic ${listening ? "is-listening" : ""}`}
              variant="ghost"
              label={listening ? "Stop voice input" : "Start voice input"}
              aria-pressed={listening}
              disabled={disabled}
              onClick={toggleVoice}
            />
          </div>
          <textarea
            aria-label={label}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            maxLength={maxLength}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <IconButton
            type="submit"
            icon="send-solid"
            label="Send message"
            variant="primary"
            size="sm"
            className="nova-send"
            disabled={disabled || !message.trim()}
          />
        </div>
        {notice ? (
          <p className="nova-composer-notice" role="status">
            {notice}
          </p>
        ) : null}
      </form>
    </div>
  );
}
