## Why

不同程度的日語學習者對語音發音的速度需求各異。初學者需要極慢速（如 0.5x - 0.7x）來聽清假名的構成；進階學習者則希望以正常速度（1.0x）或更快（1.2x+）來測試反應力。提供自定義語速功能可讓應用程式更貼合個人化學習進度。

## What Changes

- 在 **基礎知識頁面** (`src/app/basics/page.tsx`) 的工具欄中整合一個語速滑桿 (Speed Slider)。
- 語速範圍定義：0.5x 至 2.0x (以 0.1 為單位進位)。
- 當「播放發音」開關開啟時，滑桿才會顯示。
- 語速設定與播放行為連動：點擊卡片發音時，SHALL 套用當前選定的語速。
- 語速設定 SHALL 持久化（存入 `localStorage`），以便下次進入頁面時能恢復。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `basics-reference`: 加入語速調整功能的需求定義。

## Impact

- 受影響的規格: `basics-reference` (delta)
- 受影響的代碼:
  - `src/app/basics/page.tsx`
