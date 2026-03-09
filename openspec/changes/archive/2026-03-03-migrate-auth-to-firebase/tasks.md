# Tasks: Migrate Auth to Firebase

## Phase 1: 基礎建設

- [x] T1: 安裝 `firebase` 和 `firebase-admin`，移除 `@supabase/ssr`
  - 修改: `package.json`
  - 不涉及 Supabase schema 變更

- [x] [P] T2: 建立 `src/lib/firebase.ts` — Firebase Client SDK 初始化
  - 新增: `src/lib/firebase.ts`
  - 讀取 `NEXT_PUBLIC_FIREBASE_*` 環境變數，匯出 `auth` instance

- [x] [P] T3: 建立 `src/lib/firebase-admin.ts` — Firebase Admin SDK 初始化
  - 新增: `src/lib/firebase-admin.ts`
  - 讀取 `FIREBASE_ADMIN_*` 環境變數，singleton pattern，匯出 `adminAuth`

## Phase 2: Auth Context 與 Session API

- [x] T4: 建立 `src/contexts/AuthContext.tsx` — 全域認證狀態管理
  - 新增: `src/contexts/AuthContext.tsx`
  - 實作 `AuthProvider`、`useAuth()` hook
  - 包含 `signIn`、`signUp`、`signInWithGoogle`、`signOut` 方法
  - 登入成功後呼叫 session API 建立 cookie

- [x] T5: 建立 `src/app/api/auth/session/route.ts` — Session Cookie API
  - 新增: `src/app/api/auth/session/route.ts`
  - POST: 接收 ID Token → 驗證 → 建立 httpOnly session cookie
  - DELETE: 清除 session cookie

- [x] T6: 修改 `src/app/layout.tsx` — 加入 AuthProvider
  - 修改: `src/app/layout.tsx`
  - 用 `AuthProvider` 包裹 children（需加入 `"use client"` wrapper component）

## Phase 3: 頁面改寫

- [x] [P] T7: 改寫 `src/app/login/page.tsx` — Firebase 登入 + Google OAuth
  - 修改: `src/app/login/page.tsx`
  - 移除 Supabase import，改用 `useAuth()` hook
  - 新增 Google 登入按鈕
  - 登入成功後 router.push("/practice")

- [x] [P] T8: 改寫 `src/app/signup/page.tsx` — 改為 Client Component
  - 修改: `src/app/signup/page.tsx`
  - 加入 `"use client"`，改用 `useAuth()` hook 的 signUp
  - 成功後導向 `/signup/success`

- [x] [P] T9: 更新 `src/app/signup/success/page.tsx` — 文案更新
  - 修改: `src/app/signup/success/page.tsx`
  - 更新為 Firebase 流程的文案（不需驗證信）

## Phase 4: Server-Side 路由保護

- [x] T10: 建立 `src/middleware.ts` — Next.js Middleware 路由保護
  - 新增: `src/middleware.ts`
  - 驗證 `__session` cookie，保護 `/practice`
  - 已登入時 redirect `/login`、`/signup` → `/practice`
  - 設定 matcher 排除靜態資源

## Phase 5: 清理與環境變數

- [x] [P] T11: 刪除 Supabase Auth 相關檔案
  - 刪除: `src/utils/supabase/client.ts`
  - 刪除: `src/utils/supabase/server.ts`
  - 刪除: `src/utils/supabase/middleware.ts`
  - 刪除: `src/app/signup/actions.ts`
  - 刪除: `src/proxy.ts`

- [x] [P] T12: 更新 `.env.local` — 新增 Firebase 環境變數
  - 修改: `.env.local`
  - 新增 `NEXT_PUBLIC_FIREBASE_*` 和 `FIREBASE_ADMIN_*`
  - 保留 `NEXT_PUBLIC_SUPABASE_*`

## Phase 6: 驗證

- [x] T13: Build 與 Lint 驗證
  - 執行 `pnpm build` 確認無編譯錯誤
  - 執行 `pnpm lint` 確認無殘留引用
  - 搜尋 `@supabase/ssr` 確認已完全移除
