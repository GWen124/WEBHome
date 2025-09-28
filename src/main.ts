import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { SITE_CONFIG } from './config';

// 设置页面标题
if (SITE_CONFIG.PAGE_TITLE) {
  document.title = SITE_CONFIG.PAGE_TITLE;
}

// 加载自定义字体
if (SITE_CONFIG.GLOBAL_FONT && SITE_CONFIG.GLOBAL_FONT.trim() !== '') {
  loadCustomFont(SITE_CONFIG.GLOBAL_FONT);
}

// 加载专用字体
const specificFonts = [
  { name: SITE_CONFIG.HEADER_FONT, target: 'header' },
  { name: SITE_CONFIG.INTRO_TITLE_FONT, target: 'intro-title' },
  { name: SITE_CONFIG.INTRO_SUBTITLE_FONT, target: 'intro-subtitle' },
  { name: SITE_CONFIG.FOOTER_SITE_FONT, target: 'footer-site' },
  { name: SITE_CONFIG.FOOTER_LINKS_FONT, target: 'footer-links' },
  { name: SITE_CONFIG.FOOTER_COPYRIGHT_FONT, target: 'footer-copyright' },
  { name: SITE_CONFIG.FOOTER_SOCIAL_FONT, target: 'footer-social' }
];

specificFonts.forEach(({ name, target }) => {
  if (name && name.trim() !== '') {
    // 有专用字体，加载专用字体
    loadSpecificFont(name, target);
  } else {
    // 没有专用字体，使用全局字体
    setSpecificFontToGlobal(target);
  }
});

// 字体加载函数
function loadCustomFont(fontName: string) {
  // 创建 @font-face 规则
  const fontFace = new FontFace(
    fontName,
    `url(/fonts/${fontName}.ttf) format('truetype')`
  );
  
  // 加载字体
  fontFace.load()
    .then(() => {
      // 将字体添加到文档中
      document.fonts.add(fontFace);
      // 更新 CSS 变量
      document.documentElement.style.setProperty('--global-font', `"${fontName}", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`);
      
      // 更新所有使用全局字体的专用字体变量
      updateSpecificFontsToGlobal();
    })
    .catch(() => {
      // 字体加载失败，使用默认字体
    });
}

// 更新所有专用字体为全局字体
function updateSpecificFontsToGlobal() {
  const specificFonts = [
    { name: SITE_CONFIG.HEADER_FONT, target: 'header' },
    { name: SITE_CONFIG.INTRO_TITLE_FONT, target: 'intro-title' },
    { name: SITE_CONFIG.INTRO_SUBTITLE_FONT, target: 'intro-subtitle' },
    { name: SITE_CONFIG.FOOTER_SITE_FONT, target: 'footer-site' },
    { name: SITE_CONFIG.FOOTER_LINKS_FONT, target: 'footer-links' },
    { name: SITE_CONFIG.FOOTER_COPYRIGHT_FONT, target: 'footer-copyright' },
    { name: SITE_CONFIG.FOOTER_SOCIAL_FONT, target: 'footer-social' }
  ];

  specificFonts.forEach(({ name, target }) => {
    if (!name || name.trim() === '') {
      // 没有专用字体，使用智能回退机制
      setSpecificFontToGlobal(target);
    }
  });
}

// 专用字体加载函数
function loadSpecificFont(fontName: string, target: string) {
  // 创建 @font-face 规则
  const fontFace = new FontFace(
    fontName,
    `url(/fonts/${fontName}.ttf) format('truetype')`
  );
  
  // 加载字体
  fontFace.load()
    .then(() => {
      // 将字体添加到文档中
      document.fonts.add(fontFace);
      // 更新对应的 CSS 变量，专用字体优先
      const cssVarName = `--${target}-font`;
      document.documentElement.style.setProperty(cssVarName, `"${fontName}", var(--global-font)`);
    })
    .catch(() => {
      // 专用字体加载失败时，回退到全局字体
      setSpecificFontToGlobal(target);
    });
}

// 设置专用字体为全局字体
function setSpecificFontToGlobal(target: string) {
  const cssVarName = `--${target}-font`;
  
  // 页脚字体的特殊回退逻辑
  if (target === 'footer-links') {
    // 页脚链接字体：优先使用页脚版权字体，然后是全局字体
    const copyrightFont = SITE_CONFIG.FOOTER_COPYRIGHT_FONT;
    if (copyrightFont && copyrightFont.trim() !== '') {
      document.documentElement.style.setProperty(cssVarName, `"${copyrightFont}", var(--global-font)`);
    } else {
      document.documentElement.style.setProperty(cssVarName, `var(--global-font)`);
    }
  } else if (target === 'footer-copyright') {
    // 页脚版权字体：优先使用页脚链接字体，然后是全局字体
    const linksFont = SITE_CONFIG.FOOTER_LINKS_FONT;
    if (linksFont && linksFont.trim() !== '') {
      document.documentElement.style.setProperty(cssVarName, `"${linksFont}", var(--global-font)`);
    } else {
      document.documentElement.style.setProperty(cssVarName, `var(--global-font)`);
    }
  } else if (target === 'footer-social') {
    // 社交模块字体：直接使用全局字体，不与其他页脚字体合并
    document.documentElement.style.setProperty(cssVarName, `var(--global-font)`);
  } else {
    // 其他字体：直接使用全局字体
    document.documentElement.style.setProperty(cssVarName, `var(--global-font)`);
  }
}

createApp(App).mount('#app');


