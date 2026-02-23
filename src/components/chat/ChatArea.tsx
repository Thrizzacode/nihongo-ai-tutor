"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import SidebarFeedback, { ParsedFeedback } from "./SidebarFeedback";
import { parseJsonSafely, getMessageText } from "./utils";

export default function ChatArea() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [inputLocal, setInputLocal] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputLocal.trim()) return;
    sendMessage({ text: inputLocal });
    setInputLocal("");
  };

  // 當有新訊息時自動捲動到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop();

  const lastAssistantText = getMessageText(lastAssistantMessage);

  const lastFeedback = lastAssistantText
    ? parseJsonSafely<ParsedFeedback>(lastAssistantText)
    : null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 主要對話區 */}
      <div className="flex flex-1 flex-col bg-background md:border-r md:border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matsu-light text-xl">
              🎌
            </div>
            <div>
              <h2 className="text-sm font-semibold">AI 先生 (せんせい)</h2>
              <span className="text-xs font-medium text-matsu">● 自由練習模式</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden flex h-9 items-center justify-center rounded-lg bg-card border border-border px-3 text-xs font-medium text-text-secondary"
          >
            📋 查看糾錯
          </button>
        </div>

        {/* 聊天訊息區 */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-sm text-text-muted text-center leading-relaxed">
              こんにちは！😊 <br />
              隨便說點什麼吧，我會幫你糾正日文文法喔！
            </div>
          )}
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {isLoading && (
            <div className="flex gap-1 self-start p-3">
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce delay-100" />
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce delay-200" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 底部輸入框 */}
        <div className="border-t border-border bg-card p-4">
          <form
            onSubmit={handleFormSubmit}
            className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-2xl border border-border bg-background px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20"
          >
            <input
              value={inputLocal}
              onChange={(e) => setInputLocal(e.target.value)}
              disabled={isLoading}
              placeholder="輸入日文或中文..."
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-text-muted"
            />
            <button
              type="submit"
              disabled={isLoading || !inputLocal.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        </div>
      </div>

      {/* 糾錯側邊欄 */}
      <SidebarFeedback
        lastFeedback={lastFeedback}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 手機版遮罩 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
