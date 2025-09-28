<template>
  <div class="mobile-app">
    <!-- 移动端头部 -->
    <header class="mobile-header">
      <div class="mobile-container">
        <div class="mobile-header-content">
          <a href="#" class="mobile-logo" @click="goHome">
            <Icon v-if="headerIcon" size="18" class="header-icon">
              <component :is="iconMap[headerIcon] || Server" />
            </Icon>
            {{ headerText }}
          </a>
          <div class="mobile-theme-switcher" @click="toggleTheme">
            <Icon size="20">
              <component :is="currentThemeIcon" />
            </Icon>
          </div>
        </div>
      </div>
    </header>

    <!-- 移动端主要内容 -->
    <main class="mobile-main">
      <div class="mobile-container">
        <!-- 介绍区域 -->
        <section class="mobile-intro mobile-fade-in">
          <h1>{{ introTitle }}</h1>
          <p>{{ introSubtitle }}</p>
        </section>

        <!-- 链接网格 -->
        <section class="mobile-links-section">
          <div class="mobile-links-viewport" 
               @touchstart="handleTouchStart" 
               @touchmove="handleTouchMove" 
               @touchend="handleTouchEnd"
               @mousedown="handleMouseDown" 
               @mousemove="handleMouseMove" 
               @mouseup="handleMouseUp">
            <div class="mobile-links-track" :style="{ transform: `translateX(calc(-${currentPage * 100}%))` }">
              <div class="mobile-links-grid" v-for="(page, pageIndex) in paginatedLinks" :key="pageIndex">
                <a 
                  v-for="item in page" 
                  :key="item.name" 
                  :href="item.link" 
                  target="_blank" 
                  rel="noopener"
                  class="mobile-link-card"
                >
                  <div class="icon">
                    <Icon size="28">
                      <component :is="iconMap[item.icon] || Link" />
                    </Icon>
                  </div>
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.description }}</p>
                </a>
              </div>
            </div>
          </div>
          
          <!-- 分页指示器 -->
          <div class="mobile-pagination" v-if="totalPages > 1">
            <div 
              v-for="page in totalPages" 
              :key="page" 
              class="mobile-pagination-dot"
              :class="{ active: page - 1 === currentPage }"
              @click="goToPage(page - 1)"
            ></div>
          </div>
        </section>
      </div>
    </main>

    <!-- 移动端页脚 -->
    <footer class="mobile-footer">
      <div class="mobile-container">
        <div class="mobile-footer-content">
          <div class="mobile-footer-copyright">
            <span v-if="cfg.FOOTER_SITE">
              © {{ copyrightYear }} 
              <a :href="cfg.FOOTER_SITE_URL" target="_blank" rel="noopener">{{ cfg.FOOTER_SITE }}</a>
            </span>
            <span v-if="cfg.FOOTER_SITE"> · </span>
            <span>
              Powered By 
              <a href="https://github.com/GWen124/WEBHome" target="_blank" rel="noopener">Wen</a>
            </span>
          </div>
          <div class="mobile-footer-social" v-if="cfg.FOOTER_SOCIAL_ENABLED">
            <a v-for="item in socials" :key="item.name" :href="item.url" target="_blank" rel="noopener">
              <Icon size="16">
                <component :is="iconMap[item.icon] || DefaultIcon" />
              </Icon>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@vicons/utils';
import { Server, Link, Sun, Moon, Desktop } from '@vicons/fa';
import { siteIcon as iconMap } from '../IconMap';
import { SITE_CONFIG as cfg } from '../config';
import { themeManager } from '../themes/ThemeManager';

// 默认图标
const DefaultIcon = Server;

// 类型定义
type LinkItem = { icon: string; name: string; description: string; link: string };
type Social = { name: string; icon: string; url: string };

// 响应式数据
const links = ref<LinkItem[]>([]);
const socials = ref<Social[]>([]);
const currentTheme = ref<'light' | 'dark' | 'auto'>('auto');

// 翻页相关
const currentPage = ref(0);
const itemsPerPage = 4; // 每页显示4个卡片
const dragging = ref(false);
const startX = ref(0);
const currentX = ref(0);

// 主题图标映射
const themeIcons = {
  light: Sun,
  dark: Moon,
  auto: Desktop
};

// 计算属性
const currentThemeIcon = computed(() => themeIcons[currentTheme.value]);

const headerParts = computed(() => {
  const parts = cfg.HEADER_BRAND.split('|');
  return {
    icon: parts[0] || '',
    text: parts[1] || cfg.HEADER_BRAND
  };
});

const headerIcon = computed(() => headerParts.value.icon);
const headerText = computed(() => headerParts.value.text);

const introTitle = computed(() => cfg.INTRO_TITLE);
const introSubtitle = computed(() => cfg.INTRO_SUBTITLE);

const copyrightYear = computed(() => {
  const foundedDate = cfg.SITE_FOUNDED_DATE;
  if (!foundedDate) return new Date().getFullYear();
  
  let foundedYear: number;
  if (foundedDate.includes('-') || foundedDate.includes('/')) {
    foundedYear = new Date(foundedDate).getFullYear();
  } else {
    foundedYear = parseInt(foundedDate);
  }
  
  const currentYear = new Date().getFullYear();
  
  if (foundedYear > currentYear) {
    return currentYear;
  }
  
  if (foundedYear === currentYear) {
    return currentYear.toString();
  }
  
  return `${foundedYear}-${currentYear}`;
});

// 分页计算
const paginatedLinks = computed(() => {
  const pages: LinkItem[][] = [];
  for (let i = 0; i < links.value.length; i += itemsPerPage) {
    pages.push(links.value.slice(i, i + itemsPerPage));
  }
  return pages;
});

