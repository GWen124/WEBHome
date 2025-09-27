<template>
  <section class="site-intro">
    <div class="container">
      <h1>{{ cfg.INTRO_TITLE }}</h1>
      <p>{{ cfg.INTRO_SUBTITLE }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { SITE_CONFIG as cfg } from '../config';
</script>

<style scoped>
.site-intro h1 {
  font-family: var(--intro-title-font) !important;
}

.site-intro p {
  font-family: var(--intro-subtitle-font) !important;
}
</style>
