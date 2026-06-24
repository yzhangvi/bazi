# 玄枢命盘网页部署包

这是一个纯静态网站，入口文件是 `index.html`，可以部署到任何静态网页服务。

## 推荐部署方式

### Vercel
1. 新建 Project。
2. 上传或导入整个 `bazi-site-web` 文件夹。
3. Framework 选择 `Other`。
4. Build Command 留空。
5. Output Directory 填 `.`。
6. 部署完成后即可得到公网网址。

### Netlify
1. 打开 Netlify 的 Sites。
2. 选择手动上传。
3. 上传整个 `bazi-site-web` 文件夹，或上传 `bazi-site-web.zip`。
4. 发布后即可得到公网网址。

### GitHub Pages
1. 把 `bazi-site-web` 里的所有文件提交到仓库。
2. 在仓库 Settings -> Pages 中选择部署分支。
3. 目录选择 `/root`。

## 说明

- 所有资源均为相对路径，可在公网域名下正常加载。
- 用户保存记录使用浏览器 `localStorage`，数据保存在访问者自己的浏览器里。
- 不需要后端服务器和数据库。
