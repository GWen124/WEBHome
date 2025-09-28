<template>
  <div id="app">
    <!-- 桌面端界面 -->
    <div v-if="!isMobile" class="desktop-app">
      <HeaderBar />
      <main class="site-main">
        <IntroBlock />
        <LinksBlock />
      </main>
      <FooterBar />
    </div>
    
    <!-- 移动端界面 -->
    <MobileApp v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HeaderBar from './components/HeaderBar.vue';
import IntroBlock from './components/IntroBlock.vue';
import LinksBlock from './components/LinksBlock.vue';
import FooterBar from './components/FooterBar.vue';
import MobileApp from './components/MobileApp.vue';

// 移动端检测
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>


