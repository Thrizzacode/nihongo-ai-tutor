import { UIMessage } from "ai";

export function parseJsonSafely<T>(jsonString: string): T | null {
  try {
    // 移除 markdown 格式 (例如 ```json ... ```)
    const sanitized = jsonString.replace(/```json\n?|```/g, "").trim();
    // 有時模型會回傳一些雜訊訊息，我們嘗試找到第一個 { 並從那裡開始解析
    const jsonMatch = sanitized.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return JSON.parse(sanitized) as T;
    return JSON.parse(jsonMatch[0]) as T;
  } catch (e) {
    return null;
  }
}

export function getMessageText(message: UIMessage | undefined | null): string {
  if (!message) return "";

  // AI SDK v4+ (v6) UIMessage format uses 'parts'
  if ("parts" in message && Array.isArray(message.parts)) {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("");
  }

  // Fallback for older formats or core message format
  const msgWithContent = message as unknown as Record<string, unknown>;
  if (msgWithContent && typeof msgWithContent.content === "string") {
    return msgWithContent.content;
  }

  return "";
}
