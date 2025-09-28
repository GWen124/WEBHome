<template>
  <div ref="socialRef" class="footer-social">
    <a v-for="item in socials" :key="item.name" :href="item.url" target="_blank" rel="noopener" class="clickable">
      <span class="icon">
        <Icon size="16"><component :is="iconMap[item.icon] || DefaultIcon" /></Icon>
      </span>
      <span>{{ item.name }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@vicons/utils';
import { Envelope as DefaultIcon } from '@vicons/fa';
import { siteIcon as iconMap } from '../IconMap';

type Social = { name: string; icon: string; url: string };
const socials = ref<Social[]>([]);
const socialRef = ref<HTMLElement>();

onMounted(async () => {
  const res = await fetch('/assets/socialLinks.json');
  if(res.ok){ socials.value = await res.json(); }
});
</script>



