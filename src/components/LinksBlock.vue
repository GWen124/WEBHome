<template>
  <section class="site-links">
    <div class="container">
      <div class="links-viewport" ref="viewport" 
           @pointerdown="handlePointerDown" @pointermove="handlePointerMove" @pointerup="handlePointerUp" @pointercancel="handlePointerUp" 
           @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave"
           @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
           @wheel="handleWheel">
               <div class="links-track" :style="{ transform: `translateX(calc(-${page*100}% + ${dx}px))` }">
                 <div class="grid" v-for="(group, gi) in paged" :key="gi" :style="{ gridTemplateColumns: `repeat(${currentColumns}, 1fr)` }">
           <a v-for="(item, idx) in group" :key="item.name + idx" class="link-card" :href="item.link" target="_blank" rel="noopener" :class="{ 'is-placeholder': !item.name }" @click="handleCardClick($event, item)">
          <Icon size="35">
            <component :is="iconMap[item.icon] || Link" />
          </Icon>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
            </a>
          </div>
        </div>
      </div>
             <div class="links-dots">
               <div class="dot" v-for="i in totalPages" :key="i" :class="{ active: i-1===page }" @click="go(i-1)"></div>
             </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Icon } from '@vicons/utils';
import { Link } from '@vicons/fa';
import { siteIcon as iconMap } from '../IconMap';

type LinkItem = { icon: string; name: string; description: string; link: string; isPlaceholder?: boolean };
const links = ref<LinkItem[]>([]);
const page = ref(0);
const pageSize = ref(8);
const dx = ref(0);
const dragging = ref(false);
const startX = ref(0);
const viewport = ref<HTMLElement | null>(null);

// 响应式每页卡片数量
const updatePageSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;
  
  if (width <= 480) {
    // 手机端：1列3行 = 3个卡片
    pageSize.value = 3;
  } else if (width <= 768) {
    // 平板竖屏：2列2行 = 4个卡片
    pageSize.value = 4;
  } else if (width <= 1024 && isLandscape) {
    // 平板横屏：3列2行 = 6个卡片
    pageSize.value = 6;
  } else {
    // 桌面端：3列2行 = 6个卡片
    pageSize.value = 6;
  }
  
  // 如果当前页超出范围，重置到第一页
  if (page.value >= totalPages.value) {
    page.value = 0;
  }
};

const paged = computed(() => {
  const res: LinkItem[][] = [];
  for (let i = 0; i < links.value.length; i += pageSize.value) {
    res.push(links.value.slice(i, i + pageSize.value));
  }
  // 统一每页卡片数量，最后一页用占位补齐，保证网格高度一致
  const last = res[res.length - 1];
  if (last && last.length < pageSize.value) {
    const placeholders: LinkItem[] = Array(pageSize.value - last.length)
      .fill(null)
      .map(() => ({ icon: '', name: '', description: '', link: 'javascript:void(0)' }));
    res[res.length - 1] = last.concat(placeholders);
  }
  return res.length ? res : [[]];
});
const totalPages = computed(()=> paged.value.length);

// 响应式列数计算
const currentColumns = computed(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;
  
  if (width <= 480) {
    return 1; // 手机端：1列
  } else if (width <= 768) {
    return 2; // 平板竖屏：2列
  } else if (width <= 1024 && isLandscape) {
    return 3; // 平板横屏：3列
  } else {
    return 3; // 桌面端：3列
  }
});

  // 简化的翻页函数
  function go(i:number){ 
    if (i >= 0 && i < totalPages.value) {
      page.value = i;
      dx.value = 0;
    }
  }

// 统一的拖拽处理逻辑
function startDrag(e: MouseEvent | PointerEvent) {
  const target = e.target as HTMLElement;
  
  // 检查是否应该阻止拖拽
  const shouldBlockDrag = target.closest('.link-card') || 
                         target.closest('.links-dots') ||
                         target.closest('.site-footer') ||
                         !target.closest('.links-viewport');
  
  if (shouldBlockDrag) return;
  
  e.preventDefault();
  dragging.value = true;
  startX.value = e.clientX;
  
  if (viewport.value) {
    if (e instanceof PointerEvent) {
      viewport.value.setPointerCapture(e.pointerId);
    } else {
      viewport.value.style.cursor = 'grabbing';
    }
  }
}

// 移动端触摸处理状态
const touchState = {
  startX: 0,
  startY: 0,
  isDragging: false,
  startTime: 0,
  lastMoveTime: 0
};

function handleTouchStart(e: TouchEvent) {
  const target = e.target as HTMLElement;
  
  // 点击分页点时不触发拖拽
  if (target.closest('.links-dots')) {
    return;
  }
  
  touchState.startX = e.touches[0].clientX;
  touchState.startY = e.touches[0].clientY;
  touchState.startTime = Date.now();
  touchState.isDragging = false;
  
  // 不立即阻止默认行为，让系统判断是否为滚动
}

