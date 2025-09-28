// 主题管理器
import { applyMyHomeTheme, initMyHomeTheme } from './MyHome';

// 主题类型定义
export type ThemeName = 'MyHome';
export type ThemeMode = 'light' | 'dark' | 'auto';

// 主题接口
export interface Theme {
  name: string;
  displayName: string;
  version: string;
  description: string;
  apply: (mode: 'light' | 'dark') => void;
  init: () => () => void;
}

// 主题注册表
const themes: Record<ThemeName, Theme> = {
  MyHome: {
    name: 'MyHome',
    displayName: '我的主页',
    version: '1.0.0',
    description: '简洁现代的个人主页主题',
    apply: applyMyHomeTheme,
    init: initMyHomeTheme
  }
};

// 主题管理器类
export class ThemeManager {
  private currentTheme: ThemeName;
  private currentMode: ThemeMode;
  private cleanup: (() => void) | null = null;

  constructor() {
    this.currentTheme = this.getDefaultTheme();
    this.currentMode = this.getModeFromStorage();
  }

  // 获取默认主题
  private getDefaultTheme(): ThemeName {
    return 'MyHome'; // 默认主题
  }

  // 从本地存储获取主题模式
  private getModeFromStorage(): ThemeMode {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
      return savedMode;
    }
    return 'auto'; // 默认跟随系统
  }

  // 获取当前主题
  getCurrentTheme(): ThemeName {
    return this.currentTheme;
  }

  // 获取当前模式
  getCurrentMode(): ThemeMode {
    return this.currentMode;
  }

  // 切换主题
  switchTheme(themeName: ThemeName): void {
    if (!themes[themeName]) {
      // 主题不存在，静默处理
      return;
    }

    this.currentTheme = themeName;
    this.applyCurrentTheme();
  }

  // 切换模式
  switchMode(mode: ThemeMode): void {
    this.currentMode = mode;
    localStorage.setItem('theme-mode', mode);
    this.applyCurrentTheme();
  }

  // 应用当前主题
  private applyCurrentTheme(): void {
    const theme = themes[this.currentTheme];
    if (!theme) return;

    // 清理之前的主题
    if (this.cleanup) {
      this.cleanup();
    }

    // 应用新主题
    if (this.currentMode === 'auto') {
      // 跟随系统
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.apply(isDark ? 'dark' : 'light');
    } else {
      // 固定模式
      theme.apply(this.currentMode);
    }

    // 初始化主题
    this.cleanup = theme.init();
  }

  // 获取所有可用主题
  getAvailableThemes(): Theme[] {
    return Object.values(themes);
  }

  // 获取主题信息
  getThemeInfo(themeName: ThemeName): Theme | undefined {
    return themes[themeName];
  }

  // 初始化主题管理器
  init(): void {
    this.applyCurrentTheme();
  }

  // 销毁主题管理器
  destroy(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }
}

// 创建全局主题管理器实例
export const themeManager = new ThemeManager();
