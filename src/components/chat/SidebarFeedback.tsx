import type { Scenario } from "@/data/scenarios";

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface NewVocab {
  kanji?: string;
  kana: string;
  meaning: string;
}

export interface ParsedFeedback {
  reply: string;
  corrections: Correction[];
  new_vocabulary: NewVocab[];
}

interface SidebarFeedbackProps {
  lastFeedback: ParsedFeedback | null;
  isOpen: boolean;
  onClose?: () => void;
  // 情境模式專用
  scenario?: Scenario;
  userRole?: "A" | "B";
  progress?: { current: number; total: number } | null;
}

export default function SidebarFeedback({
  lastFeedback,
  isOpen,
  onClose,
  scenario,
  userRole,
  progress,
}: SidebarFeedbackProps) {
  const isScenarioMode = !!scenario;

  return (
    <aside
      className={`
        fixed inset-y-0 right-0 z-[350] w-[300px] border-l border-border bg-card transition-transform duration-300 ease-in-out md:static md:w-[350px] md:translate-x-0
        ${isOpen ? "translate-x-0 pt-[72px]" : "translate-x-full md:pt-0"}
      `}
    >
      <div className="flex h-full flex-col overflow-y-auto p-5">
        {/* 手機版 Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border md:hidden">
          <h2 className="text-sm font-semibold text-text-muted">
            {isScenarioMode ? "📖 情境詳情" : "📋 即時糾錯"}
          </h2>
          <button onClick={onClose} className="p-2 text-text-muted">
            ✕
          </button>
        </div>

        {/* 情境資訊區塊（情境模式才顯示） */}
        {isScenarioMode && scenario && (
          <div className="mb-4">
            <p className="hidden md:block mb-3 text-xs font-semibold text-text-muted">
              📖 情境資訊
            </p>

            <div className="rounded-xl border border-border bg-background p-3 mb-3">
              <h3 className="text-sm font-bold">{scenario.title}</h3>
              <p className="mt-1 text-xs text-text-secondary">{scenario.description}</p>

              {/* 角色 */}
              <div className="mt-2 flex gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    userRole === "A"
                      ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                      : "bg-primary/5 text-text-muted"
                  }`}
                >
                  {scenario.roles.A} (A)
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    userRole === "B"
                      ? "bg-matsu/15 text-matsu ring-1 ring-matsu/30"
                      : "bg-matsu/5 text-text-muted"
                  }`}
                >
                  {scenario.roles.B} (B)
                </span>
              </div>

              {/* 進度 */}
              {progress && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                    <span>進度</span>
                    <span>
                      {progress.current} / {progress.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 對話預覽 */}
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-text-muted hover:text-foreground transition-colors">
                📝 完整對話內容
              </summary>
              <div className="mt-2 flex flex-col gap-1.5 pl-1">
                {scenario.lines.map((line, i) => (
                  <div key={i} className="text-xs leading-relaxed">
                    <span
                      className={`font-bold ${
                        line.speaker === "A" ? "text-primary" : "text-matsu"
                      }`}
                    >
                      {line.speaker}：
                    </span>
                    <span className="text-text-secondary">{line.text}</span>
                  </div>
                ))}
              </div>
            </details>

            <hr className="my-4 border-border" />
          </div>
        )}

        {/* 糾錯區塊 */}
        <p className="hidden md:block mb-4 text-xs font-semibold text-text-muted">📋 即時糾錯</p>

        {!lastFeedback ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border text-xs text-text-muted">
            尚未有糾錯紀錄
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {lastFeedback.corrections.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-primary">📝 錯誤修正</h3>
                {lastFeedback.corrections.map((corr, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-primary/10 bg-sakura-light/30 p-3 text-sm"
                  >
                    <p className="mb-1 text-text-muted line-through text-xs">{corr.original}</p>
                    <p className="mb-2 font-semibold text-matsu">{corr.corrected}</p>
                    <p className="text-[0.8rem] text-text-secondary">{corr.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-matsu-light/50 p-3 text-sm text-matsu">
                🎉 文法與用詞完美，沒有錯誤！
              </div>
            )}

            {lastFeedback.new_vocabulary.length > 0 && (
              <div className="mt-2 flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-primary">📚 本次單字</h3>
                <div className="grid gap-2">
                  {lastFeedback.new_vocabulary.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-background p-2 text-sm border border-border"
                    >
                      <span className="font-bold">{v.kanji || v.kana}</span>
                      <span className="ml-2 text-xs text-text-muted">{v.kana}</span>
                      <p className="mt-1 text-xs text-text-secondary">{v.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