function handleTouchMove(e: TouchEvent) {
  if (!e.touches[0]) return;
  
  const now = Date.now();
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const deltaX = Math.abs(touchX - touchState.startX);
  const deltaY = Math.abs(touchY - touchState.startY);
  
  // 节流处理，避免过于频繁的更新
  if (now - touchState.lastMoveTime < 16) { // 60fps
    return;
  }
  touchState.lastMoveTime = now;
  
  // 如果水平移动距离大于垂直移动距离，认为是翻页手势
  if (deltaX > deltaY && deltaX > 12) {
    touchState.isDragging = true;
    e.preventDefault();
    
    if (!dragging.value) {
      dragging.value = true;
      startX.value = touchState.startX;
    }
    
    // 使用更平滑的移动计算
    const moveDistance = touchX - startX.value;
    dx.value = moveDistance * 0.8; // 添加阻尼效果，让滑动更丝滑
  }
}

function handleTouchEnd(e: TouchEvent) {
  const touchDuration = Date.now() - touchState.startTime;
  
  // 若未进入拖拽状态，保持点击行为（打开链接）
  if (!touchState.isDragging) {
    return;
  }
  
  if (!dragging.value) return;
  dragging.value = false;
  touchState.isDragging = false;
  
  // 根据滑动距离和速度决定是否翻页
  const moveDistance = Math.abs(dx.value);
  const moveSpeed = moveDistance / Math.max(touchDuration, 1); // 像素/毫秒
  
  // 动态阈值：距离大于30px 或 速度大于0.5px/ms
  const threshold = moveSpeed > 0.5 ? 15 : 30;
  
  if (moveDistance > threshold) {
    if (dx.value < 0 && page.value < totalPages.value - 1) {
      page.value++;
    } else if (dx.value > 0 && page.value > 0) {
      page.value--;
    }
  }
  dx.value = 0;
}

function handleDrag(e: MouseEvent | PointerEvent) {
  if (!dragging.value) return;
  
  const target = e.target as HTMLElement;
  const shouldBlockDrag = target.closest('.site-footer') || 
                         !target.closest('.links-viewport');
  
  if (shouldBlockDrag) return;
  
  e.preventDefault();
  dx.value = e.clientX - startX.value;
  
  // 如果移动距离很小，不显示拖拽效果
  if (Math.abs(dx.value) < 5) {
    dx.value = 0;
  }
}

function endDrag() {
  if (!dragging.value) return;
  dragging.value = false;
  
  if (viewport.value) {
    viewport.value.style.cursor = 'grab';
  }
  
  // 根据拖拽距离决定翻页阈值（鼠标10px，触控80px）
  const threshold = 10;
  
  if (Math.abs(dx.value) > threshold) {
    if (dx.value < 0 && page.value < totalPages.value - 1) {
      page.value++;
    } else if (dx.value > 0 && page.value > 0) {
      page.value--;
    }
  }
  dx.value = 0;
}

// 处理卡片点击事件
function handleCardClick(e: Event, item: LinkItem) {
  // 如果是占位卡片，阻止点击
  if (!item.name || item.isPlaceholder) {
    e.preventDefault();
    return;
  }
  
  // 如果正在拖拽或移动距离较大，阻止点击
  if (dragging.value || Math.abs(dx.value) > 8) {
    e.preventDefault();
    return;
  }
  
  // 检查是否为快速点击（短时间内的点击）
  const clickDuration = Date.now() - touchState.startTime;
  if (clickDuration < 200 && clickDuration > 0) {
    // 快速点击，允许跳转
    return;
  }
  
  // 允许正常跳转
  // 不需要 preventDefault()，让浏览器正常处理链接跳转
}

// 事件处理器
function handlePointerDown(e: PointerEvent) {
  startDrag(e);
}

function handlePointerMove(e: PointerEvent) {
  handleDrag(e);
}

function handlePointerUp() {
  endDrag();
}

function handleMouseDown(e: MouseEvent) {
  startDrag(e);
}

function handleMouseMove(e: MouseEvent) {
  handleDrag(e);
}

function handleMouseUp() {
  endDrag();
}

function handleMouseLeave() {
  if (dragging.value) {
    endDrag();
  }
}

// 触控板/鼠标滚轮横向滑动（macOS 触控板支持）
const wheelState = {
  lastTime: 0,
  cooldown: 500 // 500ms冷却时间，确保只能一页一页翻
};

function handleWheel(e: WheelEvent) {
  // 仅在横向滚动明显时触发，避免与页面纵向滚动冲突
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    e.preventDefault();
    
    const now = Date.now();
    
    // 检查冷却时间，确保只能一页一页翻
    if (now - wheelState.lastTime < wheelState.cooldown) {
      return;
    }
    
    // 更新最后翻页时间
    wheelState.lastTime = now;
    
    // 限制翻页：只能一页一页翻
    if (e.deltaX > 0 && page.value < totalPages.value - 1) {
      page.value++;
    } else if (e.deltaX < 0 && page.value > 0) {
      page.value--;
    }
  }
}

