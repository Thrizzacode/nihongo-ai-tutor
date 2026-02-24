"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

// ===== Types =====
type ToastType = "error" | "success" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
}

// ===== Context =====
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ===== Provider =====
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "error", durationMs = 6000) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container — 固定在畫面右上角 */}
      {toasts.length > 0 && (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm animate-slide-in ${styleMap[t.type]}`}
            >
              <span className="shrink-0 text-base">{iconMap[t.type]}</span>
              <span className="flex-1 leading-relaxed">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// ===== Style Maps =====
const styleMap: Record<ToastType, string> = {
  error: "border-red-200 bg-red-50/95 text-red-700",
  success: "border-green-200 bg-green-50/95 text-green-700",
  info: "border-blue-200 bg-blue-50/95 text-blue-700",
};

const iconMap: Record<ToastType, string> = {
  error: "⚠️",
  success: "✅",
  info: "ℹ️",
};
