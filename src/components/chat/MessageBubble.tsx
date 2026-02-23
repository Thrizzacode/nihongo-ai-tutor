"use client";

import { UIMessage } from "ai";
import Markdown from "react-markdown";
import { ParsedFeedback } from "./SidebarFeedback";
import { parseJsonSafely, getMessageText } from "./utils";

interface MessageBubbleProps {
  message: UIMessage;
  onOpenSidebar?: () => void;
}

export default function MessageBubble({ message, onOpenSidebar }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const rawText = getMessageText(message);
  let parsedJson: ParsedFeedback | null = null;
  let displayText = rawText;

  // 如果是 assistant，嘗試解析其回傳的 JSON
  if (!isUser) {
    parsedJson = parseJsonSafely<ParsedFeedback>(rawText);
    if (parsedJson && parsedJson.reply) {
      displayText = parsedJson.reply;
    } else if (rawText.trim().startsWith("{") || rawText.trim().startsWith("```")) {
      // 串流中，JSON 還不完整，嘗試用 regex 抓出 partial reply
      // 我們找 "reply": " 之後的所有內容，直到下一個雙引號或字串結尾
      const replyMatch = rawText.match(/"reply"\s*:\s*"([^"]*)/);
      if (replyMatch && replyMatch[1]) {
        // regex 抓到的是 raw JSON 字串，需要手動 unescape（\n \t \" 等 JSON escape 序列）
        try {
          displayText = JSON.parse(`"${replyMatch[1]}"`);
        } catch {
          displayText = replyMatch[1]
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, '"');
        }
      } else {
        displayText = "...";
      }
    }
  }

  return (
    <div className={`flex w-full flex-col mb-4 ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${isUser ? "bg-sakura-light text-foreground" : "bg-card border border-border"}`}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">
            {message.parts?.map((part, index) =>
              part.type === "text" ? <span key={index}>{part.text}</span> : null,
            ) || displayText}
          </span>
        ) : (
          <div className="prose-chat">
            <Markdown
              components={{
                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-bold text-foreground">{children}</strong>
                ),
                em: ({ children }) => <em className="text-primary/80">{children}</em>,
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>
                ),
                li: ({ children }) => <li className="text-sm">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-primary">
                    {children}
                  </code>
                ),
              }}
            >
              {displayText}
            </Markdown>
          </div>
        )}
      </div>
      {/* ... feedback indicators ... */}
      {!isUser &&
        parsedJson &&
        (parsedJson.corrections.length > 0 || parsedJson.new_vocabulary.length > 0) && (
          <div className="mt-1 flex gap-2">
            {parsedJson.corrections.length > 0 && (
              <button
                onClick={onOpenSidebar}
                className="text-[12px] bg-matsu/10 text-matsu px-1.5 py-0.5 rounded font-medium cursor-pointer active:scale-95 transition-transform md:cursor-default"
              >
                ✨ 有建議修正
              </button>
            )}
            {parsedJson.new_vocabulary.length > 0 && (
              <button
                onClick={onOpenSidebar}
                className="text-[12px] bg-sakura/10 text-sakura-dark px-1.5 py-0.5 rounded font-medium cursor-pointer active:scale-95 transition-transform md:cursor-default"
              >
                📚 新單字
              </button>
            )}
          </div>
        )}
    </div>
  );
}
