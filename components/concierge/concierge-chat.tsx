"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Is this good for a family?",
  "Estimate my EMI",
  "What's the neighbourhood like?",
];

export function ConciergeChat({ propertyId }: { propertyId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const ask = async (raw: string) => {
    const question = raw.trim();
    if (!question || loading) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, question }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "ai", text: data.answer ?? data.error ?? "Sorry, please try again." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "I couldn't reach the concierge — please try again." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() =>
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
      );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold leading-none">AI concierge</h3>
          <p className="text-xs text-muted">Ask anything about this home</p>
        </div>
      </div>

      {messages.length > 0 && (
        <div ref={listRef} className="mb-3 flex max-h-72 flex-col gap-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                m.role === "user"
                  ? "self-end bg-accent text-white"
                  : "self-start bg-background text-foreground"
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-2xl bg-background px-3.5 py-2 text-sm text-muted">
              Thinking…
            </div>
          )}
        </div>
      )}

      {messages.length === 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question…"
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
