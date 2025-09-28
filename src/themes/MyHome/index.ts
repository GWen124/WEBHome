// MyHome 主题配置
export const MyHomeTheme = {
  // 主题基本信息
  name: 'MyHome',
  displayName: '我的主页',
  version: '1.0.0',
  description: '简洁现代的个人主页主题',

  // 颜色配置
  colors: {
    light: {
      '--bg-color': '#ffffff',
      '--text-color': '#222222',
      '--text-muted': '#666666',
      '--border-color': '#e5e5e5',
      '--card-bg': '#ffffff',
      '--card-border': 'rgba(0,0,0,0.10)',
      '--shadow': 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.06)',
    },
    dark: {
      '--bg-color': '#0f0f0f',           // 深黑色背景
      '--text-color': '#e5e5e5',         // 浅灰色文字
      '--text-muted': '#888888',         // 中灰色次要文字
      '--border-color': '#333333',       // 深灰色边框
      '--card-bg': '#1a1a1a',           // 卡片深灰色背景
      '--card-border': 'rgba(255,255,255,0.08)', // 极淡边框
      '--shadow': 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.4)',
    }
  },

  // 字体配置已移至config.ts统一管理

  // 布局配置
  layout: {
    // 响应式断点
    breakpoints: {
      mobile: 480,
      tablet: 768,
      laptop: 1024,
      desktop: 1440,
      large: 1441
    },
    // 链接卡片配置
    linkCards: {
      columns: {
        mobile: 1,
        tablet: 2,
        laptop: 3,
        desktop: 4,
        large: 5
      },
      height: {
        mobile: 100,
        tablet: 110,
        laptop: 120,
        desktop: 120,
        large: 120
      }
    }
  },

  // 动画配置
  animations: {
    transitions: {
      default: '0.3s ease',
      fast: '0.2s ease',
      slow: '0.5s ease'
    },
    hover: {
      scale: 1.5,
      opacity: 0.7
    }
  },

  // 主题特定样式
  styles: {
    // 头部样式
    header: {
      padding: '16px 0',
      brandFontSize: '18px',
      brandFontWeight: '700'
    },
    // 介绍区域样式
    intro: {
      titleFontSize: {
        mobile: '32px',
        tablet: '48px',
        laptop: '56px',
        desktop: '64px',
        large: '64px'
      },
      subtitleFontSize: {
        mobile: '14px',
        tablet: '16px',
        laptop: '18px',
        desktop: '20px',
        large: '20px'
      }
    },
    // 页脚样式
    footer: {
      fontSize: {
        mobile: '13px',
        tablet: '15px',
        laptop: '15px',
        desktop: '15px',
        large: '15px'
      },
      socialGap: {
        mobile: '20px',
        tablet: '30px',
        laptop: '30px',
        desktop: '30px',
        large: '30px'
      }
    }
  }
} as const;


// 主题应用函数
export function applyMyHomeTheme(themeMode: 'light' | 'dark' = 'light') {
  const root = document.documentElement;
  
  // 应用颜色变量
  const colors = MyHomeTheme.colors[themeMode];
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // 设置主题类名
  root.classList.remove('light', 'dark');
  root.classList.add(themeMode);
}

// 主题初始化函数
export function initMyHomeTheme() {
  // 获取当前主题模式
  const savedTheme = localStorage.getItem('theme-mode') || 'auto';
  
  if (savedTheme === 'auto') {
    // 跟随系统主题
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyMyHomeTheme(isDark ? 'dark' : 'light');
  } else {
    // 使用保存的主题模式
    applyMyHomeTheme(savedTheme as 'light' | 'dark');
  }
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    const currentTheme = localStorage.getItem('theme-mode') || 'auto';
    if (currentTheme === 'auto') {
      applyMyHomeTheme(mediaQuery.matches ? 'dark' : 'light');
    }
  };
  
  mediaQuery.addEventListener('change', handleSystemThemeChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  };
}
