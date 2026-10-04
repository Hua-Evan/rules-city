# GATE 5 路由說明

GATE 5 與 GATE 1～4 同樣位於共同靜態網站根目錄 `dist`；它不是獨立網站，也不需要使用 Gate 5 專屬啟動腳本。

共同路由如下：

- GATE 1：`/`
- GATE 2：`/gate-2/`
- GATE 3：`/gate-3/`
- GATE 4：`/gate-4/`
- GATE 5：`/gate5/`

在既有的《規則之城》網站或其本機預覽中，直接開啟 `/gate5/` 即可。若本機尚未啟動共用服務，請執行專案根目錄的 `start-rules-city-server.ps1`；它會固定在 `http://localhost:4173/` 提供整個 `dist` 網站，GATE 5 不需要另行啟動 `start-gate5-server.ps1`。

備用方式：直接開啟 `dist/gate5/index.html`（`file://`）。Gate 5 的 JS、CSS 與圖片皆採相對路徑；若讀到舊版 Gate 5 state，會自動清除並回到開場。

開發 smoke test：直接開啟 `dist/gate5/smoke-test.html`，或在共同網站服務開啟 `/gate5/smoke-test.html`。

效能／導航 debug 僅在 GATE 5 網址加入 `?gate5debug=1` 時啟用，例如：`/gate5/?gate5debug=1`。一般學生測試網址不會輸出逐次按鈕與對話 log。
