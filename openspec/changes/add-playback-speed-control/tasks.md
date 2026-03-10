## 1. 狀態與持久化 (State & Persistence)

- [x] 1.1 在 `BasicsPage` 中新增 `playbackRate` 狀態，預設值為 `1.0`。
- [x] 1.2 在 `useEffect` 中實作從 `localStorage` 讀取並初始化 `playbackRate` 的邏輯（鍵名：`basics-speech-rate`）。
- [x] 1.3 實作 `handleRateChange` 函式，用於同步更新狀態與 `localStorage`。

## 2. UI 元件實作 (UI Components)

- [x] 2.1 在工具欄 (`Toolbar`) 中新增語速調整區域，包含 `input[type="range"]` 滑桿。
- [x] 2.2 為滑桿設定 `min=0.5`, `max=2.0`, `step=0.1` 屬性。
- [x] 2.3 新增即時數值顯示（例如 `1.0x`），並確保其樣式符合 Sakura 主題色。
- [x] 2.4 實作條件渲染邏輯：僅當 `autoPlay` 為 `true` 時才顯示語流調整區域。

## 3. 播放邏輯整合 (Integration)

- [x] 3.1 更新 `KanaCard` 與 `BasicsCard` 的 Props 定義，傳入 `playbackRate`。
- [x] 3.2 在 `BasicsCard` 的 `handleClick` 與喇叭點擊事件中，將 `playbackRate` 傳遞給 `speak()` 函式。
- [x] 3.3 在 `KanaCard` 的 `handleClick` 與喇叭點擊事件中，將 `playbackRate` 傳遞給 `speak()` 函式。
