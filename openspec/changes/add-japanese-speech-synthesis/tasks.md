## 1. 建立語音基礎工具 (Speech Foundation)

- [x] 1.1 [P] 建立全域語音工具函式 `src/lib/speech.ts`，封裝 Web Speech API 背景執行邏輯（鎖定 `ja-JP` 語言，設定預設語速為 1.0）。 (References: `Japanese Text-to-Speech (TTS)`)
- [x] 1.2 [P] 確保 `src/lib/speech.ts` 具備瀏覽器環境檢查（SSR 安全性），避免在伺服器端執行產生錯誤。 (References: `Playback Safety`)

## 2. 頁面狀態與 UI 整合 (Page State & UI Integration)

- [x] 2.1 修改 `src/app/basics/page.tsx`：定義 `autoPlay` 狀態，並實作 `useEffect` 從 `localStorage` 初始化設定（預設為 `true`）。 (References: `Synthesis Control`)
- [x] 2.2 修改 `src/app/basics/page.tsx` Toolbar：在工具欄中新增「自動播放發音」Checkbox，整合 Tailwind 樣式使其與現有 Checkbox 一致。 (References: `Synthesis Control`, `Toggle Auto-Play Setting`)
- [x] 2.3 [P] 確保 Toolbar 的佈局在行動裝置上不會因為新增 Checkbox 而跑版。

## 3. 卡片互動功能強化 (Card Interaction Enhancement)

- [x] 3.1 修改 `src/app/basics/page.tsx` 中的 `KanaCard` 組件：在點擊觸發翻開卡片的邏輯中，加入 `autoPlay` 判斷並執行 `speak` 函式。 (References: `Interactive Audio Pronunciation`, `Card Flip with Auto-Play Enabled`)
- [x] 3.2 修改 `src/app/basics/page.tsx` 中的 `BasicsCard` 組件：在點擊觸發翻開卡片的邏輯中，加入 `autoPlay` 判斷並執行 `speak` 函式。 (References: `Interactive Audio Pronunciation`, `Card Flip with Auto-Play Enabled`)
- [x] 3.3 [P] 在 `KanaCard` 與 `BasicsCard` 的 UI 中增加一個小的 Lucide `Volume2` 圖標，並綁定手動播放事件 `e.stopPropagation(); speak(item.kana);`。 (References: `Manual Playback Request`)

## 4. 驗證與測試 (Verification)

- [x] 4.1 **手動驗證**：進入 `/basics` 頁面，點擊五十音與單字卡片，確認語音是否發出。
- [x] 4.2 **功能開關測試**：切換「自動播放發音」開關，驗證關閉後點擊卡片是否不再自動播放。
- [x] 4.3 **手動觸發測試**：點擊卡片上的「喇叭圖標」，驗證無論自動播放開關為何，皆能正確發聲。
- [x] 4.4 **持久化測試**：切換開關後重新整理頁面，驗證 Checkbox 狀態是否維持不變。
