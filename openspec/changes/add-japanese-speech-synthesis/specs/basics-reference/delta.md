## ADDED Requirements

### Requirement: 互動語音發音 (Interactive Audio Pronunciation)

「基礎知識」介面 SHALL 允許學習者透過互動，聽取五十音、片假名及基礎詞彙的正確讀音。

#### Scenario: 卡片翻轉自動播放 (Card Flip with Auto-Play Enabled)

- **WHEN** 使用者點擊/觸摸未揭曉的背景卡片以查看答案時
- **AND** 「自動播放發音」設定為 ENABLED 狀態時
- **THEN** 系統 SHALL 呼叫 `speech-utility` 朗讀該卡片的日文假名 (Kana)
- **AND** 語音語速 SHALL 預設為適合學習者的速度 (0.9)

#### Scenario: 手動觸發播放 (Manual Playback Request)

- **WHEN** 使用者點擊/觸摸任何已揭曉卡片上的「喇叭」圖標時
- **THEN** 無論「自動播放」設定為何，系統 SHALL 呼叫 `speech-utility` 並播放對應音訊

### Requirement: 播放控制 (Synthesis Control)

應用程式 SHALL 提供使用者可見的操作控件，用於切換是否自動播放語音。

#### Scenario: 切換自動播放設定 (Toggle Auto-Play Setting)

- **WHEN** 使用者變更工具欄中「自動播放發音」CheckBox 的值時
- **THEN** 應用程式 SHALL 持久化此設定（例如存入 `localStorage`）
- **AND** 後續的卡片點擊應立即遵循新的設定值
