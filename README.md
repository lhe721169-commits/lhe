# 종성的 iPhone · KakaoTalk Story

一个可在手机浏览器和桌面浏览器中体验的虚构 iPhone 模拟器。所有联系人、聊天和 App 内容均为本地演示数据，不会拨打真实电话、发送真实消息或连接第三方账户。

## 预览

- 仓库： https://github.com/lhe721169-commits/lhe
- 主要界面：锁屏、密码解锁、iPhone 主屏幕、KakaoTalk 聊天、Naver 搜索历史，以及电话、短信、相机、照片、YouTube、X、备忘录、Instagram、天气和日历的模拟页面。
- 锁屏密码：`0420`
- KakaoTalk 联系人顺序：`ㅇㅇ`、`제이크`、`엄마`

## 本地启动

需要安装 Node.js（建议使用当前 LTS 版本）。

```bash
npm install
npm run dev
```

在终端输出的本地地址打开预览。生产构建：

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **GitHub Actions**。
3. 在仓库中新建适用于 Vite + React + TypeScript 的 Pages workflow；构建命令使用 `npm ci`（若仓库没有 lockfile 则使用 `npm install`）和 `npm run build`，发布目录为 `dist`。
4. 确认 Vite 的 `base` 配置匹配仓库路径 `/lhe/`，再提交 workflow。
5. 等待 Actions 工作流成功后，从 Settings → Pages 打开 GitHub Pages 地址。

注意：仓库代码已提交并不代表 GitHub Pages 已自动发布；需要完成上述 Pages 配置并确认工作流成功。

## 修改内容

- 主要界面与交互：`src/App.tsx`
- 页面样式：`src/index.css`
- 聊天与 App 模拟数据：`src/data.ts`（若仓库中对应数据文件使用其他路径，请以实际目录为准）
- 完整需求说明：`CODEX_PROMPT.md`

日期中的 `20xx`、`xx` 等占位符属于故事设定，保留原样。所有展示的社交动态、天气、照片、视频及聊天均为虚构模拟内容。
