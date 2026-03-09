import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
};

// Singleton: 避免 hot reload 時重複初始化
let app: FirebaseApp | null = null;

function getApp(): FirebaseApp | null {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  // 環境變數未設定時（如 build 階段），不初始化
  if (!firebaseConfig.apiKey) {
    return null;
  }

  app = initializeApp(firebaseConfig);
  return app;
}

const firebaseApp = getApp();

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
