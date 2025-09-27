<template>
  <section class="site-links">
    <div class="container">
      <div class="links-viewport" ref="viewport" 
           @pointerdown="handlePointerDown" @pointermove="handlePointerMove" @pointerup="handlePointerUp" @pointercancel="handlePointerUp" 
           @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave"
           @wheel="handleWheel">
               <div class="links-track" :style="{ transform: `translateX(calc(-${page*100}% + ${dx}px))` }">
                 <div class="grid" v-for="(group, gi) in paged" :key="gi" :style="{ gridTemplateColumns: `repeat(${currentColumns}, 1fr)` }">
            <a v-for="item in group" :key="item.name" class="link-card" :href="item.link" target="_blank" rel="noopener">
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

type LinkItem = { icon: string; name: string; description: string; link: string };
const links = ref<LinkItem[]>([]);
const page = ref(0);
const pageSize = ref(8);
const dx = ref(0);
const dragging = ref(false);
const startX = ref(0);
const viewport = ref<HTMLElement | null>(null);

// 响应式调整每页卡片数量 - 两行显示方案
const updatePageSize = () => {
  // 使用currentColumns的计算结果
  const columns = currentColumns.value;
  
  // 每页卡片数 = 列数 × 2行（保持两行显示）
  pageSize.value = columns * 2;
  
  // 如果当前页超出范围，重置到第一页
  if (page.value >= totalPages.value) {
    page.value = 0;
  }
};

const paged = computed(() => {
  const res: LinkItem[][] = [];
  for(let i=0;i<links.value.length;i+=pageSize.value){
    res.push(links.value.slice(i, i+pageSize.value));
  }
  return res.length ? res : [[]];
});
const totalPages = computed(()=> paged.value.length);

// 动态计算列数 - 固定4列方案
const windowWidth = ref(window.innerWidth);
const currentColumns = computed(() => {
  const width = windowWidth.value;
  
  // 固定4列方案
  if (width <= 480) {
    return 1; // 手机：1列（保持响应式）
  } else if (width <= 768) {
    return 2; // 平板：2列（保持响应式）
  } else {
    return 4; // 其他屏幕：4列
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
  // 如果点击的是卡片链接或分页点，不阻止默认行为
  if ((e.target as HTMLElement).closest('.link-card') || 
      (e.target as HTMLElement).closest('.links-dots')) {
    return;
  }
  
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

function handleDrag(e: MouseEvent | PointerEvent) {
  if (!dragging.value) return;
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
let lastWheelTime = 0;
const wheelCooldown = 300; // 300ms冷却时间，确保只能一页一页翻

function handleWheel(e: WheelEvent) {
  // 仅在横向滚动明显时触发，避免与页面纵向滚动冲突
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    e.preventDefault();
    
    const now = Date.now();
    
    // 检查冷却时间，确保只能一页一页翻
    if (now - lastWheelTime < wheelCooldown) {
      return;
    }
    
    // 更新最后翻页时间
    lastWheelTime = now;
    
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
  windowWidth.value = window.innerWidth;
  updatePageSize();
};

onMounted(async () => {
  const res = await fetch('/assets/siteLinks.json');
  links.value = await res.json();
  
  // 初始化页面大小
  updatePageSize();
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize);
  
  // 添加全局鼠标事件监听器，确保拖拽在组件外部也能正常工作
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
});

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped>
.links-viewport { overflow-x: hidden; overflow-y: hidden; width:100%; cursor: grab; user-select: none; padding-bottom: 0px; }
.links-viewport:active { cursor: grabbing; }
.links-track { display: grid; grid-auto-flow: column; grid-auto-columns: 100%; transition: transform .35s ease; }
.grid { display: grid; gap: 20px; width:100%; justify-items: center; }
.grid .link-card { width: 85%; height: 120px; }
.links-dots{ display:flex; justify-content:center; gap:10px; margin-top: 15px; margin-bottom: 80px; position: relative; z-index: 10; }
.links-dots .dot{ 
  width: 15px; 
  height: 5px; 
  border-radius: 2.5px; 
  background: var(--text-muted); 
  transition: background .25s ease, width .25s ease, transform .2s ease; 
  cursor: pointer; 
}
.links-dots .dot:hover{ 
  transform: scale(1.5); 
}
.links-dots .dot.active{ 
  background: var(--text-color); 
  width: 20px; 
}
.links-dots .dot.active:hover{ 
  transform: scale(1.5); 
}
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
  transition: all .3s ease; 
  cursor: pointer; 
  transform: translateY(0);
}
.link-card:hover { 
  border-color: var(--text-muted); 
  background: var(--bg-color); 
  transform: translateY(-8px);
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
/* 响应式断点由JavaScript动态计算 */
</style>


