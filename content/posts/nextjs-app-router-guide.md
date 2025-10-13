---
title: "Next.js App Router 深度解析：构建现代化 Web 应用"
date: "2025-01-15"
tags: ["Next.js", "前端开发", "React"]
cover: "/images/covers/nextjs.jpg"
summary: "探索 Next.js 13+ 的 App Router 架构，了解如何利用服务器组件和客户端组件构建高性能的现代化 Web 应用。本文将深入讲解 App Router 的核心概念、最佳实践以及与 Pages Router 的区别。"
---

## 引言

Next.js 13 引入了全新的 App Router，这是一个基于 React Server Components 的革命性架构。它不仅提供了更好的性能，还带来了更直观的文件系统路由和更强大的数据获取能力。

## App Router 核心概念

### 1. 文件系统路由

App Router 使用 `app` 目录来定义路由，每个文件夹代表一个路由段：

```typescript
app/
├── page.tsx          # 首页 /
├── about/
│   └── page.tsx      # 关于页 /about
└── blog/
    ├── page.tsx      # 博客列表 /blog
    └── [slug]/
        └── page.tsx  # 博客详情 /blog/[slug]
```

### 2. 服务器组件 vs 客户端组件

**服务器组件**（默认）：
- 在服务器端渲染
- 可以直接访问数据库和文件系统
- 不能使用浏览器 API
- 包体积更小

```tsx
// 服务器组件（默认）
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{/* 渲染数据 */}</div>;
}
```

**客户端组件**（需要声明）：
- 使用 `"use client"` 指令
- 可以使用 hooks 和浏览器 API
- 支持交互和状态管理

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 3. 布局和模板

布局（Layout）会在路由切换时保持状态：

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

## 数据获取最佳实践

### 服务器端数据获取

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store', // 动态数据
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getData();
  return <PostList posts={posts} />;
}
```

### 增量静态再生成（ISR）

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // 每小时重新验证
  });
  return res.json();
}
```

## 性能优化技巧

1. **代码分割**：自动按路由分割代码
2. **图片优化**：使用 `next/image` 组件
3. **字体优化**：使用 `next/font` 自动优化字体加载
4. **流式渲染**：利用 Suspense 实现渐进式渲染

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}
```

## 总结

App Router 代表了 Next.js 的未来方向，它通过服务器组件和改进的路由系统，为构建高性能 Web 应用提供了强大的工具。虽然学习曲线存在，但掌握这些概念将让你的开发效率大幅提升。

## 相关资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React Server Components RFC](https://github.com/reactjs/rfcs)
- [Vercel 部署指南](https://vercel.com/docs)
