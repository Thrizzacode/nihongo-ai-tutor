## MODIFIED Requirements

### Requirement: 卡片語音觸發 (Card Speech Toggle Logic)

基礎卡片應根據其翻面揭曉狀態來觸發自動播音，以提升使用者體驗。

#### Scenario: 揭曉播音控制 (Reveal-triggered Speech Control)

- **WHEN** 點擊處於隱藏狀態的卡片 (翻開內容) 且其 `autoPlay` 為 ENABLED 時
- **THEN** 系統 SHALL 自動執行語意播完後的語音讀取
- **AND** 當點擊已顯示內容的卡片 (隱藏內容) 時
- **THEN** 系統 SHALL 只切換狀態為隱藏，不應觸發任何語音輸出
