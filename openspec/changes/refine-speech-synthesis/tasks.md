## 1. 核心發音工具優化 (Core Speech Utility)

- [x] 1.1 [P] 修改 `src/lib/speech.ts` 的 `speak` 函式。判斷傳入文字長度，若長度 <= 2，則於內容末尾拼接 `、` (日文頓號) 後再傳遞給 `SpeechSynthesisUtterance`。

## 2. 基礎知識頁面調整 (Basics Page Adjustments)

- [x] 2.1 [P] 修改 `src/app/basics/page.tsx`。更新工具欄中的語速滑桿 (`input[type="range"]`) 設定，將 `max` 屬性從 `2.0` 調整為 `1.2`。
- [x] 2.2 [P] 更新 `BasicsPage` 組件。在 `useEffect` 初始化 `playbackRate` 時，加入檢查邏輯：若從 `localStorage` 讀取的舊設定值大於 `1.2`，則自動重設為 `1.2` 或 `1.0`。
