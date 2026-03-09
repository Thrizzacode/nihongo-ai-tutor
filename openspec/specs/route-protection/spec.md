# 路由保護

## 目的

定義基於 middleware 的路由保護機制，依據 session 狀態守護需認證的路由並進行重導向。

## 能力定義

### `session-check`

Middleware SHALL 讀取 request 中的 `__session` cookie 來判斷認證狀態。

驗證方式為 cookie 存在性檢查（因 Edge Runtime 限制，不在 middleware 中進行密碼學驗證）。

### `protected-routes`

受保護路由 SHALL 定義為：`/practice`。

#### 情境：未認證存取受保護路由

- **WHEN** 未持有有效 session cookie 的使用者存取受保護路由
- **THEN** 系統 SHALL redirect 至 `/login`
- **AND** 原始路徑 SHALL 作為 `redirect` query parameter 保留

### `auth-route-redirect`

認證頁面路由 SHALL 定義為：`/login`、`/signup`。

#### 情境：已認證存取認證頁面

- **WHEN** 持有有效 session cookie 的使用者存取 `/login` 或 `/signup`
- **THEN** 系統 SHALL redirect 至 `/practice`

### `public-routes`

#### 情境：存取公開路由

- **WHEN** 使用者存取不在受保護清單也不在認證頁面清單的路由
- **THEN** 系統 SHALL 放行 request，不做任何修改

### `middleware-matcher`

Middleware SHALL 套用至所有路由，排除以下：

- `/api` 路由
- `/_next/static`（靜態檔案）
- `/_next/image`（圖片優化）
- `favicon.ico`
- 帶有副檔名的檔案（`.svg`、`.png`、`.jpg`、`.jpeg`、`.gif`、`.webp`）

## 約束條件

- Middleware 實作於 `src/proxy.ts`，匯出 `proxy` 函式
- Cookie 名稱 MUST 為 `__session`（Firebase 慣例）
- Middleware 運行於 Edge Runtime
