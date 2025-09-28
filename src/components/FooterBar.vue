<template>
  <footer class="site-footer">
    <div class="container">
      <span v-if="cfg.FOOTER_SITE">
        © {{ copyrightYear }} 
        <a :href="cfg.FOOTER_SITE_URL" target="_blank" rel="noopener" @click="handleLinkClick" style="user-select: text !important; pointer-events: auto !important; cursor: pointer !important; color: #007bff !important; text-decoration: underline !important;">{{ cfg.FOOTER_SITE }}</a>
      </span>
      <span v-if="cfg.FOOTER_SITE"> · </span>
      <span>
        Powered By 
        <a href="https://github.com/GWen124/WEBHome" target="_blank" rel="noopener" @click="handleLinkClick" style="user-select: text !important; pointer-events: auto !important; cursor: pointer !important; color: #007bff !important; text-decoration: underline !important;">Wen</a>
      </span>
    </div>
    <SocialLinks v-if="cfg.FOOTER_SOCIAL_ENABLED" />
  </footer>
  
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SocialLinks from './SocialLinks.vue';
import { SITE_CONFIG as cfg } from '../config';

// 计算版权年份
const copyrightYear = computed(() => {
  const foundedDate = cfg.SITE_FOUNDED_DATE;
  if (!foundedDate) return new Date().getFullYear();
  
  // 解析建站日期，支持多种格式
  let foundedYear: number;
  if (foundedDate.includes('-') || foundedDate.includes('/')) {
    // 完整日期格式：2024-01-01 或 2024/01/01
    foundedYear = new Date(foundedDate).getFullYear();
  } else {
    // 仅年份格式：2024
    foundedYear = parseInt(foundedDate);
  }
  
  const currentYear = new Date().getFullYear();
  
  // 如果建站年份大于当前年份，使用当前年份
  if (foundedYear > currentYear) {
    return currentYear;
  }
  
  // 如果建站年份等于当前年份，只显示当前年份
  if (foundedYear === currentYear) {
    return currentYear.toString();
  }
  
  // 如果建站年份小于当前年份，显示年份范围
  return `${foundedYear}-${currentYear}`;
});

// 处理链接点击事件
function handleLinkClick(event: Event) {
  console.log('Footer link clicked:', event.target);
  // 不阻止默认行为，让链接正常跳转
}
</script>

<style>
/* 页脚链接文字字体 */
.site-footer a[href*="gw124.top"],
.site-footer a[href*="github.com"] {
  font-family: var(--footer-links-font, var(--footer-site-font, var(--global-font))) !important;
  /* 确保链接可点击 */
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* 页脚版权信息字体 */
.site-footer .container {
  font-family: var(--footer-copyright-font, var(--global-font)) !important;
}

/* 页脚社交模块字体 */
.footer-social {
  font-family: var(--footer-social-font, var(--global-font)) !important;
}

/* 确保所有footer链接都可点击 */
.site-footer a {
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  /* 强制覆盖任何可能的样式 */
  display: inline !important;
  position: relative !important;
  z-index: 999 !important;
}

/* 特别针对GW124.TOP和Wen链接 */
.site-footer a[href*="gw124.top"],
.site-footer a[href*="github.com"] {
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  display: inline !important;
  position: relative !important;
  z-index: 999 !important;
  /* 添加明显的视觉反馈 */
  text-decoration: underline !important;
  color: #007bff !important;
}
</style>


