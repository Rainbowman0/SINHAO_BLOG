个人博客网站 PRD v1.0
一、项目概述
1.1 项目目标
构建一个具有强烈个人风格的博客网站，用于记录个人思考和项目经验，提供良好的阅读体验和基础互动功能。
1.2 技术栈
- 框架: Next.js (App Router)
- 样式: Tailwind CSS
- 内容管理: Markdown 文件（存储在 GitHub）
- 部署平台: Vercel
- 版本控制: GitHub

---
二、设计风格
2.1 视觉风格
- 整体定位: 温暖文艺风
- 色调: 柔和、温暖的配色方案
- 排版: 注重阅读体验，合适的行距和字距
- 图文: 支持图文混排，类似知乎的阅读体验
2.2 主题模式
- 支持浅色模式（Light Mode）
- 支持深色模式（Dark Mode）
- 用户可自由切换，保存用户偏好设置

---
三、功能需求
3.1 页面结构
3.1.1 首页
布局设计:
- 文章列表展示（卡片式布局）
- 每个文章卡片包含： 
  - 文章封面图
  - 文章标题
  - AI 生成的文章摘要
  - 发布日期
  - 分类标签
  - 阅读量
交互:
- 点击卡片跳转到文章详情页
- 点击标签可筛选该分类文章
3.1.2 文章详情页
内容展示:
- 文章标题
- 发布日期 / 更新日期
- 分类标签（支持多标签）
- 阅读量显示
- Markdown 渲染的正文内容
- 支持图文混排
- 代码高亮显示
导航功能:
- 文章目录（Table of Contents） 
  - 自动根据 Markdown 标题生成
  - 固定在侧边栏（桌面端）或可展开（移动端）
  - 点击目录项平滑滚动到对应位置
  - 当前阅读位置高亮
互动功能:
- 评论区（文章底部）
3.1.3 关于我页面
内容:
- 个人介绍
- 联系方式（可选）
- 个人照片/头像（可选）
3.1.4 分类页面
- 展示所有分类标签
- 点击标签查看该分类下的所有文章
3.2 核心功能
3.2.1 搜索功能
技术方案: FlexSearch（本地搜索引擎）
- 前端实现，无需后端
- 支持中文分词
- 搜索范围：文章标题、摘要、内容
- 实时搜索提示
- 搜索结果高亮
交互:
- 顶部导航栏提供搜索入口
- 快捷键支持（如 Cmd/Ctrl + K）
- 搜索框支持模糊匹配
3.2.2 评论系统
技术方案: Giscus（推荐）
- 基于 GitHub Discussions
- 完全免费
- 与项目 GitHub 仓库集成
- 支持 Markdown 语法
- 支持表情回应
- 需要访客使用 GitHub 账号登录
配置:
- 每篇文章对应一个 Discussion
- 自动创建或关联到已有 Discussion
- 评论数据存储在 GitHub Discussions
3.2.3 阅读统计
技术方案: Vercel Analytics（免费版）
- Vercel 官方提供，开箱即用
- 记录文章浏览量
- 展示在文章卡片和详情页
替代方案:
- 如需更详细的统计，可考虑 Umami（开源，需自行部署）
3.2.4 分类标签系统
特性:
- 一篇文章可以有多个分类标签
- 标签在 Markdown 文件的 frontmatter 中定义
- 支持动态扩展，无需修改代码
- 自动生成标签索引页
示例 Frontmatter:
---
title: "文章标题"
date: "2025-01-15"
tags: ["技术", "Next.js", "前端"]
cover: "/images/cover.jpg"
summary: "AI 生成的摘要..."
---
3.3 内容管理
3.3.1 Markdown 文件结构
/content
  /posts
    /2025
      /01-my-first-post.md
      /02-another-post.md
  /images
    /post-covers
    /post-images
3.3.2 写作流程
1. 在本地创建 Markdown 文件
2. 填写 frontmatter（标题、日期、标签等）
3. 编写正文内容
4. 提交到 GitHub
5. Vercel 自动部署更新
3.3.3 AI 摘要生成
实现方式:
- 构建时通过脚本调用 AI API 自动生成（需配置 API）
3.4 响应式设计
- 移动端（< 768px）: 
  - 单列布局
  - 可折叠的目录
  - 优化的触摸交互
- 平板端（768px - 1024px）: 
  - 双列文章列表
  - 简化的侧边栏
- 桌面端（> 1024px）: 
  - 固定的文章目录
  - 多列文章列表
  - 完整的导航和交互

