# 快速开始指南

## 🎉 恭喜！你的博客已经搭建完成

这是一个功能完整的个人博客网站，基于 Next.js 15 + Tailwind CSS 构建。

## 📋 项目已实现的功能

✅ **核心功能**
- 首页展示文章列表（卡片式布局）
- 文章详情页（支持 Markdown 渲染）
- 分类标签系统
- 关于页面
- 深色/浅色模式切换
- 全文搜索（FlexSearch）
- 评论系统（Giscus）
- 文章目录（TOC）自动生成

✅ **技术特性**
- 响应式设计（移动端/平板/桌面）
- 代码语法高亮
- 图片优化
- SEO 友好
- TypeScript 类型安全
- 性能优化

## 🚀 立即开始使用

### 1. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看网站

### 2. 添加你的第一篇文章

在 `content/posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "我的第一篇文章"
date: "2025-01-15"
tags: ["生活", "随笔"]
cover: "/images/covers/my-post.jpg"
summary: "这是我的第一篇博客文章，记录我的想法和经历。"
---

## 开始写作

在这里写下你的内容...
```

保存后刷新浏览器，新文章就会出现在首页！

### 3. 自定义个人信息

**修改网站标题和描述**：编辑 `app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: "你的博客名称",
  description: "你的博客描述",
};
```

**修改关于页**：编辑 `app/about/page.tsx`

**修改页脚**：编辑 `components/Footer.tsx`

### 4. 配置评论系统

1. 访问 https://giscus.app/
2. 按照指引配置你的 GitHub 仓库
3. 复制配置信息
4. 创建 `.env.local` 文件：

```bash
cp .env.local.example .env.local
```

5. 填入 Giscus 配置信息

### 5. 部署到 Vercel

#### 方式一：使用 Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

#### 方式二：通过 GitHub

1. 推送代码到 GitHub：
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

2. 访问 https://vercel.com/
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. 添加环境变量（Giscus 配置）
6. 点击 "Deploy"

## 📝 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 🎨 自定义样式

### 修改主色调

编辑 `tailwind.config.ts`：

```typescript
colors: {
  primary: {
    // 修改为你喜欢的颜色
    600: "#your-color",
  }
}
```

### 修改字体

编辑 `app/layout.tsx`：

```typescript
import { YourFont } from "next/font/google";

const yourFont = YourFont({ subsets: ["latin"] });
```

## 📁 项目结构说明

```
├── app/                    # 页面路由
│   ├── page.tsx           # 首页
│   ├── posts/[slug]/      # 文章详情
│   ├── tags/              # 分类页
│   └── about/             # 关于页
├── components/            # UI 组件
├── content/posts/         # 📝 在这里写文章
├── lib/                   # 工具函数
├── public/images/         # 🖼️ 图片资源
└── types/                 # TypeScript 类型
```

## ⚡ 写作技巧

### 添加封面图

1. 将图片放到 `public/images/covers/` 目录
2. 在 frontmatter 中引用：
```yaml
cover: "/images/covers/my-image.jpg"
```

### 使用代码块

````markdown
```typescript
function hello() {
  console.log("Hello World!");
}
```
````

### 添加图片

```markdown
![图片描述](/images/posts/my-image.jpg)
```

### 创建标题（自动生成目录）

```markdown
## 二级标题
### 三级标题
```

## 🔧 故障排除

### 文章不显示？
- 检查 `.md` 文件的 frontmatter 格式
- 确保日期格式正确：`2025-01-15`
- 确保文件在 `content/posts/` 目录下

### 样式显示异常？
- 删除 `.next` 文件夹
- 运行 `npm run dev` 重新构建

### 构建失败？
- 检查 TypeScript 类型错误
- 运行 `npm run lint` 查看错误

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Markdown 语法](https://www.markdownguide.org/)
- [Giscus 配置](https://giscus.app/)

## 🎯 下一步

1. ✍️ 开始写你的第一篇文章
2. 🎨 自定义颜色和样式
3. 📸 添加你的个人信息和照片
4. 🚀 部署到 Vercel
5. 🔗 配置自定义域名（可选）

## 💡 小贴士

- **定期备份**：定期将代码推送到 GitHub
- **图片优化**：使用压缩后的图片以提升性能
- **SEO**：在 frontmatter 中写好 summary，有利于搜索引擎收录
- **持续更新**：定期更新文章，保持博客活跃度

---

**祝你写作愉快！✨**

如有问题，可以查看 README.md 获取更多详细信息。
