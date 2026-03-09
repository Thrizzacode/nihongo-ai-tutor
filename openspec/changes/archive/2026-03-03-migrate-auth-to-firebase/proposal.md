# Migrate Auth to Firebase

## Summary

將認證系統從 Supabase Auth 遷移至 Firebase Auth，改用 Firebase Admin SDK 實作 Server-Side session cookie 路由保護，同時新增 Google OAuth 登入功能。保留 Supabase 作為資料庫。

## Motivation

- Supabase Auth 目前只用於帳號登入/註冊，未使用其 Database 功能
- Firebase Auth 對 Google OAuth 整合更原生、設定更簡單
- 未來學習進度與單字記憶數據分析需要 PostgreSQL (Supabase DB)，因此採用 Firebase Auth + Supabase DB 混搭架構
- Firebase Auth 的免費額度完全不限 Authentication 用量，適合 side project

## Proposed Solution

### 架構

```
前端 → Firebase Auth SDK (登入/註冊/Google OAuth)
        ↓ (取得 ID Token)
  POST /api/auth/session → Firebase Admin SDK 建立 session cookie (httpOnly)
        ↓
  Next.js Middleware → 驗證 session cookie → 保護 /practice 路由
```

### 實作內容

1. **Firebase 初始化**：建立 `src/lib/firebase.ts` (Client SDK) 與 `src/lib/firebase-admin.ts` (Admin SDK)
2. **Auth Context**：建立 `AuthContext.tsx`，透過 `onAuthStateChanged` 管理全域認證狀態
3. **Session Cookie API**：`POST /api/auth/session` 建立 cookie、`DELETE` 清除 cookie
4. **Middleware 路由保護**：Server-Side 驗證 session cookie，保護 `/practice`
5. **頁面改寫**：Login、Signup 頁面改用 Firebase SDK，新增 Google 登入按鈕
6. **清理**：移除 `@supabase/ssr` 與 `src/utils/supabase/` (Auth 相關)，保留 `@supabase/supabase-js`

### Alternatives Considered

- **純 Client-Side 路由保護**：用 `ProtectedRoute` 元件在前端檢查，但無法防止直接 API 呼叫，安全性較低 → 不採用
- **全面遷移到 Firebase (Auth + Firestore)**：對未來的學習進度統計查詢不利，NoSQL 不擅長聚合分析 → 不採用
- **使用 `next-firebase-auth-edge` 套件**：能簡化 middleware 邏輯，但多一層依賴且自行實作更彈性 → 不採用

## Impact

- Affected specs: (無，目前沒有既存 specs)
- Affected code:
  - `package.json` — 新增 `firebase`, `firebase-admin`；移除 `@supabase/ssr`
  - `src/lib/firebase.ts` — [NEW]
  - `src/lib/firebase-admin.ts` — [NEW]
  - `src/contexts/AuthContext.tsx` — [NEW]
  - `src/app/api/auth/session/route.ts` — [NEW]
  - `src/middleware.ts` — [NEW]
  - `src/app/layout.tsx` — 加入 AuthProvider
  - `src/app/login/page.tsx` — 改用 Firebase Auth + Google 登入
  - `src/app/signup/page.tsx` — 改為 Client Component + Firebase Auth
  - `src/app/signup/success/page.tsx` — 更新文案
  - `src/app/signup/actions.ts` — [DELETE]
  - `src/utils/supabase/client.ts` — [DELETE]
  - `src/utils/supabase/server.ts` — [DELETE]
  - `src/utils/supabase/middleware.ts` — [DELETE]
  - `src/proxy.ts` — [DELETE]
  - `.env.local` — 新增 Firebase 環境變數（保留 Supabase）
