# 首頁 Landing Page

## 目的

定義首頁，介紹平台功能、展示特色並引導使用者註冊或進入練習。

## 能力定義

### `hero-section`

`HeroSection` SHALL：

- 顯示主要標題與價值主張
- 包含模擬對話預覽（`HeroChatPreview`）以展示 AI 家教體驗
- 提供依登入狀態切換的 CTA 按鈕

#### 情境：訪客 CTA

- **WHEN** 使用者未登入
- **THEN** CTA 按鈕 SHALL 顯示「🚀 開始免費學習」連結至 `/signup`

#### 情境：已登入使用者 CTA

- **WHEN** 使用者已登入
- **THEN** CTA 按鈕 SHALL 顯示「🚀 繼續對話練習」連結至 `/practice`

### `hero-chat-preview`

`HeroChatPreview` 元件 SHALL：

- 顯示使用者與 AI 之間的模擬對話
- 展示 AI 的糾錯與詞彙回饋功能
- 訊息依序出現，帶有動畫效果以增加視覺吸引力

### `features-section`

`FeaturesSection` SHALL 顯示特色功能卡片表格，每張卡片包含：

- 圖示與彩色背景
- 標題與描述
- 標示功能階段的標籤（MVP 核心 / Phase 2）

目前展示的功能：

- AI 即時對話練習（MVP）
- 智能糾錯系統（MVP）
- 情境對話翻譯（MVP）
- 語音對話 STT/TTS（Phase 2）
- 學習進度追蹤（Phase 2）

### `how-it-works-section`

`HowItWorksSection` SHALL 顯示三步驟流程：

1. 免費註冊 — 使用 Email 帳號一鍵登入
2. 選擇模式 — 自由對話、情境練習或單字複習
3. 即時學習 — AI 出題、你回答、AI 批改

### `demo-preview-section`

`DemoPreviewSection` SHALL：

- 展示功能亮點：振假名（Furigana）切換、智能糾錯、響應式設計
- 顯示視覺化的聊天介面示範區

### `cta-section`

頁尾 `CTASection` SHALL：

- 於頁面底部顯示最終呼籲行動區塊

#### 情境：訪客頁尾 CTA

- **WHEN** 使用者未登入
- **THEN** CTA 按鈕 SHALL 顯示「🎌 立即免費開始」連結至 `/signup`

#### 情境：已登入使用者頁尾 CTA

- **WHEN** 使用者已登入
- **THEN** CTA 按鈕 SHALL 顯示「🎌 繼續練習日語」連結至 `/practice`

### `scroll-animations`

首頁 SHALL 使用 `useScrollFadeIn` hook，透過 `IntersectionObserver` 在區塊進入視窗時套用漸入動畫。

## 約束條件

- 首頁 MUST 為 Client Component（`"use client"`），因使用認證狀態與動畫 hooks
- 所有 UI 文案 MUST 使用繁體中文
- 頁面 MUST 頂部包含 `Navbar`、底部包含 `Footer`
- 自訂樣式定義於 `landing.css`
