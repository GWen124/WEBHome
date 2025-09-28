import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import './themes/MyHome/styles.css';
import './themes/MyHome/mobile.css';
import { SITE_CONFIG } from './config';
import { themeManager } from './themes/ThemeManager';

// 设置页面标题
if (SITE_CONFIG.PAGE_TITLE) {
  document.title = SITE_CONFIG.PAGE_TITLE;
}

// 字体配置初始化函数
function initFontConfig() {
  const root = document.documentElement;
  
  // 设置全局字体变量
  const globalFont = SITE_CONFIG.GLOBAL_FONT || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  root.style.setProperty('--global-font', globalFont);
  
  // 设置各模块字体变量
  const fontConfigs = [
    { key: 'header', value: SITE_CONFIG.HEADER_FONT },
    { key: 'intro-title', value: SITE_CONFIG.INTRO_TITLE_FONT },
    { key: 'intro-subtitle', value: SITE_CONFIG.INTRO_SUBTITLE_FONT },
    { key: 'footer-site', value: SITE_CONFIG.FOOTER_SITE_FONT },
    { key: 'footer-social', value: SITE_CONFIG.FOOTER_SOCIAL_FONT }
  ];
  
  // 处理普通字体配置
  fontConfigs.forEach(({ key, value }) => {
    const cssVarName = `--${key}-font`;
    if (value && value.trim() !== '') {
      const fontValue = `"${value}", var(--global-font)`;
      root.style.setProperty(cssVarName, fontValue);
    } else {
      root.style.setProperty(cssVarName, 'var(--global-font)');
    }
  });
  
  // 处理页脚版权字体
  const footerCopyrightFont = SITE_CONFIG.FOOTER_COPYRIGHT_FONT;
  if (footerCopyrightFont && footerCopyrightFont.trim() !== '') {
    const fontValue = `"${footerCopyrightFont}", var(--global-font)`;
    root.style.setProperty('--footer-copyright-font', fontValue);
  } else {
    root.style.setProperty('--footer-copyright-font', 'var(--global-font)');
  }
  
  // 处理页脚链接字体（特殊优先级规则）
  const footerLinksFont = SITE_CONFIG.FOOTER_LINKS_FONT;
  if (footerLinksFont && footerLinksFont.trim() !== '') {
    // FOOTER_LINKS_FONT 有设置，优先使用
    const fontValue = `"${footerLinksFont}", var(--global-font)`;
    root.style.setProperty('--footer-links-font', fontValue);
  } else {
    // FOOTER_LINKS_FONT 留空，采用 FOOTER_COPYRIGHT_FONT
    if (footerCopyrightFont && footerCopyrightFont.trim() !== '') {
      const fontValue = `"${footerCopyrightFont}", var(--global-font)`;
      root.style.setProperty('--footer-links-font', fontValue);
    } else {
      root.style.setProperty('--footer-links-font', 'var(--global-font)');
    }
  }
}

// 初始化字体配置
initFontConfig();

// 初始化主题管理器
themeManager.init();

// 全局禁用右键菜单
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
});

// 全局禁用选择文本
document.addEventListener('selectstart', (e) => {
  e.preventDefault();
  return false;
});

// 全局禁用拖拽
document.addEventListener('dragstart', (e) => {
  e.preventDefault();
  return false;
});

createApp(App).mount('#app');


