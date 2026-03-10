## Summary

提升日語語音合成的發音品質與調整語速滑桿範圍。

## Motivation

目前語速上限 2.0x 對初學者來說過快且不自然。此外，五十音等單個假名的發音過於短促、不像真人，這會降低學習效果。

## Proposed Solution

1.  **限制語速範圍**：將基礎知識頁面的語速滑桿限制在 `0.5x` 到 `1.2x` (預設 `1.0x`)。
2.  **優化發音聽感**：在 `speak` 工具函式中，針對短文字（長度 <= 2）自動於末端注入 `、` (日文頓號)，引導語音引擎產生更自然的尾音衰減。

## Impact

### Affected Specs

- `speech-utility`: 調整 `speak` 函式的處理邏輯與規格。
- `basics-reference`: 更新語速控制範圍。

### Affected Code

- `src/lib/speech.ts`: 修改 `speak` 函式。
- `src/app/basics/page.tsx`: 修改語速滑桿的 `max` 值。
