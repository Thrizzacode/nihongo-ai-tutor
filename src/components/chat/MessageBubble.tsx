"use client";

import { UIMessage } from "ai";
import { ParsedFeedback } from "./SidebarFeedback";
import { parseJsonSafely, getMessageText } from "./utils";

interface MessageBubbleProps {
  message: UIMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
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
        <span className="whitespace-pre-wrap">
          {isUser
            ? // User message rendering via parts if available
              message.parts?.map((part, index) =>
                part.type === "text" ? <span key={index}>{part.text}</span> : null,
              ) || displayText
            : // Assistant message: if we parsed a reply, show it, otherwise show parts
              displayText}
        </span>
      </div>
      {/* ... feedback indicators ... */}
      {!isUser &&
        parsedJson &&
        (parsedJson.corrections.length > 0 || parsedJson.new_vocabulary.length > 0) && (
          <div className="mt-1 flex gap-2">
            {parsedJson.corrections.length > 0 && (
              <span className="text-[10px] bg-matsu/10 text-matsu px-1.5 py-0.5 rounded font-medium">
                ✨ 有建議修正
              </span>
            )}
            {parsedJson.new_vocabulary.length > 0 && (
              <span className="text-[10px] bg-sakura/10 text-sakura-dark px-1.5 py-0.5 rounded font-medium">
                📚 新單字
              </span>
            )}
          </div>
        )}
    </div>
  );
}
