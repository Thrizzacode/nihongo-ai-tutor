## ADDED Requirements

### Requirement: 點擊發音 (Click-to-Speak)

「基礎知識」介面 SHALL 讓學習者能在開啟設定時，直接點擊卡片聽取發音。

#### Scenario: 點擊播放 (Playback on Click)

- **WHEN** 使用者點擊/觸摸任何 `KanaCard` 或 `BasicsCard` 的主體時
- **AND** 「播放發音」設定為 ENABLED 狀態時
- **THEN** 系統 SHALL 呼叫 `speech-utility` 播放對應項目的日語發音

#### Scenario: 喇叭圖示可見性 (Speaker Icon Visibility)

- **WHEN** 「播放發音」設定為 ENABLED 狀態時
- **THEN** 每張卡片應顯示「喇叭」供使用者手動觸發播放
- **WHEN** 「播放發音」設定為 DISABLED 狀態時
- **THEN** 系統 SHALL 隱藏所有卡片上的「喇叭」圖示

### Requirement: 播控設定持久化 (Settings Persistence)

應用程式 SHALL 提供使用者可見的操作控件，並持久化該項設定。

#### Scenario: 切換設定 (Toggle Settings)

- **WHEN** 使用者變更工具欄中「播放發音」CheckBox 的值時
- **THEN** 應用程式 SHALL 持久化此設定（建議存入 `localStorage`）
- **AND** 卡片的互動行為與 UI 應立即反映此設定的變更
