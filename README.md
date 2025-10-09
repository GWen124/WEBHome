# WebHome - 个人主页

一个基于 Vue 3 + TypeScript + Vite 构建的现代化个人主页模板，支持响应式设计、主题切换、拖拽交互等功能。

## ✨ 特性

### 🎨 界面设计
- **现代化 UI**：简洁美观的卡片式布局
- **响应式设计**：完美适配桌面端、平板、手机
- **主题切换**：支持明暗主题和跟随系统
- **动画效果**：流畅的过渡动画和交互反馈

### 🔧 技术特性
- **Vue 3**：使用 Composition API 和 `<script setup>`
- **TypeScript**：完整的类型支持
- **Vite**：快速的构建工具
- **图标系统**：基于 @vicons/fa 的图标库
- **字体系统**：支持自定义字体加载

### 📱 交互功能
- **拖拽翻页**：支持鼠标拖拽和触摸滑动
- **滚轮翻页**：触控板横向滚动支持
- **分页导航**：点击分页点快速跳转
- **链接跳转**：卡片点击打开外部链接

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📁 项目结构

```
src/
├── App.vue              # 主应用组件
├── main.ts              # 应用入口文件
├── config.ts            # 站点配置文件
├── IconMap.ts           # 图标映射管理
├── style.css            # 全局样式
└── components/          # 组件目录
    ├── HeaderBar.vue    # 头部导航栏
    ├── IntroBlock.vue   # 首页介绍区块
    ├── LinksBlock.vue   # 链接卡片区块
    ├── FooterBar.vue    # 页脚组件
    └── SocialLinks.vue  # 社交链接组件
```

## ⚙️ 配置说明

### 站点配置 (`src/config.ts`)

#### 基础信息
```typescript
export const SITE_CONFIG = {
  // 页面标题
  PAGE_TITLE: 'Wen｜主页',
  
  // 头部品牌标识（格式：图标名称|品牌文字）
  HEADER_BRAND: 'Pushed|人生寂寞，知己难求。',
  
  // 首页介绍
  INTRO_TITLE: 'Hello World !',
  INTRO_SUBTITLE: '一个建立于 21 世纪的小站，存活于互联网的边缘。',
  
  // 页脚信息
  SITE_FOUNDED_DATE: '2025-10-01',
  FOOTER_SITE: 'GW124.TOP',
  FOOTER_SITE_URL: 'https://gw124.top/',
  FOOTER_SOCIAL_ENABLED: true,
}
```

#### 字体配置
```typescript
// 全局字体
GLOBAL_FONT: '',

// 专用字体
HEADER_FONT: '',
INTRO_TITLE_FONT: 'brand',
INTRO_SUBTITLE_FONT: '',
FOOTER_SITE_FONT: '',
FOOTER_LINKS_FONT: '',
FOOTER_COPYRIGHT_FONT: 'brand',
FOOTER_SOCIAL_FONT: 'brand'
```

### 数据文件

#### 站点链接 (`public/assets/siteLinks.json`)
```json
[
  {
    "icon": "Blog",
    "name": "博客",
    "description": "个人博客，分享美好生活。",
    "link": "https://blog.gw124.top/"
  }
]
```

#### 社交链接 (`public/assets/socialLinks.json`)
```json
[
  {
    "name": "Github",
    "icon": "Github",
    "url": "https://github.com/GWen124"
  }
]
```

## 🎨 自定义指南

### 添加新图标
1. 在 `src/IconMap.ts` 中导入图标：
```typescript
import { NewIcon } from '@vicons/fa';

export const siteIcon: Record<string, Component> = {
  // ... 现有图标
  NewIcon,
};
```

2. 在配置文件中使用：
```typescript
HEADER_BRAND: 'NewIcon|我的品牌',
```

### 添加新链接
在 `public/assets/siteLinks.json` 中添加新条目：
```json
{
  "icon": "IconName",
  "name": "链接名称",
  "description": "链接描述",
  "link": "https://example.com"
}
```

### 自定义字体
1. 将字体文件放入 `public/fonts/` 目录
2. 在配置中设置字体名称：
```typescript
GLOBAL_FONT: 'CustomFont',
INTRO_TITLE_FONT: 'CustomFont',
```

### 主题定制
修改 `src/style.css` 中的 CSS 变量：
```css
:root {
  --bg-color: #ffffff;
  --text-color: #222222;
  --text-muted: #666666;
  --border-color: #e5e5e5;
  --card-bg: #ffffff;
  --card-border: rgba(0,0,0,0.10);
  --shadow: inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.06);
}
```

## 📱 响应式设计

### 断点设置
- **手机端** (≤480px)：1列布局，3个卡片/页
- **平板竖屏** (481-768px)：2列布局，4个卡片/页
- **平板横屏** (769-1024px)：3列布局，6个卡片/页
- **桌面端** (≥1025px)：3列布局，6个卡片/页

### 交互适配
- **桌面端**：鼠标拖拽、滚轮翻页、悬浮效果
- **移动端**：触摸滑动、点击翻页、优化触摸反馈

## 🔧 技术栈

- **框架**：Vue 3.4.21
- **语言**：TypeScript
- **构建**：Vite 5.2.0
- **图标**：@vicons/fa 0.12.0
- **样式**：CSS3 + CSS 变量

## 📦 部署

### GitHub Pages
项目已配置 GitHub Actions 自动部署：
- 推送到 `main` 分支自动触发构建
- 构建结果部署到 `Web` 分支
- 支持 GitHub Pages 发布

### 手动部署
```bash
# 构建项目
npm run build

# 将 dist/ 目录内容部署到服务器
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [@vicons/fa 图标库](https://www.xicons.org/)
- [项目演示](https://gw124.top/)

---

**WebHome** - 让个人主页更简单、更美观、更现代。