// 窗口大小变化处理函数
const handleResize = () => {
  updatePageSize();
};

onMounted(async () => {
  const res = await fetch('/assets/siteLinks.json');
  links.value = await res.json();
  
  // 初始化页面大小
  updatePageSize();
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize);
  
});

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.links-viewport { overflow-x: hidden; overflow-y: hidden; width:100%; cursor: grab; padding-bottom: 0px; }
.links-viewport:active { cursor: grabbing; }
.links-track { display: grid; grid-auto-flow: column; grid-auto-columns: 100%; transition: transform .6s cubic-bezier(0.4, 0, 0.2, 1); }
.grid { display: grid; gap: 20px; width:100%; }
.grid .link-card { width: 85%; height: 120px; }
/* 分页点样式 - 与全局样式保持一致 */
.link-card { 
  background: var(--card-bg); 
  border: 1px solid var(--card-border); 
  border-radius: 16px; 
  padding: 24px 20px; 
  text-align: center; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  box-shadow: var(--shadow); 
  text-decoration: none; 
  color: var(--text-color); 
  transition: border-color .2s ease, background-color .2s ease, transform .3s ease, box-shadow .3s ease; 
  cursor: pointer; 
}
.link-card.is-placeholder { visibility: hidden; pointer-events: none; }
/* 桌面版悬浮效果 */
@media (min-width: 1025px) {
  .link-card:hover { 
    transform: translateY(-4px);
    background: var(--bg-color); 
  }
}

/* 移动端和pad端保持原有悬浮效果 */
@media (max-width: 1024px) {
  .link-card:hover { 
    border-color: var(--text-muted); 
    background: var(--bg-color); 
  }
}
.link-card h3 { 
  margin: 8px 0 6px; 
  font-size: 18px; 
  font-weight: 700; 
  color: var(--text-color);
}
.link-card p { 
  margin: 0; 
  color: var(--text-muted); 
  font-size: 14px; 
}
/* 默认桌面端布局 - 3列 */
.grid { 
  grid-template-columns: repeat(3, 1fr); 
  justify-items: center;
  align-items: center;
}

/* 平板竖屏布局 - 2列2行 */
@media (max-width: 768px) and (min-width: 481px) and (orientation: portrait) {
  .links-viewport {
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
    padding: 15px 0;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 20px !important;
    padding: 0 20px;
    max-width: 90%;
    margin: 0 auto;
  }
  
  .link-card {
    width: 100% !important;
    min-height: 110px;
    padding: 18px 16px;
    margin: 0;
    box-sizing: border-box;
  }
  
  .link-card h3 {
    font-size: 16px !important;
    margin: 8px 0 6px !important;
    line-height: 1.2;
  }
  
  .link-card p {
    font-size: 13px !important;
    line-height: 1.3;
    margin: 0;
  }
  
  .links-dots {
    margin-top: 25px;
    margin-bottom: 25px;
  }
  
  .links-dots .dot {
    width: 12px !important;
    height: 4px !important;
  }
  
  .links-dots .dot.active {
    width: 18px !important;
  }
}

/* 平板横屏布局 - 3列2行 */
@media (max-width: 1024px) and (min-width: 769px) and (orientation: landscape) {
  .links-viewport {
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
    padding: 10px 0;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 18px !important;
    padding: 0 30px;
    max-width: 95%;
    margin: 0 auto;
  }
  
  .link-card {
    width: 100% !important;
    min-height: 100px;
    padding: 16px 14px;
    margin: 0;
    box-sizing: border-box;
  }
  
  .link-card h3 {
    font-size: 15px !important;
    margin: 6px 0 4px !important;
    line-height: 1.2;
  }
  
  .link-card p {
    font-size: 12px !important;
    line-height: 1.3;
    margin: 0;
  }
  
  .links-dots {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .links-dots .dot {
    width: 10px !important;
    height: 3px !important;
  }
  
  .links-dots .dot.active {
    width: 16px !important;
  }
}

/* 手机端布局 - 1列3行，居中80% */
@media (max-width: 480px) {
  .links-viewport {
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
    padding: 4px 0;
  }
  
  .grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
    padding: 0;
    max-width: 90%;
    margin: 0 auto;
  }
  
  .link-card {
    width: 100% !important;
    min-height: 90px;
    padding: 16px 20px;
    margin: 0;
    box-sizing: border-box;
  }
  
  .link-card h3 {
    font-size: 15px !important;
    margin: 8px 0 6px !important;
    line-height: 1.2;
  }
  
  .link-card p {
    font-size: 12px !important;
    line-height: 1.3;
    margin: 0;
  }
  
  .links-dots {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .links-dots .dot {
    width: 10px !important;
    height: 4px !important;
  }
  
  .links-dots .dot.active {
    width: 16px !important;
  }
}
</style>


