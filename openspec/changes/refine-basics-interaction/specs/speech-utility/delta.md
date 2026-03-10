## MODIFIED Requirements

### Requirement: 語音品質優化 (Speech Quality Optimization)

更新短內容發音補強規則，改用元音拉長 (Elongation) 策略以提升自然度。

#### Scenario: 假名元音延伸 (Trail Correction with Vowel Elongation)

- **WHEN** 傳遞給 `speak()` 函式的文字長度等於 1 個字元且為假名時
- **THEN** 系統 SHALL 自動附加一個日文長音符 `ー` 並移除現有的 `、`
- **AND** 語音輸出 SHALL 呈現更豐沛且平緩的尾音，而非突然斷言