const totalPages = computed(() => paginatedLinks.value.length);

// 方法
const goHome = () => {
  if (window.location.hash) {
    window.location.hash = '';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleTheme = () => {
  const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
  const currentIndex = themes.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];
  
  currentTheme.value = nextTheme;
  themeManager.switchMode(nextTheme);
};

// 翻页方法
const goToPage = (page: number) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
  }
};

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    dragging.value = true;
    startX.value = e.touches[0].clientX;
    currentX.value = e.touches[0].clientX;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (dragging.value && e.touches.length === 1) {
    e.preventDefault();
    currentX.value = e.touches[0].clientX;
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  if (dragging.value) {
    const deltaX = currentX.value - startX.value;
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentPage.value > 0) {
        // 向右滑动，上一页
        currentPage.value--;
      } else if (deltaX < 0 && currentPage.value < totalPages.value - 1) {
        // 向左滑动，下一页
        currentPage.value++;
      }
    }
    
    dragging.value = false;
  }
};

// 鼠标事件处理（用于桌面端测试）
const handleMouseDown = (e: MouseEvent) => {
  dragging.value = true;
  startX.value = e.clientX;
  currentX.value = e.clientX;
};

const handleMouseMove = (e: MouseEvent) => {
  if (dragging.value) {
    currentX.value = e.clientX;
  }
};

const handleMouseUp = () => {
  if (dragging.value) {
    const deltaX = currentX.value - startX.value;
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentPage.value > 0) {
        currentPage.value--;
      } else if (deltaX < 0 && currentPage.value < totalPages.value - 1) {
        currentPage.value++;
      }
    }
    
    dragging.value = false;
  }
};

// 生命周期
onMounted(async () => {
  // 加载链接数据
  try {
    const linksRes = await fetch('/assets/siteLinks.json');
    if (linksRes.ok) {
      links.value = await linksRes.json();
    }
  } catch (error) {
    console.error('Failed to load links:', error);
  }
  
  // 加载社交链接数据
  try {
    const socialRes = await fetch('/assets/socialLinks.json');
    if (socialRes.ok) {
      socials.value = await socialRes.json();
    }
  } catch (error) {
    console.error('Failed to load social links:', error);
  }
  
  // 获取当前主题
  currentTheme.value = themeManager.getCurrentMode();
});
</script>

<style scoped>
/* 移动端专用样式 */
.mobile-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  color: var(--text-color);
}

.mobile-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  color: var(--text-color);
}

.mobile-theme-switcher {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.mobile-theme-switcher:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.mobile-main {
  flex: 1;
  padding: 20px 0;
}

.mobile-intro {
  text-align: center;
  padding: 40px 0 30px;
}

.mobile-intro h1 {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 16px;
  line-height: 1.1;
  color: var(--text-color);
}

.mobile-intro p {
  font-size: 16px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
  max-width: 300px;
  margin: 0 auto;
}

.mobile-links-section {
  margin-bottom: 30px;
}

.mobile-links-viewport {
  overflow: hidden;
  width: 100%;
  position: relative;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
}

.mobile-links-track {
  display: flex;
  transition: transform 0.3s ease;
  width: 100%;
}

.mobile-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 16px;
  min-width: 100%;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}

.mobile-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.mobile-pagination-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.mobile-pagination-dot.active {
  background: var(--text-color);
  opacity: 1;
  transform: scale(1.2);
}

.mobile-pagination-dot:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.mobile-link-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  min-height: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.mobile-link-card:active {
  transform: scale(0.96);
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.mobile-link-card .icon {
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--text-color);
  flex-shrink: 0;
}

.mobile-link-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--text-color);
  line-height: 1.2;
  flex-shrink: 0;
}

.mobile-link-card p {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

.mobile-footer {
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 24px 0 20px;
  margin-top: auto;
}

.mobile-footer-content {
  text-align: center;
}

.mobile-footer-copyright {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
  line-height: 1.4;
}

.mobile-footer-copyright a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
}

.mobile-footer-social {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.mobile-footer-social a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
}

.mobile-footer-social a:active {
  transform: scale(0.95);
  background: var(--card-bg);
}

.mobile-footer-social .icon {
  font-size: 16px;
}

/* 动画 */
.mobile-fade-in {
  animation: mobileFadeIn 0.6s ease-out;
}

@keyframes mobileFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-link-card {
  animation: mobileCardSlideIn 0.4s ease-out;
}

.mobile-links-grid:nth-child(1) .mobile-link-card:nth-child(1) { animation-delay: 0.1s; }
.mobile-links-grid:nth-child(1) .mobile-link-card:nth-child(2) { animation-delay: 0.2s; }
.mobile-links-grid:nth-child(1) .mobile-link-card:nth-child(3) { animation-delay: 0.3s; }
.mobile-links-grid:nth-child(1) .mobile-link-card:nth-child(4) { animation-delay: 0.4s; }
.mobile-links-grid:nth-child(2) .mobile-link-card:nth-child(1) { animation-delay: 0.1s; }
.mobile-links-grid:nth-child(2) .mobile-link-card:nth-child(2) { animation-delay: 0.2s; }
.mobile-links-grid:nth-child(2) .mobile-link-card:nth-child(3) { animation-delay: 0.3s; }
.mobile-links-grid:nth-child(2) .mobile-link-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes mobileCardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 深色模式 */
:global(.dark) .mobile-theme-switcher {
  background: #1a1a1a;
  border-color: #333;
}

:global(.dark) .mobile-link-card {
  background: #1a1a1a;
  border-color: #333;
}

:global(.dark) .mobile-footer {
  background: #1a1a1a;
  border-color: #333;
}

:global(.dark) .mobile-footer-social a {
  background: #0f0f0f;
  border-color: #333;
}
</style>
