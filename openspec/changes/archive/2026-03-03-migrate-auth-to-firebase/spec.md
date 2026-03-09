# Firebase Auth Integration

## 目的

定義使用 Firebase Auth 搭配 Server-Side session cookie 驗證的認證能力，取代原有的 Supabase Auth。

## 能力定義

### `firebase-client-auth`

系統 SHALL 使用環境變數（`NEXT_PUBLIC_FIREBASE_API_KEY`、`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`、`NEXT_PUBLIC_FIREBASE_PROJECT_ID`）初始化 Firebase Client SDK。

系統 SHALL 提供 `AuthContext` React context，具備以下功能：

- 透過 `onAuthStateChanged` 監聽認證狀態
- 公開 `user`、`loading`、`signIn`、`signUp`、`signInWithGoogle`、`signOut` 方法
- 登入成功後 SHALL 呼叫 `POST /api/auth/session`，傳入 Firebase ID Token 以建立 Server-Side session cookie
- 登出時 SHALL 呼叫 `DELETE /api/auth/session` 清除 session cookie

### `firebase-admin-auth`

系統 SHALL 使用僅限伺服器端的環境變數（`FIREBASE_ADMIN_PROJECT_ID`、`FIREBASE_ADMIN_CLIENT_EMAIL`、`FIREBASE_ADMIN_PRIVATE_KEY`）初始化 Firebase Admin SDK。

### `session-cookie-api`

系統 SHALL 提供 `POST /api/auth/session`：

- 接受 JSON body `{ idToken: string }`
- 使用 Firebase Admin SDK 驗證 ID Token
- 透過 `adminAuth.createSessionCookie()` 建立有效期 5 天的 session cookie
- Cookie 設定為 `httpOnly`、`secure`、`sameSite: lax`、path `/`
- 成功回傳 `200`，Token 無效回傳 `401`

系統 SHALL 提供 `DELETE /api/auth/session`：

- 清除 session cookie
- 回傳 `200`

### `middleware-route-protection`

系統 SHALL 實作 Next.js middleware，具備以下行為：

- 讀取 request 中的 `__session` cookie
- 使用 `adminAuth.verifySessionCookie()` 驗證 session cookie
- 受保護路由（`/practice`）：session 無效或缺失時，redirect 到 `/login`
- 認證頁面（`/login`、`/signup`）：session 有效時，redirect 到 `/practice`
- 其他路由：不驗證，直接放行

### `login-methods`

系統 SHALL 支援以下登入方式：

- Email/Password 登入：透過 `signInWithEmailAndPassword`
- Email/Password 註冊：透過 `createUserWithEmailAndPassword`
- Google OAuth 登入：透過 `signInWithPopup` 搭配 `GoogleAuthProvider`

### `auth-ui`

登入頁面（`/login`）SHALL：

- 提供 Email 與密碼輸入欄位
- 提供「使用 Google 帳號登入」按鈕
- 登入成功後 redirect 至 `/practice`

註冊頁面（`/signup`）SHALL：

- 為 Client Component（`"use client"`）
- 提供 Email 與密碼輸入欄位
- 註冊成功後導向 `/signup/success`

## 約束條件

- Firebase Client SDK 設定值 MUST 使用 `NEXT_PUBLIC_` 前綴以供客戶端存取
- Firebase Admin SDK 憑證 MUST NOT 使用 `NEXT_PUBLIC_` 前綴（僅限伺服器端）
- Session cookie MUST 設為 `httpOnly` 以防止 XSS 攻擊
- `@supabase/supabase-js` MUST 保留，供未來資料庫操作使用
- `@supabase/ssr` SHALL 移除，不再需要
