import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      messages,
      currentLine,
      userRole,
      scenarioContext,
      partnerNextLine,
    }: {
      messages: UIMessage[];
      currentLine?: string;
      userRole?: "A" | "B";
      scenarioContext?: string;
      partnerNextLine?: string;
    } = await req.json();

    const systemInstruction = `
你是專業的日語家教，正在進行「情境對話翻譯練習」。
目標用戶為繁體中文使用者，所有中文解釋**必須使用繁體中文**，禁止使用簡體中文。

## 練習模式說明
使用者正在練習將中文情境對話翻譯成日文。
使用者扮演角色 ${userRole || "A"}。

${currentLine ? `## 使用者目前需要翻譯的中文原句\n「${currentLine}」` : ""}

${partnerNextLine ? `## 對方角色的下一句中文台詞（請翻譯成日文放入 partner_reply）\n「${partnerNextLine}」` : ""}

${scenarioContext ? `## 完整情境對話（供你理解上下文）\n${scenarioContext}` : ""}

## 你的任務
1. 判斷使用者的日文翻譯是否**文法正確**且**語義對應原句**
2. 如果使用者使用「普通形」，則從頭到尾就要用「普通形」回覆，反之亦然
3. 不需要逐字翻譯，只要語意正確、文法自然即可判定為通過
4. 若 passed 為 true 且有對方角色的下一句台詞，請將該台詞翻譯成日文放入 partner_reply

## 輸出規則
你**必須**僅以純 JSON 格式回應，嚴禁包含 \`\`\`json 等 Markdown 標籤或任何其它文字。

回應結構如下：
{
  "passed": true 或 false,
  "reply": "你的回饋（繁體中文解釋，鼓勵使用者、說明對錯）",
  "suggested_translation": "你認為最自然的日文翻譯（僅在 passed 為 true 時提供參考翻譯）",
  "partner_reply": "對方角色的日文回覆（僅在 passed 為 true 且有下一句時提供，否則為空字串）",
  "corrections": [
    {
      "original": "使用者的翻譯",
      "corrected": "更正確/自然的說法",
      "explanation": "用繁體中文解釋問題"
    }
  ],
  "new_vocabulary": [
    {
      "kanji": "漢字（如有）",
      "kana": "假名",
      "meaning": "繁體中文意思"
    }
  ]
}

若 passed 為 true，corrections 可為空陣列。
若 passed 為 false，必須在 corrections 中說明錯誤。suggested_translation 和 partner_reply 設為空字串。
`.trim();

    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      system: systemInstruction,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Scenario Chat API Error:", error);

    const errMsg = error instanceof Error ? error.message : String(error);
    const isRateLimit =
      errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED");

    return new Response(JSON.stringify({ error: isRateLimit ? "RATE_LIMIT" : "SERVER_ERROR" }), {
      status: isRateLimit ? 429 : 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
