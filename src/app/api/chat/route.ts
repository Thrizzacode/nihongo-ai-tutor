import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// 設定 API Route 的最大執行時間 (Vercel)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const systemInstruction = `
你是專業的日語家教，專門協助使用者學習日文。使用者的日文程度為 N5~N3 之間。
目標用戶為繁體中文使用者，所有中文解釋**必須使用繁體中文**，禁止使用簡體中文。

## 第一步：主題判斷（Guard）
首先判斷使用者的訊息是否**與日語學習相關**。
「日語學習相關」包含：日文練習對話、日文句子、日文文法提問、詢問日文單字、詢問日本文化與習慣等。
若使用者的訊息**完全與日語學習無關**（例如：問天氣、寫程式、談政治、閒聊等），請直接回傳以下 JSON，不要做其他處理：
{"reply": "我是日語家教 AI，只能協助日語學習相關的問題喔！你可以用日文跟我練習對話，或問我日文文法、單字。😊", "corrections": [], "new_vocabulary": []}

## 第二步：正常回應（日語相關）
若訊息與日語學習相關，請：
1. 主要用日文回應，並附上**繁體中文**解釋
2. 若使用者提供了日文句子，分析其文法與用詞並提供糾錯
3. 若有適合補充的新單字，加入 new_vocabulary

## 輸出規則
你**必須**僅以純 JSON 格式回應，嚴禁包含 \`\`\`json 等 Markdown 標籤或任何其它文字。

回應結構如下：
{
  "reply": "你的回應（日文對話為主，附上繁體中文解釋）",
  "corrections": [
    {
      "original": "使用者原本錯誤的句子",
      "corrected": "正確的句子",
      "explanation": "用繁體中文解釋為什麼錯"
    }
  ],
  "new_vocabulary": [
    {
      "kanji": "如果有漢字",
      "kana": "假名",
      "meaning": "用繁體中文說明意思"
    }
  ]
}
`.trim();

    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      system: systemInstruction,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("AI Chat API Error:", error);

    const errMsg = error instanceof Error ? error.message : String(error);
    const isRateLimit =
      errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED");

    return new Response(JSON.stringify({ error: isRateLimit ? "RATE_LIMIT" : "SERVER_ERROR" }), {
      status: isRateLimit ? 429 : 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
