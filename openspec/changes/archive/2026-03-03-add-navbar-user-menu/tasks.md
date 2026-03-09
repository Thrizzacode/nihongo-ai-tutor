# Tasks: Navbar User Menu

## Phase 1: 基礎元件與依賴設置

- [x] [P] T1: 安裝 Shadcn DropdownMenu 與依賴元件
  - 運行 `npx shadcn-ui@latest add dropdown-menu avatar`
  - 確認元件建立於 `src/components/ui`。

- [x] [P] T2: 建立 `UserNavMenu` 桌面版元件
  - 於 `src/components/layout/` 建立 `UserNavMenu.tsx`
  - 使用 `@radix-ui/react-dropdown-menu`
  - 包含 Email 顯示，預留「學習紀錄」、「帳號設定」、「方案」，以及「登出」功能
  - 整合 `lucide-react` 的 Icon

## Phase 2: 整合進頁面

- [x] T3: 修改 `src/components/layout/Navbar.tsx` (Desktop 版)
  - 引入 `useAuth()` 與 `UserNavMenu`
  - 替換原先 Desktop (md:inline-flex) 的「免費體驗」按鈕：未登入時顯示按鈕，已登入時顯示 `UserNavMenu`。

- [x] T4: 修改 `src/components/layout/Navbar.tsx` (Mobile 版)
  - 在行動版（`< md`）側邊選單底部替換渲染邏輯
  - 未登入時：顯示原本的「免費體驗」CTA
  - 已登入時：顯示包含 user.email 的帳戶區塊、連結自 `/practice` 的「開始練習」按鈕，以及一顆明顯的「登出」按鈕。

- [x] [P] T5: 修改 `src/app/page.tsx` (首頁 CTA)
  - 讀取 `useAuth()` 狀態
  - 修改 `HeroSection` 內的按鈕：已登入導向 `/practice` (文案: 繼續對話練習)，未登入導向 `/signup`
  - 修改 `CTASection` 內的按鈕：已登入導向 `/practice` (文案: 繼續練習日語)，未登入導向 `/signup`

## Phase 3: 驗證與微調

- [x] T6: Build 與 Lint 驗證
  - 運行 `pnpm build` 與 `pnpm lint`。
  - 確保登出時正確跳轉首頁，並且無報錯。
