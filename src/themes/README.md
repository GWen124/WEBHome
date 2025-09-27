# 主题系统说明

## 概述

本项目采用了模块化的主题系统，支持通过环境变量配置和运行时切换主题。

## 目录结构

```
src/themes/
├── MyHome/                 # MyHome主题
│   ├── index.ts           # 主题配置和逻辑
│   └── styles.css         # 主题样式
├── ThemeManager.ts        # 主题管理器
└── README.md             # 说明文档
```

## 主题配置

### 默认主题配置

主题配置在 `config.ts` 中设置：

```typescript
export const SITE_CONFIG = {
  THEME: 'MyHome', // 当前使用的主题
  // ... 其他配置
};

### 主题配置项

每个主题包含以下配置：

- **基本信息**：名称、版本、描述
- **颜色配置**：明暗主题的颜色变量
- **布局配置**：响应式断点和组件尺寸
- **动画配置**：过渡效果和交互动画
- **样式配置**：主题特定的样式设置

**注意**：字体配置已移至 `config.ts` 统一管理，所有主题共享相同的字体配置。

## 使用方法

### 1. 配置默认主题

在 `config.ts` 中修改默认主题：

```typescript
export const SITE_CONFIG = {
  THEME: 'MyHome', // 修改为其他主题
  // ... 其他配置
};
```

### 2. 运行时切换主题

```typescript
import { themeManager } from './themes/ThemeManager';

// 切换主题
themeManager.switchTheme('MyHome');

// 切换模式（明暗）
themeManager.switchMode('dark');
```

### 3. 获取主题信息

```typescript
// 获取当前主题
const currentTheme = themeManager.getCurrentTheme();

// 获取当前模式
const currentMode = themeManager.getCurrentMode();

// 获取所有可用主题
const themes = themeManager.getAvailableThemes();
```

## 创建新主题

### 1. 创建主题目录

```
src/themes/NewTheme/
├── index.ts
└── styles.css
```

### 2. 实现主题配置

```typescript
// src/themes/NewTheme/index.ts
export const NewTheme = {
  name: 'NewTheme',
  displayName: '新主题',
  version: '1.0.0',
  description: '新主题描述',
  
  colors: {
    light: { /* 明色配置 */ },
    dark: { /* 暗色配置 */ }
  },
  
  fonts: { /* 字体配置 */ },
  layout: { /* 布局配置 */ },
  animations: { /* 动画配置 */ },
  styles: { /* 样式配置 */ }
};

export function applyNewTheme(mode: 'light' | 'dark') {
  // 应用主题逻辑
}

export function initNewTheme() {
  // 初始化主题逻辑
}
```

### 3. 注册主题

在 `ThemeManager.ts` 中注册新主题：

```typescript
import { NewTheme, applyNewTheme, initNewTheme } from './NewTheme';

const themes: Record<ThemeName, Theme> = {
  MyHome: { /* ... */ },
  NewTheme: {
    name: 'NewTheme',
    displayName: '新主题',
    version: '1.0.0',
    description: '新主题描述',
    apply: applyNewTheme,
    init: initNewTheme
  }
};
```

## 主题变量

### CSS变量

主题系统使用CSS变量来管理样式，主要变量包括：

- `--bg-color`: 背景色
- `--text-color`: 文字色
- `--text-muted`: 次要文字色
- `--border-color`: 边框色
- `--card-bg`: 卡片背景色
- `--card-border`: 卡片边框色
- `--shadow`: 阴影效果

### 字体变量

- `--global-font`: 全局字体
- `--header-font`: 头部字体
- `--intro-title-font`: 介绍标题字体
- `--intro-subtitle-font`: 介绍副标题字体
- `--footer-site-font`: 页脚站点字体
- `--footer-links-font`: 页脚链接字体
- `--footer-copyright-font`: 页脚版权字体
- `--footer-social-font`: 页脚社交字体

## 注意事项

1. 主题切换会保持用户的模式选择（明暗模式）
2. 系统主题变化只在"跟随系统"模式下生效
3. 主题配置会覆盖默认样式
4. 新增主题需要更新类型定义
5. 主题样式应该与基础样式兼容

## 扩展功能

未来可以扩展的功能：

- 主题预览功能
- 主题自定义编辑器
- 主题导入导出
- 主题市场
- 主题版本管理
