export const SITE_CONFIG = {
  // ==================== 页面标题 ====================
  // 浏览器标签页显示的标题
  PAGE_TITLE: 'Wen｜主页',
  
  // ==================== 头部导航 ====================
  // Logo标识：格式为 "图标名称|Logo文字"，用|分隔
  // 例如：'Server|Wen Home' 显示为 Server图标 + Wen Home文字
  // 如果只需要文字，直接写 'Wen Home'（无图标）
  // 
  // 图标引用说明：
  // 1. 图标名称必须与 @vicons/fa 中的组件名完全一致
  // 2. 可用的图标名称（部分示例）：
  //    - Server, Cloud, Rocket, Book, Images, Icons
  //    - Link, Blog, Safari, Unlock, Camera, Github
  //    - Telegram, Envelope, 等等...
  // 3. 图标名称不区分大小写，但建议使用首字母大写
  // 4. 如果图标名称不存在，会显示默认的 Server 图标
  // 5. 更多图标请访问：https://www.xicons.org/ (选择 fa 类别)
  // 6. 添加新图标需要在 app/src/IconMap.ts 中导入并映射
  HEADER_BRAND: 'Pushed|人生寂寞，知己难求。',

  // ==================== 首页介绍 ====================
  // 主标题：首页中央显示的大标题
  INTRO_TITLE: 'Hello World !',
  // 副标题：主标题下方的描述文字
  INTRO_SUBTITLE: '一个建立于 21 世纪的小站，存活于互联网的边缘。',

  // ==================== 页脚信息 ====================
  // 建站日期：用于计算版权年份，支持格式：'2024' 或 '2024-01-01' 或 '2024/01/01'
  // 系统会自动计算当前年份与建站年份的差值，满一年后显示年份范围
  // 例如：建站2024年，当前2025年 → 显示 © 2024-2025
  // 例如：建站2024年，当前2024年 → 显示 © 2024
  SITE_FOUNDED_DATE: '2025-10-01',
  // 站点名称：页脚中显示的可点击站点名称
  FOOTER_SITE: 'GW124.TOP',
  // 站点链接：点击站点名称跳转的URL地址
  FOOTER_SITE_URL: 'https://gw124.top/',
  // 社交链接：是否显示页脚下方的社交链接模块
  FOOTER_SOCIAL_ENABLED: true,

  // ==================== 字体配置 ====================
  // 全局字体：留空使用系统默认字体，填写则使用自定义字体
  // 字体文件应放置在 public/fonts/ 目录下
  // 支持格式：woff2, woff, ttf, otf
  // 示例：'CustomFont' 会加载 fonts/CustomFont.woff2 等文件
  // 留空则使用系统默认字体栈
  GLOBAL_FONT: '',

  // ==================== 专用字体配置 ====================
  // 各模块专用字体：留空使用全局字体，填写则使用指定字体
  // 字体文件应放置在 public/fonts/ 目录下
  // 支持格式：woff2, woff, ttf, otf
  // 示例：'HeaderFont' 会加载 fonts/HeaderFont.woff2 等文件
  // 留空则使用 GLOBAL_FONT 或系统默认字体
  
  // Logo标识字体
  HEADER_FONT: '',
  // 首页主标题字体
  INTRO_TITLE_FONT: 'brand',
  // 首页副标题字体
  INTRO_SUBTITLE_FONT: '',
  // 页脚站点名称字体
  FOOTER_SITE_FONT: '',
  
  // ==================== 页脚专用字体配置 ====================
  // 页脚链接文字字体：GW124.TOP 和 Wen 可点击链接文字（优先级最高）
  FOOTER_LINKS_FONT: '',
  // 页脚版权信息字体：© 2025 GW124.TOP · Powered by Wen 整体文字
  FOOTER_COPYRIGHT_FONT: 'brand',
  // 页脚社交模块字体：社交链接图标和文字
  FOOTER_SOCIAL_FONT: 'brand'

} as const;


