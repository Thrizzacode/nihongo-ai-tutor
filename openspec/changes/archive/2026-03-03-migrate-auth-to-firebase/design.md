# Design: Migrate Auth to Firebase

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Client (Browser)                                       │
│  ┌─────────────┐    ┌──────────────────┐                │
│  │ Firebase SDK │◄──►│  AuthContext.tsx  │                │
│  │  (Auth)      │    │  onAuthStateChanged               │
│  └──────┬───────┘    │  signIn / signUp / signOut         │
│         │            │  signInWithGoogle                  │
│         │            └──────────┬───────┘                │
│         │(ID Token)            │                        │
└─────────┼──────────────────────┼────────────────────────┘
          ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│  Server (Next.js)                                       │
│                                                         │
│  ┌─ POST /api/auth/session ────────────┐                │
│  │  1. Receive ID Token                │                │
│  │  2. Verify with Admin SDK           │                │
│  │  3. Create session cookie (5 days)  │                │
│  │  4. Set httpOnly cookie             │                │
│  └─────────────────────────────────────┘                │
│                                                         │
│  ┌─ middleware.ts ─────────────────────┐                │
│  │  Read __session cookie              │                │
│  │  Verify with Admin SDK              │                │
│  │  /practice → require auth           │                │
│  │  /login, /signup → redirect if auth │                │
│  └─────────────────────────────────────┘                │
│                                                         │
│  ┌─ Firebase Admin SDK ───────────────┐                 │
│  │  firebase-admin.ts                  │                │
│  │  Service Account credentials        │                │
│  └─────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase Client SDK init
│   └── firebase-admin.ts    # Firebase Admin SDK init
├── contexts/
│   └── AuthContext.tsx       # Auth state provider + hooks
├── middleware.ts             # Route protection (replaces proxy.ts)
└── app/
    ├── api/auth/session/
    │   └── route.ts          # Session cookie create/delete
    ├── layout.tsx            # Wraps with AuthProvider
    ├── login/page.tsx        # Email + Google login
    └── signup/
        ├── page.tsx          # Client component signup
        └── success/page.tsx  # Updated copy
```

## Key Design Decisions

### 1. Session Cookie vs Client-Side Token

選擇 session cookie 而非純 client-side token，原因：

- **Server-side 路由保護**：Middleware 可在 RSC 生成前攔截未認證請求
- **安全性**：httpOnly cookie 無法被 XSS 讀取
- **擴展性**：未來 API route 可直接從 cookie 取得用戶資訊

### 2. Cookie 命名與設定

- Cookie 名稱：`__session`（Firebase Hosting 慣例，且避免與 Supabase cookie 衝突）
- `httpOnly: true`、`secure: true`（production）、`sameSite: "lax"`
- 有效期：5 天（Firebase session cookie 最長 14 天）

### 3. AuthContext 設計

- `onAuthStateChanged` 負責監聽 Firebase Auth 狀態
- 登入成功後自動呼叫 session API 建立 cookie
- 登出時同時清除 Firebase Auth 狀態與 server-side cookie
- 提供 `useAuth()` hook 讓任何 client component 取得用戶資訊

### 4. Middleware 策略

- 保護路由清單以 array 定義，易於未來擴充
- 登入/註冊頁面對已認證用戶做 redirect（避免重複登入）
- 驗證失敗時靜默放行非保護路由（不影響公開頁面效能）
- Matcher 排除靜態資源（`_next/static`、圖片等）

### 5. Firebase Admin SDK 初始化

- 使用 `cert()` 搭配環境變數（非 JSON 檔案），適合 Vercel 部署
- `FIREBASE_ADMIN_PRIVATE_KEY` 需處理 `\n` 換行符號（`.replace(/\\n/g, '\n')`）
- Singleton pattern：避免 hot reload 時重複初始化

## Dependencies

| 套件             | 用途                             | 版本策略      |
| ---------------- | -------------------------------- | ------------- |
| `firebase`       | Client SDK (Auth)                | Latest stable |
| `firebase-admin` | Admin SDK (session verification) | Latest stable |

| 移除的套件      | 原因                       |
| --------------- | -------------------------- |
| `@supabase/ssr` | Supabase Auth SSR 不再需要 |
