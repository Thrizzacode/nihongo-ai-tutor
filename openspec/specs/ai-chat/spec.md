# AI 對話系統

## 目的

定義 AI 日語家教對話能力，包含自由對話模式與情境翻譯練習模式。

## 能力定義

### `free-chat-api`

系統 SHALL 提供 `POST /api/chat` 作為自由對話模式的 API：

- 接受 `{ messages: UIMessage[] }` 作為 JSON body
- 使用 Google Gemini（`gemini-2.5-flash-lite`）透過 Vercel AI SDK
- 設定 `maxDuration` 為 30 秒（Vercel 超時限制）
- 透過 `toUIMessageStreamResponse()` 串流回應

系統提示 SHALL 指示 AI：

1. 首先判斷使用者的訊息是否與日語學習相關（Guard 機制）
2. 若無關，回傳禮貌的引導 JSON 回應
3. 若相關，主要以日文回應並附上繁體中文解釋

AI SHALL 回傳純 JSON（不含 markdown 標記），結構如下：

```json
{
  "reply": "回應內容",
  "corrections": [{ "original": "原文", "corrected": "修正", "explanation": "解釋" }],
  "new_vocabulary": [{ "kanji": "漢字", "kana": "假名", "meaning": "意思" }]
}
```

#### 情境：API 頻率限制錯誤

- **WHEN** API 從 Google AI 收到 429 或 `RESOURCE_EXHAUSTED` 錯誤
- **THEN** 系統 SHALL 回傳 HTTP 429 並附帶 `{ error: "RATE_LIMIT" }`

#### 情境：一般錯誤處理

- **WHEN** API 遭遇非頻率限制的錯誤
- **THEN** 系統 SHALL 回傳 HTTP 500 並附帶 `{ error: "SERVER_ERROR" }`

### `scenario-chat-api`

系統 SHALL 提供 `POST /api/chat/scenario` 作為情境翻譯練習的 API：

- 接受 `{ messages, currentLine, userRole, scenarioContext, partnerNextLine }` 作為 JSON body
- 使用 Google Gemini（`gemini-2.5-flash-lite`）透過 Vercel AI SDK
- 透過 `toUIMessageStreamResponse()` 串流回應

系統提示 SHALL 指示 AI：

1. 評估使用者的日文翻譯是否與原始中文句子的文法正確且語義對應
2. 若使用者使用「普通形」，則全程使用「普通形」回覆，反之亦然
3. 不需逐字翻譯，語意正確且文法自然即可判定通過

AI SHALL 回傳純 JSON，結構如下：

```json
{
  "passed": "boolean",
  "reply": "回饋內容",
  "suggested_translation": "建議翻譯",
  "partner_reply": "對方角色回覆",
  "corrections": [{ "original": "原文", "corrected": "修正", "explanation": "解釋" }],
  "new_vocabulary": [{ "kanji": "漢字", "kana": "假名", "meaning": "意思" }]
}
```

#### 情境：翻譯通過

- **WHEN** `passed` 為 `true` 且有對方角色的下一句台詞
- **THEN** `partner_reply` SHALL 包含對方台詞的日文翻譯
- **AND** `corrections` MAY 為空陣列

#### 情境：翻譯未通過

- **WHEN** `passed` 為 `false`
- **THEN** `corrections` MUST 說明錯誤
- **AND** `suggested_translation` 與 `partner_reply` SHALL 為空字串

### `chat-ui`

`ChatArea` 元件 SHALL：

- 支援兩種模式：`"free"`（自由對話）與 `"scenario"`（情境對話）
- 使用 Vercel AI SDK 的 `useChat` hook 管理訊息
- 透過 `MessageBubble` 元件渲染訊息
- 解析 AI JSON 回應以顯示糾錯與詞彙（透過 `SidebarFeedback`）
- 自動捲動至最新訊息
- 於底部提供文字輸入區與送出按鈕

#### 情境：自由對話模式

- **WHEN** 模式為 `"free"`
- **THEN** 系統 SHALL 使用 `/api/chat` 端點
- **AND** 顯示 AI 回覆、糾錯與新詞彙

#### 情境：情境對話模式

- **WHEN** 模式為 `"scenario"`
- **THEN** 系統 SHALL 使用 `/api/chat/scenario` 端點
- **AND** 顯示 `ScenarioPanel` 呈現目前對話進度
- **AND** 發送 `currentLine`、`userRole`、`scenarioContext`、`partnerNextLine` 作為額外 body 參數

### `scenario-data`

系統 SHALL 以 `Scenario` 介面定義情境資料：

- `id: string` — 唯一識別碼
- `title: string` — 顯示標題
- `description: string` — 情境描述
- `roles: { A: string; B: string }` — 角色標籤
- `lines: ScenarioLine[]` — 對話台詞，含 `speaker` 與 `text`

### `message-bubble`

`MessageBubble` 元件 SHALL：

- 使用者訊息靠右對齊，AI 訊息靠左對齊
- 解析 AI 回應中的 JSON 以取得 `reply`、`corrections`、`new_vocabulary`
- 透過 `react-markdown` 支援 AI 回覆的 markdown 渲染

### `sidebar-feedback`

`SidebarFeedback` 元件 SHALL：

- 顯示糾錯：原文、修正文、解釋
- 顯示新詞彙：漢字、假名、意思
- 於情境模式中顯示通過/未通過狀態

## 約束條件

- 所有中文解釋 MUST 使用繁體中文
- AI 回應 MUST 為純 JSON，不含 markdown 程式碼區塊標記
- `GOOGLE_GENERATIVE_AI_API_KEY` 環境變數 MUST 僅限伺服器端使用
