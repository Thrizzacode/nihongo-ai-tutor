# Proposal: Navbar User Menu

## Motivation

目前 Navbar 上的 CTA 按鈕為「免費體驗」，未根據使用者的登入狀態（`user` 存在與否）變化。為了提供完善的使用者體驗，已登入的使用者應該能夠從 Navbar 直觀地存取使用者專屬選單（包含未來的擴充功能如帳號設定、學習紀錄）並且能夠順暢地登出。

## Proposed Solution

1. **桌面版 (Desktop) Navbar**：
   - 引入 Shadcn UI `DropdownMenu` 組件。
   - 當使用者已登入時，原本的「免費體驗」按鈕將替換為使用者頭像（以 Email 第一個字母作為 fallback）或文字按鈕。
   - 下拉選單中加入未來可能用到的佔位連結：「學習紀錄」、「帳號設定」、「方案訂閱」，最後加上「登出」按鈕。

2. **行動版 (Mobile) Navbar**：
   - 在目前的漢堡選單內，如果使用者已登入，以顯示使用者 Email 的區塊取代「免費體驗」。
   - 下方提供明顯的「登出」與「開始練習」功能。

3. **首頁 (Home Page) CTA 切換**：
   - Hero 區塊：已登入時將「🚀 開始免費學習」改為「🚀 繼續對話練習」，導向 `/practice`。
   - 頁尾 CTA 區塊：已登入時將「🎌 立即免費開始」改為「🎌 繼續練習日語」，導向 `/practice`。

## Alternatives Considered

- **純 Tailwind 組件**：考量到無障礙（Accessibility）與點擊外部關閉（Click Outside）等行為處理的複雜度，選用 Shadcn `DropdownMenu` 來得更合適且與目前專案架構不衝突。

## Impact

此變更僅影響 UI，不會更動後端資料庫。
需要安裝 `dropdown-menu` 相關的 shadcn 組件。
