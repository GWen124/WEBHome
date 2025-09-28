<template>
  <div id="app">
    <HeaderBar />
    <main class="site-main">
      <IntroBlock />
      <LinksBlock />
    </main>
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue';
import IntroBlock from './components/IntroBlock.vue';
import LinksBlock from './components/LinksBlock.vue';
import FooterBar from './components/FooterBar.vue';
</script>


