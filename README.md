# 萌寵數學餵養樂園 V11｜永久存檔模組正式版

## V11 核心更新
- 自動讀取 V5、V8、V10 舊存檔並升級至永久存檔格式。
- 保留答題紀錄、題型統計、AI能力值、金幣、背包、每日任務及每隻寵物進度。
- 主存檔、上一版備份及每日備份。
- 存檔損壞時依序嘗試備份與舊版存檔。
- 可匯出 JSON 存檔，也可在其他裝置匯入。
- 程式已拆成 HTML、CSS、遊戲程式、存檔模組及 PWA 模組。

## GitHub 更新
請把解壓縮後的所有檔案與資料夾上傳至 Math-Q Repository 根目錄：

- index.html
- css/
- js/
- manifest.webmanifest
- service-worker.js
- icon-192.svg
- icon-512.svg
- .nojekyll

上傳時覆蓋同名檔案，並保留 css 與 js 資料夾結構。

GitHub Pages 設定仍是：
- Branch：main
- Folder：/(root)

## 注意
GitHub Pages 更新後，瀏覽器可能暫時使用舊的離線快取。重新整理數次，或關閉網站後再重新開啟，即可載入 V11。
