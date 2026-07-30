# 萌寵數學餵養樂園 V7 PWA

## 使用方式
這個版本需要放到網站空間，PWA 安裝與離線功能才會正常運作。
直接用手機點開本機 HTML 時，遊戲仍可玩，但「安裝到手機」與 Service Worker 可能不會啟用。

## 最簡單部署方法：Netlify
1. 到 Netlify。
2. 建立免費帳號。
3. 將整個 `萌寵數學餵養樂園_V7_PWA` 資料夾拖曳到部署區。
4. 等待完成後取得公開網址。
5. 將網址分享給學生或家長。

## 手機安裝
Android Chrome：
1. 開啟公開網址。
2. 點畫面中的「安裝到手機」，或瀏覽器選單中的「加到主畫面」。

iPhone Safari：
1. 開啟公開網址。
2. 點分享按鈕。
3. 選擇「加入主畫面」。

## 檔案
- index.html：遊戲主程式
- manifest.webmanifest：PWA 設定
- service-worker.js：離線快取
- icon-192.svg / icon-512.svg：App 圖示
