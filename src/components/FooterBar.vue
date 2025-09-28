<template>
  <footer ref="footerRef" class="site-footer">
    <div class="container">
      <span v-if="cfg.FOOTER_SITE">
        © {{ copyrightYear }} 
        <a :href="cfg.FOOTER_SITE_URL" target="_blank" rel="noopener" class="clickable">{{ cfg.FOOTER_SITE }}</a>
      </span>
      <span v-if="cfg.FOOTER_SITE"> · </span>
      <span>
        Powered By 
        <a href="https://github.com/GWen124/WEBHome" target="_blank" rel="noopener" class="clickable">Wen</a>
      </span>
    </div>
    <SocialLinks v-if="cfg.FOOTER_SOCIAL_ENABLED" />
  </footer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import SocialLinks from './SocialLinks.vue';
import { SITE_CONFIG as cfg } from '../config';

// 获取footer引用
const footerRef = ref<HTMLElement>();

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


</script>

<style scoped>
/* 页脚链接文字字体 */
.site-footer a[href*="gw124.top"],
.site-footer a[href*="github.com"] {
  font-family: var(--footer-links-font, var(--footer-site-font, var(--global-font))) !important;
}

/* 页脚版权信息字体 */
.site-footer .container {
  font-family: var(--footer-copyright-font, var(--global-font)) !important;
}

/* 页脚社交模块字体 */
.footer-social {
  font-family: var(--footer-social-font, var(--global-font)) !important;
}
</style>


