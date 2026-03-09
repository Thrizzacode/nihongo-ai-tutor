# 認證系統

## 目的

定義平台的認證能力，使用 Firebase Auth 作為客戶端認證，搭配 Firebase Admin SDK 進行伺服器端 session cookie 驗證。

## 能力定義

### `firebase-client-init`

系統 SHALL 使用環境變數（`NEXT_PUBLIC_FIREBASE_API_KEY`、`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`、`NEXT_PUBLIC_FIREBASE_PROJECT_ID`）初始化 Firebase Client SDK。

系統 SHALL 使用 singleton 模式避免 hot reload 時重複初始化。

環境變數未設定時（如 build 階段），系統 SHALL 回傳 `null` 而非拋出錯誤。

### `auth-context`

系統 SHALL 提供 `AuthContext` React context，透過 `AuthProvider` 元件包裹整個應用程式。

Context SHALL 公開以下介面：

- `user: User | null` — 目前的 Firebase 使用者
- `loading: boolean` — 認證狀態載入指示器
- `signIn(email, password)` — Email/Password 登入
- `signUp(email, password)` — Email/Password 註冊
- `signInWithGoogle()` — Google OAuth 彈出式登入
- `signOut()` — 登出並清除 session

系統 SHALL 透過 `onAuthStateChanged` 監聽認證狀態變更。

#### 情境：登入成功建立 session cookie

- **WHEN** 使用者透過任何方式成功登入（Email/Password、Google）
- **THEN** 系統 SHALL 呼叫 `POST /api/auth/session`，傳入 Firebase ID Token
- **AND** 系統 SHALL 建立 server-side session cookie

#### 情境：登出清除 session cookie

- **WHEN** 使用者登出
- **THEN** 系統 SHALL 呼叫 `DELETE /api/auth/session`
- **AND** server-side session cookie SHALL 被清除

### `firebase-admin-init`

系統 SHALL 使用僅限伺服器端的環境變數（`FIREBASE_ADMIN_PROJECT_ID`、`FIREBASE_ADMIN_CLIENT_EMAIL`、`FIREBASE_ADMIN_PRIVATE_KEY`）初始化 Firebase Admin SDK。

系統 SHALL 處理 `FIREBASE_ADMIN_PRIVATE_KEY` 中的換行符轉義（`\\n` → `\n`）。

環境變數未設定時，系統 SHALL 回傳 `null`。

### `session-cookie-api`

系統 SHALL 提供 `POST /api/auth/session`：

- 接受 JSON body `{ idToken: string }`
- 使用 Firebase Admin SDK 驗證 ID Token
- 透過 `adminAuth.createSessionCookie()` 建立有效期 5 天的 session cookie
- Cookie 設定為 `httpOnly`、`secure`（production 環境）、`sameSite: lax`、path `/`
- 成功回傳 `200`，Token 無效回傳 `401`，缺少 Token 回傳 `400`

系統 SHALL 提供 `DELETE /api/auth/session`：

- 設定 `maxAge: 0` 清除 session cookie
- 回傳 `200`

### `login-methods`

系統 SHALL 支援以下登入方式：

- Email/Password 登入：透過 `signInWithEmailAndPassword`
- Email/Password 註冊：透過 `createUserWithEmailAndPassword`
- Google OAuth 登入：透過 `signInWithPopup` 搭配 `GoogleAuthProvider`

### `login-ui`

登入頁面（`/login`）SHALL：

- 為 Client Component（`"use client"`）
- 提供 Email 與密碼輸入欄位
- 提供「帳密登入」送出按鈕
- 提供「使用 Google 帳號登入」按鈕
- 於紅色提示區塊顯示錯誤訊息
- 登入成功後 redirect 至 `/practice`
- 包含前往 `/signup` 的連結供新使用者使用

### `signup-ui`

註冊頁面（`/signup`）SHALL：

- 為 Client Component（`"use client"`）
- 提供 Email 與密碼輸入欄位
- 提供「立即註冊」送出按鈕
- 註冊成功後導向 `/signup/success`
- 包含前往 `/login` 的連結供已有帳號的使用者使用

## 約束條件

- Firebase Client SDK 設定值 MUST 使用 `NEXT_PUBLIC_` 前綴以供客戶端存取
- Firebase Admin SDK 憑證 MUST NOT 使用 `NEXT_PUBLIC_` 前綴（僅限伺服器端）
- Session cookie MUST 設為 `httpOnly` 以防止 XSS 攻擊
- Login 與 Signup 頁面使用 shadcn/ui 的 `Card`、`Button`、`Input` 元件
