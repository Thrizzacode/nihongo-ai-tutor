# Design: Navbar User Menu

## Architecture & Components

我們會將邏輯拆分出來以維持 `Navbar` 元件的簡潔。

1. **元件：`UserNavMenu` (Desktop)**
   - 負責渲染 `Shadcn DropdownMenu`。
   - 顯示使用者的 Avatar（使用 Email 縮寫 fallback）或「我的帳號」。
   - 點擊後顯示選項（學習紀錄、設定、方案、登出）。

2. **行動版選單更新 (Mobile)**
   - 修改原封裝在 `Navbar` 的側邊滑出選單。
   - 若 `user` 存在，則渲染一塊包含 user email 的 header，並提供「前往練習」按鈕與「登出」按鈕。

## 依賴需求

- `lucide-react`：供選單中的 icon 使用（如 `LogOut`, `Settings`, `User`, `CreditCard` 等）。
- `@radix-ui/react-dropdown-menu`：透過 Shadcn CLI 安裝 `dropdown-menu`。

## 狀態管理與導航

- **`useAuth` Hook**：透過這個 hook 存取目前的 `user` 以及 `signOut` 方法。
- 若點擊**登出**：
  呼叫 `await signOut()`，清除 firebase 與 server-side cookie。
  然後利用 `router.push("/")` 將使用者返回首頁，以避免留在需認證的頁面對話框。
