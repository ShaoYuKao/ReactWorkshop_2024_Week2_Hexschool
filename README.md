# 第二週 - RESTful API 串接

> 2024 React 作品實戰冬季班 - hexschool

本專案支援 Node.js 執行環境，必須要安裝 **v16.0.0 LTS** 以上版本。

此模板提供了一個最小的設置，以便在 Vite 中使用 React，並支持 HMR 和一些 ESLint 規則。

目前，有兩個官方插件可用：

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) 使用 [Babel](https://babeljs.io/) 進行快速刷新
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) 使用 [SWC](https://swc.rs/) 進行快速刷新

### 完成條件

- 請透過 GitHub Repo、GitHub Pages 提交作業（需正常開啟），以方便助教與講師檢視
- 須自行撰寫 React，若有參考同學作業，請附上參考來源
- 請勿將提問的問題寫在程式碼中
- 回報時務必要附上 Discord 名稱、作業等級 .. 等完整繳交內容
- 需至少完成 Lv1 作業等級
- 以上需符合規定，否則會審核失敗

### 此任務你會獲得以下技能

- React 的運行
- Promise
- RESTful API

## 指令列表

- `npm install` - 初次下載該專案後，需要使用 `npm install` 來安裝套件
- `npm run dev` - 啟動開發伺服器
  - 若沒有自動開啟瀏覽器，可嘗試手動在瀏覽器上輸入 `http://localhost:5173/ReactWorkshop_2024_Week2_Hexschool/`
- `npm run build` - 打包專案
- `npm run preview` - 預覽打包後的專案
- `npm run deploy` - 進行自動化部署

## 資料夾結構

當前專案的資料夾及檔案結構如下：

```
|   .copilot-commit-message-instructions.md
|   .gitignore
|   eslint.config.js
|   index.html
|   package-lock.json
|   package.json
|   README.md
|   vite.config.js
|   
+---public
|       vite.svg
|       
\---src
    |   App.css
    |   App.jsx
    |   index.css
    |   main.jsx
    |   
    \---assets
            react.svg
```

**根目錄**

- `.copilot-commit-message-instructions.md`：提供有關提交訊息的規範說明。
- `.gitignore`：列出應該被 Git 忽略的檔案和目錄。
- `eslint.config.js`：ESLint 的配置檔案，用於設定代碼檢查規則。
- `index.html`：專案的主 HTML 檔案，包含應用的根元素。
- `package-lock.json`：鎖定專案依賴版本的檔案。
- `package.json`：專案的配置檔案，包含專案名稱、版本、依賴和腳本等資訊。
- `README.md`：專案的說明文件，包含專案介紹、指令列表和資料夾結構等資訊。
- `vite.config.js`：Vite 的配置檔案，用於設定開發伺服器和打包選項。

**`public/` 資料夾**

- `vite.svg`：Vite 的標誌檔案。

**`src/` 資料夾**

- `App.css`：主要的樣式檔案，包含應用的樣式定義。
- `App.jsx`：主要的 React 元件，負責渲染應用的主要內容。
- `index.css`：全局樣式檔案，包含應用的基本樣式定義。
- `main.jsx`：入口文件，負責渲染 `App` 元件。

**`assets/` 資料夾**

- `react.svg`：React 的標誌檔案。

## 主線任務說明

第二週開始要接觸到課程的 API，是非常重要的一個章節，這份 API 會一直跟到直播班結束，同學們可用此份 API 建立屬於自己的電商資料，請務必在本週的時間內完成。

請**使用 vite** 完成以下需求：

- 使用者可以從登入頁面登入，並轉到後台商品頁面
- 使用者若無登入直接進入商品頁面，會被導回登入頁面
- 使用者可以查看產品列表
- 使用者可以點擊單一產品，查看詳細資訊

### API 申請說明

這個 API 與『 Vue 直播班』是同一個資料庫，因此若已經有帳號了，也可以登入該帳號並**申請一個新的 API 路徑**就好。

若是還沒有帳號，就註冊一個來使用就可以哩～

**課程 API 相關網址：**

- [註冊連結、測試管理平台](https://ec-course-api.hexschool.io/)
- [API 文件](https://hexschool.github.io/ec-courses-api-swaggerDoc/)

登入頁面 API

- [登入串接 POST API](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E7%99%BB%E5%85%A5%E5%8F%8A%E9%A9%97%E8%AD%89/post_v2_admin_signin)
- [驗證登入串接 POST API](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E7%99%BB%E5%85%A5%E5%8F%8A%E9%A9%97%E8%AD%89/post_v2_api_user_check)

產品頁面 API

- [取得產品資料串接 GET API](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0%20-%20%E7%94%A2%E5%93%81%20(Products)/get_v2_api__api_path__admin_products)

頁面模板

- [登入到產品頁面的頁面模板](https://codepen.io/hexschool/pen/zxOzORN)（因這週尚未教到路由，所以會先用 三元運算子 切換畫面呈現）

作業須符合此[作業規範](https://hackmd.io/XbKPYiE9Ru6G0sAfB5PBJw)

## **繳交內容**

1. 您的 Discord 使用者名稱
2. 您的作業等級，請見下方等級表，例如 LV1
3. 作業網址：請提供 GitHub Repo 以及 GitHub Pages 連結，以方便助教與講師檢視
4. 您的專案 env 參數

⭐️ 不用附上登入時的帳號密碼 ⭐️

#### 作業地雷

- GitHub Pages 需正常開啟
- 提問超過 2 個問題批改時間會延長

每週主線任務範例：<https://github.com/hexschool/react-training-chapter-2024>

⭐️ 範例檔案中的 API Path 請換成自己的唷！

### 挑戰等級

- LV 1｜參考程式碼範例，並重新撰寫及補上註解（禁止複製範例程式碼）
- LV 2｜僅使用課程版型，並重新撰寫產品列表的功能
- LV 3｜不使用課程版型完成此功能
