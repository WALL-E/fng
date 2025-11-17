# FNG — Fear & Greed Index

## 简介（中文）
- 桌面应用（Electron），展示恐慌与贪婪指数的历史曲线
- 支持范围：最近一周、最近一月、最近一年、MAX（全部历史）
- 曲线连续绘制，按区段着色：恐慌为浅红，贪婪为浅绿，其他为蓝色；右上角覆盖 Legend 说明颜色含义
- 语言切换：中文/英文（按钮位于顶部右侧）
- macOS 菜单栏状态图标：体温计 + 最近一天指数，例如“🌡️ 26”（窗口最小化或关闭时常驻）
- 数据来源：alternative.me Fear & Greed Index API
- 版权归属：TRAE

## 快速开始（中文）
- 安装依赖：`npm install`
- 运行：`npm start`

## 打包（中文）
- macOS DMG：`npm run dist` → 产物 `dist/FNG-<版本>.dmg`
- Windows ZIP：`npm run dist:win` → 产物 `dist/FNG-<版本>-win.zip`
- Ubuntu AppImage：`npm run dist:linux` → 产物 `dist/FNG-<版本>.AppImage`
- 注：当前为未签名构建。若用于正式分发，请配置代码签名与（可选）公证。

## API（中文）
- 基本接口：`https://api.alternative.me/fng/?limit=<N>`
- 示例：
  - 最近一周：`?limit=7`
  - 最近一月：`?limit=30`
  - 最近一年：`?limit=365`
  - 全部历史：`?limit=0`
  - 最新一天（菜单栏指数）：`?limit=1`

---

## Overview (English)
- Desktop app (Electron) visualizing the Fear & Greed Index history
- Supported ranges: last week, last month, last year, MAX (all history)
- Continuous line with per-segment coloring: Fear in light red, Greed in light green, Others in blue; color Legend overlays at top-right
- Language switch: Chinese/English (buttons at the top-right)
- macOS status bar: thermometer plus latest day index, e.g. “🌡️ 26” (shown when window is minimized or closed)
- Data source: alternative.me Fear & Greed Index API
- Copyright: TRAE

## Quick Start (English)
- Install dependencies: `npm install`
- Run: `npm start`

## Packaging (English)
- macOS DMG: `npm run dist` → artifact `dist/FNG-<version>.dmg`
- Windows ZIP: `npm run dist:win` → artifact `dist/FNG-<version>-win.zip`
- Ubuntu AppImage: `npm run dist:linux` → artifact `dist/FNG-<version>.AppImage`
- Note: current build is unsigned. For public distribution, set up code signing and notarization.

## API (English)
- Endpoint: `https://api.alternative.me/fng/?limit=<N>`
- Examples:
  - Last week: `?limit=7`
  - Last month: `?limit=30`
  - Last year: `?limit=365`
  - All history: `?limit=0`
  - Latest day (status bar): `?limit=1`