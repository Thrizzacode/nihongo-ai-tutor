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
你是專業的日語家教。
使用者的日文程度為 N5~N3 之間。
請根據對話，如果使用者提供日文，請為他們的文法與用詞提供糾錯。
並以 JSON 格式回應以下結構（請**僅**回傳 JSON 字串，不要包含 \`\`\`json 標籤或其他雜訊）：
{
  "reply": "你的回應（盡量用日文對話，帶有一點中文解釋也可以）",
  "corrections": [
    {
      "original": "使用者原本錯誤的句子",
      "corrected": "正確的句子",
      "explanation": "中文解釋為什麼錯"
    }
  ],
  "new_vocabulary": [
    {
      "kanji": "如果有漢字",
      "kana": "假名",
      "meaning": "中文意思"
    }
  ]
}
如果不須糾錯，corrections 和 new_vocabulary 可為空陣列。
請一定要回傳 JSON 格式。
`.trim();

    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      system: systemInstruction,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
