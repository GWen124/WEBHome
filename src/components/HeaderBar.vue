<template>
  <header class="site-header">
    <div class="container">
      <div class="header-content" @click="goHome">
        <Icon v-if="headerIcon" size="18" class="header-icon">
          <component :is="iconMap[headerIcon] || Server" />
        </Icon>
        <strong>{{ headerText }}</strong>
      </div>
      <ThemeSwitcher />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SITE_CONFIG as cfg } from '../config';
import { Icon } from '@vicons/utils';
import { Server } from '@vicons/fa';
import { siteIcon as iconMap } from '../IconMap';
import ThemeSwitcher from './ThemeSwitcher.vue';

// 解析合并的品牌标识：图标名称|品牌名称，用|分隔
const headerParts = computed(() => {
  const parts = cfg.HEADER_BRAND.split('|');
  return {
    icon: parts[0] || '',
    text: parts[1] || cfg.HEADER_BRAND
  };
});

const headerIcon = computed(() => headerParts.value.icon);
const headerText = computed(() => headerParts.value.text);

// 点击回到主页
const goHome = () => {
  // 如果当前页面有hash，清除hash并滚动到顶部
  if (window.location.hash) {
    window.location.hash = '';
  }
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // 如果是单页应用，可以在这里添加路由跳转逻辑
  // 目前是静态页面，所以只需要滚动到顶部即可
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  opacity: 1 !important;
}

.header-content:hover {
  opacity: 0.7;
}

.header-icon {
  color: var(--text-color) !important;
  margin: 0;
  padding: 0;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.header-content strong {
  margin: 0 !important;
  padding: 0;
  line-height: 1;
  letter-spacing: 0;
  color: var(--text-color) !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  font-family: var(--header-font) !important;
}

</style>


