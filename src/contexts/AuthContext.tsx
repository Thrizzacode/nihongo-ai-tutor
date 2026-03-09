"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** 建立 server-side session cookie */
async function createSessionCookie(idToken: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    throw new Error("Failed to create session cookie");
  }
}

/** 清除 server-side session cookie */
async function clearSessionCookie() {
  await fetch("/api/auth/session", { method: "DELETE" });
}

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Firebase 未初始化時不需要 loading 狀態
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);
  }, []);

  const signInWithGoogleFn = useCallback(async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const { user } = await signInWithPopup(auth, googleProvider);
    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    await firebaseSignOut(auth);
    await clearSessionCookie();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle: signInWithGoogleFn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
