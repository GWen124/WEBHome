<template>
  <div class="theme-switcher">
    <div class="theme-dropdown" @mouseenter="openDropdown" @mouseleave="closeDropdown">
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@vicons/utils';
import { Sun, Moon, Desktop } from '@vicons/fa';
import { themeManager, type ThemeMode } from '../themes/ThemeManager';

// 主题状态
const themeMode = ref<ThemeMode>(themeManager.getCurrentMode());
const isDropdownOpen = ref(false);

// 主题选项配置
const themeModes = [
  { value: 'light', label: '日间模式', icon: Sun },
  { value: 'auto', label: '跟随系统', icon: Desktop },
  { value: 'dark', label: '夜间模式', icon: Moon }
];

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

// 选择主题
const selectTheme = (mode: ThemeMode) => {
  themeMode.value = mode;
  isDropdownOpen.value = false; // 选择后关闭菜单
  
  // 使用主题管理器切换模式
  themeManager.switchMode(mode);
};

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSystemThemeChange = () => {
  if (themeMode.value === 'auto') {
    // 主题管理器会自动处理系统主题变化
    themeManager.switchMode('auto');
  }
};

onMounted(() => {
  // 从主题管理器获取当前模式
  themeMode.value = themeManager.getCurrentMode();
  
  // 监听系统主题变化
  mediaQuery.addEventListener('change', handleSystemThemeChange);
});

onUnmounted(() => {
  // 清理监听器
  mediaQuery.removeEventListener('change', handleSystemThemeChange);
});
</script>

<style scoped>
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
</style>
