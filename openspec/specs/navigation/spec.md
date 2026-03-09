# 導覽系統

## 目的

定義整體導覽系統，包含響應式 Navbar、登入使用者下拉選單與 Footer。

## 能力定義

### `navbar`

`Navbar` 元件 SHALL：

- 固定於視窗頂部，`z-index: 200`
- 顯示 Logo（Image + 文字「Nihongo AI Tutor」）連結至 `/`
- 提供導覽連結：基礎知識（`/basics`）、對話練習（`/practice`）、功能特色（`/#features`）、使用方式（`/#how-it-works`）

#### 情境：桌面版佈局（>= md 斷點）

- **WHEN** 視窗寬度 >= `md`
- **THEN** 導覽連結 SHALL 以水平列表方式內聯顯示
- **AND** 若使用者已登入，顯示 `UserNavMenu` 下拉選單
- **AND** 若使用者未登入，顯示「免費體驗」按鈕連結至 `/signup`

#### 情境：行動版佈局（< md 斷點）

- **WHEN** 視窗寬度 < `md`
- **THEN** 顯示漢堡按鈕以切換側邊面板
- **AND** 側邊面板 SHALL 從右側滑入並顯示導覽連結
- **AND** 面板後方 SHALL 出現半透明背景遮罩
- **AND** 若使用者已登入，面板底部顯示 Email、「開始練習」按鈕與「登出」按鈕
- **AND** 若使用者未登入，面板底部顯示「免費體驗」按鈕

#### 情境：滾動行為

- **WHEN** 使用者滾動超過 20px
- **THEN** Navbar SHALL 套用 `scrolled` class 以改變視覺樣式

#### 情境：行動版選單 body 鎖定

- **WHEN** 行動版選單開啟時
- **THEN** `body` overflow SHALL 設為 `hidden` 以防止背景滾動

### `user-nav-menu`

`UserNavMenu` 元件 SHALL：

- 渲染 Shadcn `DropdownMenu`，以 `Avatar` 按鈕作為觸發器
- 顯示使用者 Email 首字母作為 Avatar fallback
- 支援 hover 開啟選單，關閉延遲 150ms
- 設定 `modal={false}` 以避免 focus trap

下拉選單 SHALL 包含以下項目：

- 使用者顯示名稱與 Email 標籤
- 「學習紀錄」選項（停用，預留）
- 「帳號設定」選項（停用，預留）
- 「方案訂閱」選項（停用，預留）
- 分隔線
- 「登出」選項（紅色文字），觸發 `signOut()` 並導向 `/`

### `footer`

`Footer` 元件 SHALL 於適用頁面底部顯示版權資訊與品牌標示。

## 約束條件

- 認證狀態 MUST 透過 `useAuth()` hook 取得
- 登出 MUST 等待非同步操作完成後才進行導航
- 下拉選單 z-index MUST 設為 300 以顯示於其他元素之上
