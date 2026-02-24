"use client";

import type { Scenario } from "@/data/scenarios";

interface ScenarioPanelProps {
  scenario: Scenario;
  userRole: "A" | "B";
  currentLineIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScenarioPanel({
  scenario,
  userRole,
  currentLineIndex,
  isOpen,
  onClose,
}: ScenarioPanelProps) {
  // 計算使用者目前進行到情境中的第幾行（原始 index）
  const userLineOriginalIndices = scenario.lines
    .map((line, idx) => ({ speaker: line.speaker, idx }))
    .filter((l) => l.speaker === userRole)
    .map((l) => l.idx);

  const activeOriginalIndex = userLineOriginalIndices[currentLineIndex] ?? -1;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[300] bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-[350] w-[300px] border-r border-border bg-card shadow-[8px_0_32px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out
          md:static md:z-0 md:w-[320px] md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">📖 {scenario.title}</h2>
              <p className="mt-0.5 text-xs text-text-muted">{scenario.description}</p>
            </div>
            <button onClick={onClose} className="p-2 text-text-muted md:hidden">
              ✕
            </button>
          </div>

          {/* Roles */}
          <div className="flex gap-3 border-b border-border px-5 py-3">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                userRole === "A"
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-primary/5 text-text-muted"
              }`}
            >
              {scenario.roles.A} (A)
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                userRole === "B"
                  ? "bg-matsu/15 text-matsu ring-1 ring-matsu/30"
                  : "bg-matsu/5 text-text-muted"
              }`}
            >
              {scenario.roles.B} (B)
            </span>
          </div>

          {/* Dialogue Lines */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 text-[0.7rem] text-text-muted">逐句將你的角色台詞翻譯成日文</p>
            <div className="flex flex-col gap-2">
              {scenario.lines.map((line, i) => {
                const isA = line.speaker === "A";
                const isMyRole = line.speaker === userRole;
                const isActive = i === activeOriginalIndex;
                const isPast = i < activeOriginalIndex;

                return (
                  <div
                    key={i}
                    className={`rounded-xl border px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "ring-2 ring-primary/40 border-primary/30 bg-primary/10"
                        : isPast
                          ? "opacity-50 border-border bg-muted/30"
                          : "border-border bg-background"
                    } ${isMyRole ? "" : "border-dashed"}`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold text-white ${
                          isA ? "bg-primary" : "bg-matsu"
                        }`}
                      >
                        {line.speaker}
                      </span>
                      <div className="flex-1">
                        <span className="leading-relaxed">{line.text}</span>
                        {isMyRole && isActive && (
                          <p className="mt-1 text-[0.65rem] text-primary font-medium">
                            ← 請翻譯這句
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
