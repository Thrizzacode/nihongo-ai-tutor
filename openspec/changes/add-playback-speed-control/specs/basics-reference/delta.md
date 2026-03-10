## ADDED Requirements

### Requirement: 可調語速發音 (Adjustable Pronunciation Speed)

「基礎知識」介面 SHALL 提供語速調整功能，允許學習者根據個人需求調整發音快慢。

#### Scenario: 同步播放語速 (Synced Playback Speed)

- **WHEN** 「播放發音」設定為 ENABLED 狀態時
- **AND** 使用者設定語速為 X (例如 0.8) 時
- **THEN** 點擊任何卡片觸發的 `speak()` SHALL 以語速 X 進行播放

#### Scenario: 語速調整 UI 可見性 (Speech Rate UI Visibility)

- **WHEN** 「播放發音」設定為 ENABLED 狀態時
- **THEN** 介面 SHALL 顯示語速調整滑桿 (Slider) 與目前的數值（如 1.0x）
- **WHEN** 「播放發音」設定為 DISABLED 狀態時
- **THEN** 系統 SHALL 隱藏語速調整控制項，以簡化介面空間

#### Scenario: 語速設定持久化 (Speech Rate Persistence)

- **WHEN** 使用者變更語速滑桿的數值時
- **THEN** 系統 SHALL 持久化此項變更（建議存入 `localStorage`）
- **AND** 後續頁面載入時應自動恢復此語速設定
