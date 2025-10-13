# 我的个人博客

一个基于 Next.js 15 的现代化个人博客网站，采用温暖文艺风格设计。

## 特性

- ⚡️ **Next.js 15** - 使用最新的 App Router 架构
- 🎨 **Tailwind CSS** - 现代化的 CSS 框架
- 🌓 **深色模式** - 优雅的明暗主题切换
- 📝 **Markdown** - 基于 Markdown 的内容管理
- 🔍 **全文搜索** - FlexSearch 驱动的快速搜索
- 💬 **评论系统** - 基于 GitHub Discussions 的 Giscus
- 📱 **响应式设计** - 完美适配各种设备
- 🎯 **SEO 优化** - 良好的搜索引擎优化
- 🚀 **性能优化** - 代码分割、图片优化等

## 技术栈

- **框架**: [Next.js 15](https://nextjs.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **Markdown**: [remark](https://github.com/remarkjs/remark) + [rehype](https://github.com/rehypejs/rehype)
- **代码高亮**: [rehype-pretty-code](https://rehype-pretty.pages.dev/)
- **搜索**: [FlexSearch](https://github.com/nextapps-de/flexsearch)
- **评论**: [Giscus](https://giscus.app/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)
- **日期处理**: [date-fns](https://date-fns.org/)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填写配置：

```bash
cp .env.local.example .env.local
```

访问 [Giscus 官网](https://giscus.app/) 获取评论系统配置。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── posts/             # 文章路由
│   ├── tags/              # 分类页
│   ├── about/             # 关于页
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── Header.tsx         # 导航栏
│   ├── Footer.tsx         # 页脚
│   ├── PostCard.tsx       # 文章卡片
│   ├── TableOfContents.tsx # 目录
│   ├── Search.tsx         # 搜索组件
│   ├── Comments.tsx       # 评论组件
│   └── ThemeToggle.tsx    # 主题切换
├── content/               # Markdown 内容
│   └── posts/             # 博客文章
├── lib/                   # 工具函数
│   ├── markdown.ts        # Markdown 处理
│   ├── posts.ts           # 文章数据
│   └── search.ts          # 搜索功能
├── types/                 # TypeScript 类型
├── public/                # 静态资源
│   └── images/            # 图片
└── README.md             # 说明文档
```

## 写作指南

### 创建新文章

1. 在 `content/posts/` 目录下创建新的 `.md` 文件
2. 添加 frontmatter（文章元信息）
3. 编写文章内容
4. 提交到 Git 仓库

### Frontmatter 格式

```yaml
---
title: "文章标题"
date: "2025-01-15"
tags: ["标签1", "标签2"]
cover: "/images/covers/image.jpg"
summary: "文章摘要，用于卡片展示和 SEO"
---
```

### Markdown 功能

- **标题**: 支持 H1-H6，自动生成目录
- **代码块**: 支持语法高亮
- **图片**: 支持本地和远程图片
- **链接**: 支持内部和外部链接
- **列表**: 有序列表和无序列表
- **引用**: 使用 `>` 创建引用块
- **表格**: Markdown 表格语法

## 部署

### Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 访问 [Vercel](https://vercel.com/)
3. 导入 GitHub 仓库
4. 添加环境变量
5. 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 其他部署平台

- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Railway](https://railway.app/)

## 自定义

### 修改配色

编辑 `tailwind.config.ts` 中的颜色配置：

```typescript
colors: {
  primary: {
    // 你的主色调
  },
}
```

### 修改个人信息

编辑以下文件：
- `app/layout.tsx` - 网站标题和描述
- `app/about/page.tsx` - 关于页内容
- `components/Footer.tsx` - 页脚链接

### 添加 Google Analytics

在 `app/layout.tsx` 中添加 GA 脚本。

## 性能优化

- ✅ 服务器端渲染（SSR）
- ✅ 静态生成（SSG）
- ✅ 图片优化（Next.js Image）
- ✅ 代码分割
- ✅ 字体优化
- ✅ CSS 优化

## 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 许可证

MIT License

## 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Giscus](https://giscus.app/)
- [Vercel](https://vercel.com/)

---

**Made with ❤️ using Next.js**