---
四、技术架构
4.1 目录结构
/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── posts/             # 文章路由
│   │   └── [slug]/        # 动态路由
│   ├── about/             # 关于页
│   ├── tags/              # 标签页
│   └── layout.tsx         # 全局布局
├── components/            # React 组件
│   ├── Header.tsx         # 导航栏
│   ├── Footer.tsx         # 页脚
│   ├── PostCard.tsx       # 文章卡片
│   ├── TOC.tsx            # 目录组件
│   ├── Search.tsx         # 搜索组件
│   ├── Comments.tsx       # 评论组件
│   └── ThemeToggle.tsx    # 主题切换
├── content/               # Markdown 内容
│   └── posts/             # 文章
├── lib/                   # 工具函数
│   ├── markdown.ts        # Markdown 解析
│   ├── posts.ts           # 文章数据处理
│   └── search.ts          # 搜索功能
├── public/                # 静态资源
│   └── images/            # 图片资源
├── styles/                # 样式文件
└── types/                 # TypeScript 类型定义
4.2 关键依赖
- next: Next.js 框架
- react / react-dom: React 核心
- tailwindcss: 样式框架
- gray-matter: 解析 Markdown frontmatter
- remark / rehype: Markdown 处理
- @giscus/react: 评论系统
- flexsearch: 搜索引擎
- next-themes: 主题切换
4.3 Markdown 增强
- 代码高亮：rehype-highlight 或 prism-react-renderer
- 图片优化：Next.js Image 组件
- 目录生成：remark-toc 或自定义解析
- 数学公式：remark-math + rehype-katex（可选）

---
五、部署配置
5.1 Vercel 部署
- GitHub 仓库连接 Vercel
- 自动部署：push 到 main 分支自动触发
- 环境变量配置（如需要）: 
  - NEXT_PUBLIC_GISCUS_REPO: Giscus 仓库地址
  - NEXT_PUBLIC_GISCUS_REPO_ID: Giscus 仓库 ID
  - NEXT_PUBLIC_GISCUS_CATEGORY_ID: Giscus 分类 ID
5.2 域名配置
- 初期使用 Vercel 默认域名 (*.vercel.app)
- 后期可配置自定义域名

---
六、开发阶段规划
Phase 1: 基础框架（优先级：高）
- ✅ Next.js 项目初始化
- ✅ Tailwind CSS 配置
- ✅ 基础页面结构（首页、文章详情页、关于页）
- ✅ Markdown 文件读取和解析
- ✅ 深色/浅色模式切换
Phase 2: 核心功能（优先级：高）
- ✅ 文章列表展示
- ✅ 文章详情页渲染
- ✅ 分类标签系统
- ✅ 文章目录导航
- ✅ 响应式设计
Phase 3: 增强功能（优先级：中）
- ⏳ 搜索功能
- ⏳ 评论系统集成
- ⏳ 阅读量统计
- ⏳ 代码高亮
Phase 4: 优化和完善（优先级：低）
- ⏳ 性能优化（图片懒加载等）
- ⏳ 无障碍适配
- ⏳ 动画效果
- ⏳ SEO 优化（预留，后续实现）

---
七、非功能性需求
7.1 性能要求
- 首页加载时间 < 1 秒
- 文章页加载时间 < 1秒
- Lighthouse 性能评分 > 90
7.2 兼容性
- 现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）
- 移动端浏览器（iOS Safari、Chrome Mobile）
7.3 可维护性
- 代码结构清晰，组件化
- 完善的 TypeScript 类型定义
- 注释和文档

---
八、未来扩展（V2.0+）
以下功能暂不实现，但架构设计时需考虑扩展性：
- RSS 订阅功能
- 文章归档页（按年份/月份）
- 相关文章推荐
- 文章分享功能（社交媒体）
- 站点地图和 SEO 优化
- 全文搜索优化
- 访客统计仪表盘
- 邮件订阅功能
- 多语言支持

---
九、验收标准
9.1 功能完整性
- [ ] 所有页面正常访问
- [ ] 文章正确渲染（含图片、代码）
- [ ] 搜索功能可用
- [ ] 评论系统正常工作
- [ ] 阅读量正确统计
- [ ] 深色/浅色模式切换正常
- [ ] 移动端适配完善
9.2 用户体验
- [ ] 页面加载速度符合要求
- [ ] 交互流畅，无明显卡顿
- [ ] 视觉风格符合"温暖文艺"定位
- [ ] 文章阅读体验良好
9.3 技术质量
- [ ] 代码通过 ESLint 检查
- [ ] 无 TypeScript 类型错误
- [ ] 成功部署到 Vercel
- [ ] GitHub Actions 构建通过（如配置）

---
十、附录
10.1 参考资源
- Next.js 官方文档: https://nextjs.org/docs
- Giscus 官网: https://giscus.app/
- Tailwind CSS: https://tailwindcss.com/
- FlexSearch: https://github.com/nextapps-de/flexsearch
10.2 设计指南（待完善）
- 色彩方案
- 字体选择
- 组件设计规范

---
文档版本: v1.0
创建日期: 2025-10-12
最后更新: 2025-10-12
状态: 已确认，待开发