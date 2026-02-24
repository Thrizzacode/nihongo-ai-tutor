"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import SidebarFeedback, { ParsedFeedback } from "./SidebarFeedback";
import ScenarioPanel from "./ScenarioPanel";
import { parseJsonSafely, getMessageText } from "./utils";
import { useToast } from "@/components/ui/Toast";
import type { Scenario } from "@/data/scenarios";

// 情境模式的擴展回饋介面
interface ScenarioFeedback extends ParsedFeedback {
  passed: boolean;
  suggested_translation: string;
  partner_reply: string;
}

interface ChatAreaProps {
  mode: "free" | "scenario";
  scenario?: Scenario | null;
  userRole?: "A" | "B";
}

// 模組層級變數，用於傳遞情境模式的額外 body（避免 React Compiler 的 ref lint）
const _scenarioBody: Record<string, unknown> = {};

const SCENARIO_TRANSPORT = new DefaultChatTransport({
  api: "/api/chat/scenario",
  body: () => _scenarioBody,
});

const FREE_TRANSPORT = new DefaultChatTransport({ api: "/api/chat" });

export default function ChatArea({ mode, scenario, userRole = "A" }: ChatAreaProps) {
  const { showToast } = useToast();

  const handleChatError = useCallback(
    (err: Error) => {
      const msg = err.message || "";
      if (msg.includes("429") || msg.includes("quota") || msg.includes("RATE_LIMIT")) {
        showToast("額度不足，請稍後再試。", "error");
      } else {
        showToast("發生錯誤，請稍後再試。", "error");
      }
    },
    [showToast],
  );

  // ===== 情境模式的逐句追蹤 =====
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [scenarioCompleted, setScenarioCompleted] = useState(false);
  const [scenarioDisplayHistory, setScenarioDisplayHistory] = useState<UIMessage[]>([]);

  const isScenarioMode = mode === "scenario" && scenario;

  // 取得使用者在情境中目前要翻譯的句子
  const getUserLines = useCallback(() => {
    if (!scenario) return [];
    return scenario.lines
      .map((line, idx) => ({ ...line, originalIndex: idx }))
      .filter((line) => line.speaker === userRole);
  }, [scenario, userRole]);

  const userLines = getUserLines();

  // ===== Chat Hooks =====
  const freeChat = useChat({ transport: FREE_TRANSPORT, onError: handleChatError });
  const scenarioChat = useChat({
    transport: SCENARIO_TRANSPORT,
    onError: handleChatError,
  });

  // ===== 共用 state =====
  const [inputLocal, setInputLocal] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScenarioPanelOpen, setIsScenarioPanelOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 根據模式選擇哪一組 chat
  const activeChat = isScenarioMode ? scenarioChat : freeChat;
  const { messages, sendMessage, status, setMessages } = activeChat;
  const isLoading = status === "streaming" || status === "submitted";

  const currentUserLine = userLines.find((_, idx) => idx === Math.floor(currentLineIndex));

  // 情境上下文字串
  const scenarioContext = useMemo(() => {
    if (!scenario) return "";
    return scenario.lines.map((l) => `${l.speaker}：${l.text}`).join("\n");
  }, [scenario]);

  // 已處理過的訊息 ID（避免重複處理同一條回覆）
  const lastProcessedMsgId = useRef<string | null>(null);

  // 監聽 AI 回覆完成後處理情境邏輯
  useEffect(() => {
    if (!isScenarioMode || status !== "ready" || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "assistant") return;
    if (lastMsg.id === lastProcessedMsgId.current) return;

    const rawText = getMessageText(lastMsg);
    const parsed = parseJsonSafely<ScenarioFeedback>(rawText);

    if (parsed && parsed.passed === true) {
      lastProcessedMsgId.current = lastMsg.id;

      // 使用 queueMicrotask 以非同步方式更新狀態，避免觸發串聯渲染
      queueMicrotask(() => {
        // 翻譯正確：加入對方的日文回覆到顯示紀錄
        if (parsed.partner_reply && parsed.partner_reply.trim()) {
          const partnerRole = userRole === "A" ? "B" : "A";
          const partnerName = scenario.roles[partnerRole];
          setScenarioDisplayHistory((prev) => [
            ...prev,
            {
              id: `partner-${Date.now()}`,
              role: "assistant" as const,
              parts: [
                {
                  type: "text" as const,
                  text: JSON.stringify({
                    reply: `**${partnerName}**：${parsed.partner_reply}`,
                    corrections: [],
                    new_vocabulary: [],
                  }),
                },
              ],
            },
          ]);
        }

        // 推進到下一句
        const nextIndex = Math.floor(currentLineIndex) + 1;
        if (nextIndex >= userLines.length) {
          setScenarioCompleted(true);
        } else {
          setCurrentLineIndex(nextIndex);
        }

        // 清除 useChat 歷史，讓下次送出時 AI 只看到當前訊息
        setMessages([]);
      });
    } else if (parsed && parsed.passed === false) {
      lastProcessedMsgId.current = lastMsg.id;

      queueMicrotask(() => {
        // 翻譯錯誤：將使用者訊息 + AI 糾錯加入顯示紀錄
        const userMsg = messages.find((m) => m.role === "user");
        if (userMsg) {
          setScenarioDisplayHistory((prev) => [...prev, userMsg, lastMsg]);
        }
        // 清除 useChat 歷史
        setMessages([]);
      });
    }
  }, [
    status,
    messages,
    isScenarioMode,
    currentLineIndex,
    userLines.length,
    scenario,
    userRole,
    setMessages,
  ]);

  // 自動捲動
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentLineIndex, scenarioDisplayHistory]);

  // 送出訊息
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputLocal.trim() || isLoading) return;

    if (isScenarioMode && currentUserLine) {
      // 找出對方角色的下一句台詞
      const currentOrigIdx = currentUserLine.originalIndex;
      const partnerLines = scenario.lines.filter(
        (l, idx) => l.speaker !== userRole && idx > currentOrigIdx,
      );
      const partnerNextLine = partnerLines.length > 0 ? partnerLines[0].text : undefined;

      // 將情境上下文存入模組變數
      Object.assign(_scenarioBody, {
        currentLine: currentUserLine.text,
        userRole,
        scenarioContext,
        partnerNextLine,
      });

      // 先把使用者訊息加入顯示紀錄
      setScenarioDisplayHistory((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user" as const,
          parts: [{ type: "text" as const, text: inputLocal }],
        },
      ]);

      // 清空 useChat 歷史後再送（AI 只看到當前這一則）
      setMessages([]);
      // 用 setTimeout 確保 messages 已清空後再送
      setTimeout(() => sendMessage({ text: inputLocal }), 0);
    } else {
      sendMessage({ text: inputLocal });
    }

    setInputLocal("");
  };

  // 取得最新的糾錯回饋
  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop();
  const lastAssistantText = getMessageText(lastAssistantMessage);
  const lastFeedback = lastAssistantText
    ? parseJsonSafely<ParsedFeedback>(lastAssistantText)
    : null;

  // Header 文字
  const modeLabel = isScenarioMode ? `情境練習 - ${scenario.title}` : "自由練習模式";

  // 空狀態提示
  const emptyHint = isScenarioMode
    ? null // 情境模式有專門的提示卡片
    : "こんにちは！😊\n隨便說點什麼吧，我會幫你糾正日文文法喔！";

  // 情境進度
  const progress = isScenarioMode
    ? { current: Math.floor(currentLineIndex) + 1, total: userLines.length }
    : null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 情境面板（左側） */}
      {isScenarioMode && (
        <ScenarioPanel
          scenario={scenario}
          userRole={userRole}
          currentLineIndex={Math.floor(currentLineIndex)}
          isOpen={isScenarioPanelOpen}
          onClose={() => setIsScenarioPanelOpen(false)}
        />
      )}

      {/* 主要對話區 */}
      <div className="flex flex-1 flex-col bg-background md:border-r md:border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            {/* 手機版：情境面板按鈕 */}
            {isScenarioMode && (
              <button
                onClick={() => setIsScenarioPanelOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm"
              >
                📖
              </button>
            )}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matsu-light text-xl">
              {isScenarioMode ? "📖" : "🎌"}
            </div>
            <div>
              <h2 className="text-sm font-semibold">AI 先生 (せんせい)</h2>
              <span className="text-xs font-medium text-matsu">● {modeLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isScenarioMode && progress && (
              <span className="text-xs font-medium text-text-muted">
                {progress.current}/{progress.total}
              </span>
            )}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden flex h-9 items-center justify-center rounded-lg bg-card border border-border px-3 text-xs font-medium text-text-secondary"
            >
              📋 {isScenarioMode ? "詳情" : "糾錯"}
            </button>
          </div>
        </div>

        {/* 聊天訊息區 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-2">
          {/* 自由模式空狀態 */}
          {!isScenarioMode && messages.length === 0 && emptyHint && (
            <div className="flex flex-1 items-center justify-center text-sm text-text-muted text-center leading-relaxed whitespace-pre-wrap">
              {emptyHint}
            </div>
          )}

          {/* 情境模式初始提示卡片 */}
          {isScenarioMode && messages.length === 0 && !scenarioCompleted && currentUserLine && (
            <div className="mx-auto max-w-md mt-8">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
                <p className="text-xs font-medium text-primary mb-2">請將以下中文翻譯成日文</p>
                <p className="text-lg font-semibold leading-relaxed">「{currentUserLine.text}」</p>
                <p className="mt-3 text-xs text-text-muted">
                  你扮演的是 <span className="font-bold">{scenario.roles[userRole]}</span>（角色{" "}
                  {userRole}）
                </p>
              </div>
            </div>
          )}

          {/* 訊息列表 */}
          {(() => {
            if (isScenarioMode) {
              // 情境模式：顯示紀錄 + 當前串流中的糾錯（passed:false）
              const streamingCorrections = messages.filter((m) => {
                if (m.role !== "assistant") return false;
                const text = getMessageText(m);
                const parsed = parseJsonSafely<ScenarioFeedback>(text);
                return parsed && parsed.passed === false;
              });
              const allDisplayMsgs = [...scenarioDisplayHistory, ...streamingCorrections];
              return allDisplayMsgs.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                />
              ));
            }
            return messages.map((m) => (
              <MessageBubble key={m.id} message={m} onOpenSidebar={() => setIsSidebarOpen(true)} />
            ));
          })()}

          {/* 情境模式：翻譯通過後顯示下一句提示 */}
          {isScenarioMode &&
            !scenarioCompleted &&
            scenarioDisplayHistory.length > 0 &&
            currentUserLine &&
            !isLoading && (
              <div className="mx-auto max-w-md my-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
                  <p className="text-xs font-medium text-primary mb-1">下一句</p>
                  <p className="text-base font-semibold leading-relaxed">
                    「{currentUserLine.text}」
                  </p>
                </div>
              </div>
            )}

          {/* 情境完成 */}
          {isScenarioMode && scenarioCompleted && (
            <div className="mx-auto max-w-md my-8">
              <div className="rounded-2xl border border-matsu/20 bg-matsu/5 p-6 text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-lg font-bold text-matsu">お疲れ様でした！</p>
                <p className="mt-1 text-sm text-text-secondary">情境對話練習完成！你做得很棒！</p>
              </div>
            </div>
          )}

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
              disabled={isLoading || scenarioCompleted}
              placeholder={
                scenarioCompleted
                  ? "練習已完成 ✨"
                  : isScenarioMode
                    ? "請輸入日文翻譯..."
                    : "輸入日文或中文..."
              }
              className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-text-muted"
              style={{ fontSize: "16px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputLocal.trim() || scenarioCompleted}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        </div>
      </div>

      {/* 糾錯 / 情境資訊 側邊欄（右側） */}
      <SidebarFeedback
        lastFeedback={lastFeedback}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        scenario={isScenarioMode ? scenario : undefined}
        userRole={isScenarioMode ? userRole : undefined}
        progress={progress}
      />

      {/* 手機版遮罩 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
