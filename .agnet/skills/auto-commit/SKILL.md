---
name: auto-commit
description: 自動生成符合 Angular 規範的 Commit Message。針對大型變動自動分段，避免 AI 處理上限。
version: 1.4.0
---

# Auto Commit Executor Skill

## Trigger Keywords (觸發關鍵詞)

(保持不變...)

## Context

當使用者要求 Commit 時，優先分析暫存區(Staging Area)，若暫存區為空則分析工作區。

## Instructions

### Step 0: 環境與變更檢查 (穩定性優化)

1. **預檢查**：執行 `git status --porcelain`。若輸出包含亂碼或特殊錯誤，請優先提示使用者檢查 Terminal 編碼或 Profile 設定。
2. **變更檢查**：
   - 執行 `git diff --cached --stat` (先看統計，不看內容)。
   - 如果暫存區為空，執行 `git diff --stat`。
   - **如果變更檔案超過 10 個或總行數過多**：提醒使用者「變更較大，建議分批提交或由我摘要主要變動」，以避免觸發 1500 bytes 截斷限制。

### Step 1: 分析與生成 (效能優化)

1. **精準讀取**：不要直接執行 `git diff`，改用 `git diff -U1` (減少上下文行數) 來讀取具體內容，確保核心邏輯不被截斷。
2. **生成規範**：
   - **Subject**: `<type>(<scope>): <summary>` (中文摘要)。
   - **Details**:
     - 每個修改點以 `- ` 開頭。
     - 若修改包含多個組件，必須依組件分類標註。

### Step 2: 預覽與確認

(展示格式保持不變，但增加「略過確認」的快速選項)

> **建議 Commit 內容：** ...
> **是否執行？** (輸入 y 直接提交 / p 提交並推送 / n 取消)

### Step 3: 執行 Git 命令 (強健性優化)

**當使用者確認後：**

1. **確保編碼**：在執行 commit 前，內部隱含執行一次環境檢查。
2. **執行指令**：
   ```bash
   git add -A
   git commit -m "<標題>" -m "<細節1>" -m "<細節2>"
   ```
