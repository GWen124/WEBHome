<template>
  <header class="site-header">
    <div class="container">
      <div class="header-content" @click="goHome">
        <Icon v-if="headerIcon" size="18" class="header-icon">
          <component :is="iconMap[headerIcon] || Server" />
        </Icon>
        <strong>{{ headerText }}</strong>
      </div>
      <div class="theme-switcher">
        <!-- 桌面端主题切换 -->
        <div class="theme-dropdown desktop-only" @mouseenter="openDropdown" @mouseleave="closeDropdown">
          <!-- 中心扩散效果 -->
          <div class="theme-menu-container" :class="{ 'expanded': isDropdownOpen }">
            <button
              v-for="(mode, index) in themeModes"
              :key="mode.value"
              @click="selectTheme(mode.value)"
              class="theme-menu-item"
              :class="{ 'is-active': themeMode === mode.value }"
              :title="mode.label"
              :style="{ '--delay': `${index * 0.1}s` }"
            >
              <Icon size="16">
                <component :is="mode.icon" />
              </Icon>
            </button>
          </div>
        </div>
        
        <!-- 移动端主题切换 -->
        <div class="mobile-theme-switcher mobile-only">
          <button 
            @click="toggleMobileTheme" 
            class="mobile-theme-btn"
            :title="themeTitle"
          >
            <Icon size="18">
              <component :is="themeIcon" />
            </Icon>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { SITE_CONFIG as cfg } from '../config';
import { Icon } from '@vicons/utils';
import { Server, Sun, Moon, Desktop } from '@vicons/fa';
import { siteIcon as iconMap } from '../IconMap';

// 主题模式类型
type ThemeMode = 'light' | 'dark' | 'auto';

// 主题状态
const themeMode = ref<ThemeMode>('auto');
const isDropdownOpen = ref(false);

// 主题选项配置
const themeModes = [
  { value: 'light', label: '日间模式', icon: Sun },
  { value: 'auto', label: '跟随系统', icon: Desktop },
  { value: 'dark', label: '夜间模式', icon: Moon }
];

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

// 主题图标
const themeIcon = computed(() => {
  switch (themeMode.value) {
    case 'light': return Sun;
    case 'dark': return Moon;
    case 'auto': return Desktop;
    default: return Desktop;
  }
});

// 主题标题
const themeTitle = computed(() => {
  switch (themeMode.value) {
    case 'light': return '日间模式';
    case 'dark': return '夜间模式';
    case 'auto': return '跟随系统';
    default: return '跟随系统';
  }
});

// 打开下拉菜单
const openDropdown = () => {
  isDropdownOpen.value = true;
};

// 关闭下拉菜单
const closeDropdown = () => {
  // 添加小延迟确保动画平滑
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 50);
};

// 移动端主题切换
const toggleMobileTheme = () => {
  const modes: ThemeMode[] = ['light', 'dark', 'auto'];
  const currentIndex = modes.indexOf(themeMode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  selectTheme(modes[nextIndex]);
};

// 选择主题
const selectTheme = (mode: ThemeMode) => {
  themeMode.value = mode;
  isDropdownOpen.value = false; // 选择后关闭菜单
  
  // 保存到本地存储
  localStorage.setItem('theme-mode', themeMode.value);
  
  // 应用主题
  applyTheme();
};

// 应用主题
const applyTheme = () => {
  const root = document.documentElement;
  
  if (themeMode.value === 'auto') {
    // 跟随系统
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  } else if (themeMode.value === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSystemThemeChange = () => {
  if (themeMode.value === 'auto') {
    applyTheme();
  }
};

// 点击回到主页
const goHome = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  // 从本地存储读取主题设置
  const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
  if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
    themeMode.value = savedTheme;
  }
  
  // 应用主题
  applyTheme();
  
  // 监听系统主题变化
  mediaQuery.addEventListener('change', handleSystemThemeChange);
});

onUnmounted(() => {
  // 清理监听器
  mediaQuery.removeEventListener('change', handleSystemThemeChange);
});
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

.theme-switcher {
  display: flex;
  align-items: center;
  position: relative;
  height: 36px; /* 固定高度 */
}

.theme-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  transition: all 0.3s ease; /* 平滑过渡 */
  overflow: hidden; /* 隐藏溢出内容 */
  height: 36px; /* 匹配 switcher 高度 */
}


/* 主题菜单容器 - 中心扩散效果 */
.theme-menu-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 36px; /* 初始只显示中心按钮 */
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 展开状态 - 容器变宽 */
.theme-menu-container.expanded {
  width: 120px;
}

/* 暗色主题按钮样式 */
:global(.dark) .theme-menu-item {
  background: #1f2937 !important;
  border: none !important;
  box-shadow: none !important;
}

.theme-menu-item {
  position: absolute;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  width: 36px;
  height: 36px;
  box-shadow: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--delay, 0s);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  left: 50%;
  top: 50%;
  margin-left: -18px;
  margin-top: -18px;
}

/* 展开时按钮从中心扩散 */
.theme-menu-container.expanded .theme-menu-item {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 收回时按钮动画 - 解决闪烁问题 */
.theme-menu-container:not(.expanded) .theme-menu-item {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按钮位置 - 中心扩散布局 */
.theme-menu-container.expanded .theme-menu-item:nth-child(1) {
  left: 0;
  margin-left: 0;
}

.theme-menu-container.expanded .theme-menu-item:nth-child(2) {
  left: 50%;
  margin-left: -18px;
}

.theme-menu-container.expanded .theme-menu-item:nth-child(3) {
  left: 100%;
  margin-left: -36px;
}

/* 当前激活的按钮始终显示在中心 */
.theme-menu-item.is-active {
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
  z-index: 10;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-menu-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.theme-menu-item.is-active {
  background: transparent;
  color: #374151;
  border: none;
}

:global(.dark) .theme-menu-item {
  color: #9ca3af !important;
}

:global(.dark) .theme-menu-item:hover {
  background: #374151 !important;
  color: #f3f4f6 !important;
}

:global(.dark) .theme-menu-item.is-active {
  background: transparent !important;
  color: #f3f4f6 !important;
  border: none !important;
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
}

/* 暗色主题样式 */
:global(.dark) .theme-dropdown {
  background: transparent;
  border: none;
}


:global(.dark) .header-content {
  opacity: 1 !important;
}

/* 移动端专用主题切换 */
.mobile-theme-switcher {
  display: none;
}

.mobile-theme-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  width: 36px;
  height: 36px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mobile-theme-btn:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}

.mobile-theme-btn:active {
  transform: scale(0.95);
}

:global(.dark) .mobile-theme-btn {
  background: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

:global(.dark) .mobile-theme-btn:hover {
  background: #374151;
  color: #f3f4f6;
  border-color: #4b5563;
}

/* 响应式显示控制 */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  
  .mobile-only {
    display: block !important;
  }
}

@media (min-width: 769px) {
  .desktop-only {
    display: flex !important;
  }
  
  .mobile-only {
    display: none !important;
  }
}
</style>


