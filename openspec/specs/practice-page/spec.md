# 練習頁面

## 目的

定義練習頁面，作為主要學習介面，提供模式選擇與對話互動功能。

## 能力定義

### `practice-layout`

練習頁面（`/practice`）SHALL：

- 為 Client Component（`"use client"`）
- 佔滿整個視窗高度（`h-screen`），不允許 body 滾動
- 頂部包含 `Navbar`
- Navbar 下方顯示模式控制列
- 以 `ChatArea` 作為主要內容區域

### `mode-selection`

模式控制列 SHALL 提供：

- 下拉選單切換「🗣️ 自由對話」（`free`）與「📖 情境對話」（`scenario`）模式

#### 情境：選擇自由對話模式

- **WHEN** 模式為 `"free"`
- **THEN** 僅顯示模式下拉選單
- **AND** `ChatArea` SHALL 使用自由對話設定

#### 情境：選擇情境對話模式

- **WHEN** 模式為 `"scenario"`
- **THEN** SHALL 出現情境選擇下拉選單，列出可用情境
- **AND** SHALL 出現角色選擇器（A/B 切換按鈕）
- **AND** `ChatArea` SHALL 接收選定的情境與使用者角色

### `scenario-selection`

情境下拉選單 SHALL：

- 列出 `src/data/scenarios.ts` 中所有可用情境
- 顯示情境標題
- 選擇變更時更新 `ChatArea` key（以重置對話狀態）

### `role-selection`

角色切換 SHALL：

- 顯示選定情境 `roles` 物件中的角色標籤
- 預設為角色 "A"
- 角色 A 使用 primary 色，角色 B 使用 matsu 色
- 角色變更時更新 `ChatArea` key（以重置對話狀態）

## 約束條件

- 此頁面 MUST 受路由 middleware 保護（需登入）
- 當模式、情境或角色變更時，`ChatArea` key MUST 隨之變更以強制重新建立對話 session
