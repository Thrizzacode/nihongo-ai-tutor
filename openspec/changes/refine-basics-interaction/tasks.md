## 1. 核心發音補強優化 (Core Speech Enhancement)

- [x] 1.1 [P] 修改 `src/lib/speech.ts`。將針對短內容 (長度 <= 2) 的補綴符號由 `、` 更換為長音符 `ー` 或點號 `。`。並嘗試對長度為 1 的內容注入 `ー` 作為元音拉長的輔助。

## 2. 卡片翻轉對話行為優化 (Card Trigger Optimization)

- [x] 2.1 [P] 修改 `src/app/basics/page.tsx`。更新 `BasicsCard` 的 `handleClick` 邏輯：僅在翻開未顯示內容 (`!showKana && !tempShow`) 的那一刻播音。
- [x] 2.2 [P] 同樣修改 `KanaCard` 的 `handleClick` 邏輯。確保點擊卡片翻回蓋上時維持靜音，且不會重複觸發瀏覽器的語音引擎。
