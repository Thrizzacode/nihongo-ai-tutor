## 為什麼要做這個變更 (Why)

為了提升「基礎知識」頁面的學習成效，我們需要新增發音功能。這能讓使用者在學習時同步聽到假名、單字（如數字、時間、日期等）的正確讀音。對於日語初學者來說，這種視覺與聽覺的結合是掌握發音的關鍵。

## 變更內容 (What Changes)

- 整合瀏覽器原生的 **Web Speech API** (`SpeechSynthesis`)，提供免費且低延遲的日語語音合成（TTS）。
- 實作全域語音工具函式 (`src/lib/speech.ts`)，統一管理語言設定 (`ja-JP`) 與語速。
- 強化 **基礎知識頁面** (`src/app/basics/page.tsx`)：
  - 工具欄新增「播放發音」CheckBox（狀態存入儲存於 localState，預設開啟）。
  - 點擊卡片主體時撥放語音（若開啟播放發音）。
  - 當「播放發音」開啟時，卡片顯示手動觸發播放的 **喇叭圖示**；關閉時則隱藏。

## 能力 (Capabilities)

### 新增能力

- `speech-utility`: 全域語音服務，為平台提供日語發音合成功能。

### 修改能力

- `basics-reference`: 更新規格，加入語音互動與發音教學需求。

## 影響範圍 (Impact)

- **受影響的規格**: `basics-reference`, `speech-utility` (新增)。
- **受影響的代碼**:
  - `src/lib/speech.ts` (新增)
  - `src/app/basics/page.tsx` (修改)
