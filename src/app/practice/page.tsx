"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ChatArea from "@/components/chat/ChatArea";
import { scenarios } from "@/data/scenarios";
import type { Scenario } from "@/data/scenarios";

type PracticeMode = "free" | "scenario";

export default function PracticePage() {
  const [mode, setMode] = useState<PracticeMode>("free");
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [userRole, setUserRole] = useState<"A" | "B">("A");

  return (
    <div className="flex h-screen flex-col bg-background font-[var(--font-jp)] antialiased overflow-hidden">
      <Navbar />

      {/* 模式切換控制列 */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-2.5 pt-[72px] md:px-6">
        <label className="text-xs font-medium text-text-muted">練習模式：</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as PracticeMode)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="free">🗣️ 自由對話</option>
          <option value="scenario">📖 情境對話</option>
        </select>

        {mode === "scenario" && (
          <>
            {/* 情境選擇 */}
            <select
              value={selectedScenario.id}
              onChange={(e) => {
                const found = scenarios.find((s) => s.id === e.target.value);
                if (found) setSelectedScenario(found);
              }}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>

            {/* 角色選擇 */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
              <button
                onClick={() => setUserRole("A")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  userRole === "A"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-muted"
                }`}
              >
                {selectedScenario.roles.A} (A)
              </button>
              <button
                onClick={() => setUserRole("B")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  userRole === "B"
                    ? "bg-matsu text-white shadow-sm"
                    : "text-text-secondary hover:bg-muted"
                }`}
              >
                {selectedScenario.roles.B} (B)
              </button>
            </div>
          </>
        )}
      </div>

      {/* 主要內容區 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatArea
          key={`${mode}-${selectedScenario.id}-${userRole}`}
          mode={mode}
          scenario={mode === "scenario" ? selectedScenario : null}
          userRole={userRole}
        />
      </main>
    </div>
  );
}
