## Summary (摘要)

改善單個假名 (五十音) 的發音自然度，並優化卡片翻轉時的語音觸發邏輯，使其僅在顯示卡片內容時播放。

## Motivation (動機)

1.  **發音問題**：目前的「頓號補正」雖然有幫助，但單假名 (如「あ」) 在電腦或手機系統中發音依然顯得過於短促，缺乏元音的自然衰減感。
2.  **翻轉邏輯**：在學習模式下，當卡片內容處於隱藏狀態時，用戶點擊翻開卡片是為了學習發音，此時應播音；但若再次點擊將卡片翻回（隱藏狀態）時，通常是為了切換到下一張，此時不該重複播音，以減少聽覺負擾。

## Proposed Solution (提案方案)

1.  **進階發音補償**：
    - 在 `src/lib/speech.ts` 中，針對單個字元 (或短字串) 改用長音符 `ー` 並嘗試在詞尾微微降低語速或調整音高 (Pitch) 方案 A 的進階版。
2.  **語音觸發優化**：
    - 修改 `BasicsCard` 和 `KanaCard` 的 `handleClick` 邏輯。
    - 加入判斷：僅在 `tempShow` 為 `false` (即「將要被顯示」) 且 `autoPlay` 為 `true` 時，才執行 `speak()` 函式。

## Impact (影響範圍)

### Modified Capabilities (受影響的規格)

- `speech-utility`: 針對短字串的發音補正邏輯更新。
- `basics-reference`: 基礎知識卡片的點擊語音觸發行為規範調整。

### Affected Code (受影響的代碼)

- `src/lib/speech.ts`: 更新 `speak` 函式的補正實作。
- `src/app/basics/page.tsx`: 修改卡片點擊的事件處理邏輯及傳遞。
