# Navbar User Menu Integration

## 目的

定義當使用者登入後，導覽列 (Navbar) 狀態的切換與顯示邏輯。

## 能力定義

### `desktop-user-menu`

系統 SHALL 在桌面版 Navbar（螢幕寬度 >= `md`）提供登入狀態的 UI 切換：

- **未登入時**：顯示「免費體驗」按鈕（連結至 `/signup`）。
- **已登入時**：顯示 Shadcn `DropdownMenu` 作為使用者的選單觸發按鈕（顯示頭像或 Email 縮寫）。

此 `DropdownMenu` SHALL 包含以下項目：

- 顯示使用者的 Email
- 「學習紀錄」連結（預留）
- 「帳號設定」連結（預留）
- 「方案與訂閱」連結（預留）
- 分隔線
- 「登出」操作，點擊後觸發 `signOut()` 並將使用者導回首頁或登入頁。

### `mobile-user-menu`

系統 SHALL 在行動版 Navbar（螢幕寬度 < `md` 的側邊滑出選單）提供登入狀態的 UI 切換：

- **未登入時**：維持在底部顯示「免費體驗」按鈕（連結至 `/signup`）。
- **已登入時**：在底部或獨立區塊顯示登入資訊與操作：
  - 顯示使用者的 Email
  - 提供「開始練習」按鈕（導向 `/practice`）
  - 提供「登出」按鈕，點擊後觸發 `signOut()`，自動關閉選單並導向首頁。

### `home-page-cta`

系統 SHALL 在首頁 (`/`) 的核心區塊根據登入狀態變更大呼籲（CTA）按鈕：

- **Hero 區塊**：已登入時 SHALL 將連結從 `/signup` 改為 `/practice`，並將文案更新為「🚀 繼續對話練習」。未登入則保持「🚀 開始免費學習」。
- **CTA 區塊 (頁尾)**：已登入時 SHALL 將連結從 `/signup` 改為 `/practice`，並將文案更新為「🎌 繼續練習日語」。未登入則保持「🎌 立即免費開始」。

## 約束條件

- 必須透過 `useAuth()` 取得登入狀態與 `signOut` 函式。
- 登出動作 SHALL 處理非同步結束後才更新畫面與導航。
- 下拉選單 UI 必須相容現有 Tailwind 主題設定。
