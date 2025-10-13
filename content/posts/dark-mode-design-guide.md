---
title: "深色模式设计指南：打造舒适的夜间阅读体验"
date: "2025-01-12"
tags: ["UI设计", "用户体验", "CSS"]
cover: "/images/covers/dark-mode.jpg"
summary: "从用户体验角度出发，详细介绍如何使用现代 Web 技术实现优雅的深色模式。包括色彩选择、对比度控制、状态持久化等实战技巧，让你的应用在夜间同样出色。"
---

## 为什么需要深色模式？

深色模式不仅仅是一种视觉风格，它带来了实实在在的好处：

- **减少眼睛疲劳**：在低光环境下更舒适
- **节省电池**：OLED 屏幕显示黑色时更省电
- **增强专注**：减少视觉干扰，提高注意力
- **用户偏好**：很多用户就是喜欢深色主题

## 设计原则

### 1. 不要使用纯黑色

纯黑色 (`#000000`) 会造成过高的对比度，导致眼睛疲劳。推荐使用深灰色：

```css
/* ❌ 不推荐 */
background-color: #000000;

/* ✅ 推荐 */
background-color: #1a1a1a;
background-color: #121212; /* Material Design 推荐 */
```

### 2. 合理控制对比度

文字与背景的对比度应该符合 WCAG 标准：

- **正常文字**：至少 4.5:1
- **大号文字**：至少 3:1

```css
.dark-mode {
  background-color: #1a1a1a;
  color: #e0e0e0; /* 对比度约 12:1 */
}
```

### 3. 使用表面高程

通过不同的灰度层次表现元素的"高度"：

```css
:root {
  --surface-0: #121212;  /* 基础层 */
  --surface-1: #1e1e1e;  /* 卡片 */
  --surface-2: #232323;  /* 悬浮元素 */
  --surface-3: #252525;  /* 对话框 */
}
```

## 技术实现

### 使用 CSS 变量

定义一套灵活的颜色系统：

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #e0e0e0;
  --border-color: #3a3a3a;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

### 使用 Tailwind CSS

Tailwind 的 `dark:` 变体让深色模式实现变得简单：

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold">标题</h1>
  <p className="text-gray-600 dark:text-gray-300">内容</p>
</div>
```

配置基于 class 的深色模式：

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

### 状态持久化

保存用户的主题偏好：

```typescript
"use client";

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 读取本地存储
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

### 跟随系统偏好

使用 CSS 媒体查询自动适配：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --text-primary: #e0e0e0;
  }
}
```

在 JavaScript 中检测：

```typescript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

## 颜色选择技巧

### 主色调整

在深色模式下，降低主色的饱和度和亮度：

```css
:root {
  --primary: #3b82f6; /* 蓝色 */
}

[data-theme="dark"] {
  --primary: #60a5fa; /* 更亮的蓝色 */
}
```

### 图片处理

对图片应用轻微的滤镜，减少刺眼感：

```css
.dark-mode img {
  filter: brightness(0.8) contrast(1.2);
}
```

## 测试清单

- [ ] 所有文本的对比度符合 WCAG AA 标准
- [ ] 代码块和语法高亮在深色模式下清晰可读
- [ ] 图片和图标在深色背景下不显得突兀
- [ ] 链接和交互元素在两种模式下都易于识别
- [ ] 主题切换时没有闪烁
- [ ] 首次加载时正确应用保存的主题

## 工具推荐

- **[Coolors](https://coolors.co/)**：生成配色方案
- **[Contrast Checker](https://webaim.org/resources/contrastchecker/)**：检查对比度
- **[Happy Hues](https://www.happyhues.co/)**：查看配色在实际界面中的效果

## 总结

实现优秀的深色模式需要在美学和可用性之间找到平衡。遵循设计原则，利用现代 CSS 特性，再加上细致的测试，你就能为用户提供舒适的阅读体验。

记住：深色模式不是简单的"反转颜色"，而是一套精心设计的视觉系统。
