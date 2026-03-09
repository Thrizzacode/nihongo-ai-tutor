# 基礎知識參考

## 目的

定義日語基礎知識參考模組，提供互動式假名表（平假名/片假名）與分類詞彙文法參考表格。

## 能力定義

### `basics-page`

基礎知識頁面（`/basics`）SHALL：

- 為 Client Component（`"use client"`）
- 頂部包含 `Navbar`，底部包含 `Footer`
- 提供類別選擇器切換：五十音（Kana）、數字、曜日、月份、時間、色
- 提供假名與羅馬拼音的顯示/隱藏切換控制
- 使用 `useFadeIn` hook 實現滾動漸入動畫

### `kana-chart`

`KanaChart` 元件 SHALL：

- 從 `kana.json` 載入資料，顯示所有基本假名字元的表格
- 支援平假名與片假名顯示模式的切換
- 按照子音行分組排列（あ行、か行、さ行等）
- 支援各卡片的羅馬拼音顯示切換

#### 情境：平假名模式

- **WHEN** `useKatakana` 為 `false`
- **THEN** 每張 `KanaCard` SHALL 突出顯示平假名字元

#### 情境：片假名模式

- **WHEN** `useKatakana` 為 `true`
- **THEN** 每張 `KanaCard` SHALL 突出顯示片假名字元

### `kana-card`

`KanaCard` 元件 SHALL：

- 顯示主要假名字元（依模式顯示平假名或片假名）
- 根據 `showKana` 切換條件顯示對應的另一組假名
- 根據 `showRomaji` 切換條件顯示羅馬拼音
- 優雅處理表格中的空白格

### `basics-grid`

`BasicsGridView` 元件 SHALL：

- 根據選定類別從 `basics.json` 載入資料
- 按邏輯分組排列項目（如數字：1-10、11-19、十位數等）
- 以 `BasicsCard` 顯示每個項目

### `basics-card`

`BasicsCard` 元件 SHALL：

- 突出顯示漢字
- 根據 `showKana` 切換條件顯示假名讀音
- 根據 `showRomaji` 切換條件顯示羅馬拼音
- 固定顯示意思（繁體中文）
- 以不同樣式標示特殊項目（如量詞、不規則讀音）

### `static-data`

系統 SHALL 維護靜態 JSON 資料檔案：

- `kana.json`：含 `{ hiragana, katakana, romaji }` 的所有基本假名陣列
- `basics.json`：按類別（数字、曜日、月份、時間、色）分類的詞彙，含 `{ kanji, kana, romaji, meaning, special? }`

## 約束條件

- 所有意思與 UI 標籤 MUST 使用繁體中文
- 資料檔案 MUST 可靜態匯入（不需執行時期 fetch）
