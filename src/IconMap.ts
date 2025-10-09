// 图标集中管理：在这里按需从 @vicons/fa 引入，并导出统一映射
// 可前往 https://www.xicons.org 复制名称追加到此处
// 严格按 DOCS_XICONS.md 的写法：在代码里按需引入并集中导出映射
// 可前往 https://www.xicons.org 自行挑选并在此处引入（fa 类别）
import {
  Link,
  Blog,
  Cloud,
  Safari,
  Servicestack,
  Server,
  Icons,
  Unlock,
  Rocket,
  Images,
  Image,
  Book,
  Telegram,
  Envelope,
  Github,
  Pushed,
  ExternalLinkAlt,
  Markdown,
  Clock,
} from '@vicons/fa';

import type { Component } from 'vue';

export const siteIcon: Record<string, Component> = {
  Link,
  Blog,
  Cloud,
  Safari,
  Servicestack,
  Server,
  Icons,
  Unlock,
  Rocket,
  Images,
  Image,
  Book,
  Telegram,
  Envelope,
  Github,
  Pushed,
  ExternalLinkAlt,
  Markdown,
  Clock,
};


