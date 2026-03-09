## ADDED Requirements

### Requirement: 日語語音合成 (TTS)

應用程式 SHALL 提供一個機制，使用瀏覽器內建 API 將日語文字（漢字、假名）轉換為高品質的口說音訊。

#### Scenario: 基本播放 (Basic Playback)

- **WHEN** 一段文字傳遞給 `speak` 函式時
- **THEN** 系統 SHALL 呼叫 `window.speechSynthesis` 並設定 `lang="ja-JP"`
- **THEN** 語音應以適合學習者的標準語速 (0.9 - 1.0) 進行播放

### Requirement: 播放安全性

語音合成系統 SHALL 在不支援語音的環境中能優雅地處理。

#### Scenario: 瀏覽器不支援

- **WHEN** 使用者的瀏覽器不支援 `SpeechSynthesis` 時
- **THEN** 呼叫 `speak` SHALL 靜默失敗，不得中斷應用程式流程
