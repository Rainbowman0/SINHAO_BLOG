# AI博客自动生成功能 PRD v1.0

---

## ⚠️ 开始实施前必须填写的信息

**请在下方填写完整后再开始开发：**

### 1. 天行数据 API Key
- **申请地址**: https://www.tianapi.com/
- **申请步骤**: 注册账号 → 进入控制台 → 复制API Key
- **免费额度**: 100次/天
- **您的API Key**: `0c3aa2e45c23fc053e2555cb67e73a61`

可以查以下几类信息：
（1）AI咨询（Node代码示例）：
 var request = require('request');
     request.post({
	url:'https://apis.tianapi.com/ai/index',
        form:{
             key:'你的APIKEY',num:'10'
	} 
    },function(err,response,tianapi_data ){
        console.log(tianapi_data)
});

（2）互联网资讯（Node示例）：
 var request = require('request');
     request.post({
	url:'https://apis.tianapi.com/internet/index',
        form:{
             key:'你的APIKEY',num:'10'
	} 
    },function(err,response,tianapi_data ){
        console.log(tianapi_data)
});

（3）科学探索（Node示例）：
 var request = require('request');
     request.post({
	url:'https://apis.tianapi.com/sicprobe/index',
        form:{
             key:'你的APIKEY',num:'10'
	} 
    },function(err,response,tianapi_data ){
        console.log(tianapi_data)
});

（4）国内新闻（Node示例）：
 var request = require('request');
     request.post({
	url:'https://apis.tianapi.com/guonei/index',
        form:{
             key:'你的APIKEY',num:'10'
	} 
    },function(err,response,tianapi_data ){
        console.log(tianapi_data)
});


### 2. Unsplash API Access Key
- **申请地址**: https://unsplash.com/developers
- **申请步骤**: 注册开发者账号 → 创建应用 → 获取 Access Key
- **免费额度**: 50次/小时
- **您的Access Key**: `O4BMppcIU7RiQH6DXlEnuh_VrLq1bh73dD0uOSv42jA`
API具体如何使用需要参考官方文档：https://unsplash.com/documentation

### 3. Qwen API Key（已有）
- **API Key**: `sk-dgdxmlxmoumvczimwvxzkvbrvxgwtddplzwyjcvyhydmipti`
- **API地址**: `https://api.siliconflow.cn/v1/chat/completions`
- **免费额度**: 已有免费额度
示例代码：
- Javascript：
const url = 'https://api.siliconflow.cn/v1/chat/completions';
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: '{"model":"Qwen/QwQ-32B","messages":[{"role":"user","content":"What opportunities and challenges will the Chinese large model industry face in 2025?"}]}'
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
返回示例：
{
  "id": "<string>",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "<string>",
        "reasoning_content": "<string>",
        "tool_calls": [
          {
            "id": "<string>",
            "type": "function",
            "function": {
              "name": "<string>",
              "arguments": "<string>"
            }
          }
        ]
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 123,
    "total_tokens": 123
  },
  "created": 123,
  "model": "<string>",
  "object": "chat.completion"
}

### 4. GitHub Personal Access Token（用于自动提交）
- **用途**: GitHub Actions 自动提交生成的博客
- **申请步骤**: GitHub Settings → Developer settings → Personal access tokens → Generate new token (classic)
- **权限**: 勾选 `repo`（完整仓库访问权限）
- **您的Token**: `请在 GitHub Secrets 中配置个人访问令牌（PAT），此处仅作占位符，不要写入真实值）`

---

**📋 待填写信息清单（共4项）：**
- [x] 天行数据 API Key
- [x] Unsplash API Access Key
- [x] GitHub Personal Access Token
- [x] Qwen API Key

---

## 一、项目概述

### 1.1 功能定位
在现有博客系统基础上，新增"AI博客"栏目，实现每天自动生成一篇高质量的AI博客文章。文章内容基于当日热点科技新闻和社会事件，从科技与人文交叉的视角进行深度思考。

### 1.2 核心价值
- **内容持续性**: 每天自动生成，保持网站内容活跃度
- **时效性**: 结合当日热点，内容具有时效价值
- **深度性**: AI生成的内容不是简单复述，而是深度思考
- **独立性**: AI博客与手写博客完全独立，互不干扰

### 1.3 技术栈
- **新闻源**: 天行数据 API（AI咨询 + 互联网资讯 + 科学探索，每个源5条）
- **内容生成**: Qwen/Qwen2.5-7B-Instruct（SiliconFlow API，速度快、稳定）
- **图片来源**: Unsplash API（免费高质量图库）
- **定时任务**: GitHub Actions（每天早上6:00自动运行）
- **存储方式**: Markdown文件（独立目录 `content/ai-posts/`）
- **前端展示**: Next.js App Router（独立路由 `/ai-blog`）

---

## 二、功能需求

### 2.1 自动化生成流程

#### 2.1.1 触发方式
**自动触发**:
- 时间: 每天早上 6:00（北京时间）
- 机制: GitHub Actions Cron Job
- 频率: 每天一次

**手动触发**:
- 命令: `npm run generate-ai-post`
- 用途: 本地测试、补发文章
- 权限: 开发者本地执行

#### 2.1.2 生成步骤

**Step 1: 获取热点新闻**
- 调用天行数据API获取：
  - AI咨询 Top 5
  - 互联网资讯 Top 5
  - 科学探索 Top 5
- 总计15条新闻
- 数据格式化，提取标题、摘要、热度

**Step 2: AI生成博客内容**
- 输入: 当日热点新闻列表
- 调用: Qwen API（SiliconFlow）
- Prompt设计:
  - 系统角色: 站在科技与人文交叉点的思考者
  - 任务: 从热点中选择1-2个最有价值的话题
  - 要求: 800-1200字，结构化，有深度
  - 输出: 标题、正文、摘要、关键词
- 参考风格: 现有博客（温暖、哲理化、有科学依据）

**Step 3: 获取封面图**（暂不实现）
- ⚠️ 第一版不下载封面图，cover字段留空
- 原因: 简化流程，避免Unsplash API额度消耗
- 后续优化: V2.0可添加封面图功能

**Step 4: 生成Markdown文件**
- 文件名: `YYYY-MM-DD-{关键词}.md`
- 保存路径: `content/ai-posts/`
- Frontmatter格式:
  ```yaml
  ---
  title: "AI生成的标题"
  date: "2025-01-15"
  tags: ["AI生成", "科技", "社会", "关键词1", "关键词2"]
  cover: "/images/ai-covers/2025-01-15-cover.jpg"
  summary: "AI生成的摘要（150字）"
  draft: true
  aiGenerated: true
  ---
  ```
- 默认标记为草稿 (`draft: true`)

**Step 5: 自动提交到GitHub**
- Git add 新文件
- Commit message: `🤖 Auto-generated AI blog post for YYYY-MM-DD`
- Push to main branch
- 触发Vercel自动部署

#### 2.1.3 质量控制（草稿审核机制）

**生成阶段**:
- 所有AI生成的博客默认标记 `draft: true`
- 不会立即在网站前端显示

**审核阶段**:
- 你每天早上起床后，Pull最新代码
- 打开 `content/ai-posts/YYYY-MM-DD-xxx.md`
- 阅读审核内容质量

**发布阶段**:
- **通过**: 将 `draft: true` 改为 `draft: false`（或删除该字段）
- **不通过**: 编辑修改 或 直接删除文件
- **重新生成**: 运行 `npm run generate-ai-post`
- Commit并Push，触发自动部署

**前端过滤**:
- 生产环境: 只显示 `draft: false` 的文章
- 开发环境: 显示所有文章（包括草稿）

---

### 2.2 前端展示需求

#### 2.2.1 Header导航栏
**修改位置**: `components/Header.tsx`

**新增链接**:
```
首页 | AI博客 | 分类 | 关于
```

**样式要求**:
- 与现有导航链接样式一致
- 悬停效果保持一致
- 移动端响应式适配

#### 2.2.2 AI博客列表页
**路由**: `/ai-blog`
**文件**: `app/ai-blog/page.tsx`

**布局设计**:
- 与首页相似的网格卡片布局
- 每个卡片显示：
  - 封面图
  - 🤖 AI生成 徽章（右上角）
  - 文章标题
  - 发布日期
  - 摘要
  - 标签（包含"AI生成"标签）
  - 阅读时长

**筛选逻辑**:
- 只显示 `draft: false` 的文章（生产环境）
- 按日期倒序排列

**特殊标识**:
- 卡片右上角显示紫色"🤖 AI生成"徽章
- 与手写博客视觉上有明显区分

#### 2.2.3 AI博客详情页
**路由**: `/ai-blog/[slug]`
**文件**: `app/ai-blog/[slug]/page.tsx`

**布局设计**:
- 完全复用现有博客详情页的布局
- 支持功能：
  - 文章目录（Table of Contents）
  - Markdown渲染
  - 代码高亮
  - 图片展示
  - 评论系统（Giscus）

**特殊标识**:
- 文章顶部显示"本文由AI生成"提示
- 样式示例:
  ```
  💡 本文由AI基于当日热点自动生成，内容仅供参考
  ```

**SEO优化**:
- 动态生成 `<title>` 和 `<meta description>`
- 与手写博客相同的SEO处理

---

### 2.3 数据结构设计

#### 2.3.1 目录结构
```
SINHAO_BLOG/
├── content/
│   ├── posts/              # 手写博客（原有）
│   └── ai-posts/           # AI博客（新增）
│       ├── 2025-01-15-ai-tech-society.md
│       └── 2025-01-16-ai-digital-humanity.md
│
├── app/
│   ├── page.tsx            # 首页（手写博客列表）
│   ├── posts/[slug]/       # 手写博客详情
│   └── ai-blog/            # AI博客路由（新增）
│       ├── page.tsx        # AI博客列表
│       └── [slug]/
│           └── page.tsx    # AI博客详情
│
├── lib/
│   ├── posts.ts            # 手写博客数据处理（原有）
│   ├── ai-posts.ts         # AI博客数据处理（新增）
│   └── ai-generator/       # AI生成核心模块（新增）
│       ├── news-fetcher.ts      # 新闻获取
│       ├── content-generator.ts # 内容生成
│       ├── image-fetcher.ts     # 图片获取
│       └── post-builder.ts      # Markdown组装
│
├── scripts/
│   └── generate-ai-post.ts # 生成脚本（新增）
│
├── public/
│   └── images/
│       └── ai-covers/      # AI博客封面图（新增）
│
└── .github/
    └── workflows/
        └── generate-ai-post.yml # GitHub Actions（新增）
```

#### 2.3.2 Markdown文件格式
```yaml
---
title: "当算法遇见人性：从今日热搜看技术的温度"
date: "2025-01-15"
tags: ["AI生成", "科技", "社会", "算法伦理", "人文关怀"]
cover: "/images/ai-covers/2025-01-15-cover.jpg"
summary: "今天微博热搜上关于AI推荐算法的讨论，让我想起一个问题：技术进步是否意味着我们必须牺牲人性的温度？本文从今日热点出发，探讨算法时代的人文关怀。"
draft: true
aiGenerated: true
readingTime: "5 分钟"
---

研究表明，人类对于信息的接收并非被动的...

（正文内容，Markdown格式）
```

#### 2.3.3 TypeScript类型定义
```typescript
// types/index.ts 新增

export interface AIPost extends Post {
  aiGenerated: boolean;  // 标识为AI生成
  draft?: boolean;       // 草稿标记
}

export interface NewsItem {
  title: string;         // 新闻标题
  description?: string;  // 新闻摘要
  source: string;        // 来源（AI咨询/互联网资讯/科学探索）
  hotScore?: number;     // 热度分数
  url?: string;          // 原文链接
}

export interface GeneratedContent {
  title: string;         // 博客标题
  content: string;       // 正文（Markdown）
  summary: string;       // 摘要（150字）
  keywords: string[];    // 关键词数组
}
```

---

## 三、技术实现

### 3.1 核心模块设计

#### 3.1.1 新闻获取模块
**文件**: `lib/ai-generator/news-fetcher.ts`

**功能**:
- 调用天行数据API获取热点新闻
- 数据清洗和格式化
- 错误处理和重试机制

**API选择**:
- **AI咨询**: `https://apis.tianapi.com/ai/index`
- **互联网资讯**: `https://apis.tianapi.com/internet/index`
- **科学探索**: `https://apis.tianapi.com/sicprobe/index`

**请求示例**:
```typescript
const response = await fetch(
  `https://apis.tianapi.com/ai/index?key=${TIANAPI_KEY}&num=5`  // 每个源5条
);
```

**真实返回数据结构**（已测试验证）:
```typescript
interface TianapiResponse {
  code: number;              // 200表示成功
  msg: string;               // "success"
  result: {
    curpage: number;
    allnum: number;
    newslist: Array<{
      id: string;
      ctime: string;         // 发布时间 "2025-10-18 17:00"
      title: string;         // 标题
      description: string;   // 摘要（互联网资讯可能为空）
      source: string;        // 来源
      picUrl: string;        // 图片URL
      url: string;           // 原文链接
    }>;
  };
}

interface FetchedNews {
  aiNews: NewsItem[];       // AI咨询 5条
  internetNews: NewsItem[]; // 互联网资讯 5条
  scienceNews: NewsItem[];  // 科学探索 5条
  fetchTime: string;        // 获取时间
}
```

**错误处理**:
- API调用失败: 重试3次，间隔2秒
- 超时设置: 10秒
- 失败后: 记录日志，使用缓存数据（如有）

---

#### 3.1.2 内容生成模块
**文件**: `lib/ai-generator/content-generator.ts`

**功能**:
- 构建Prompt
- 调用Qwen API生成博客
- 解析返回结果
- 质量检查

**API配置**:
```typescript
const API_CONFIG = {
  url: 'https://api.siliconflow.cn/v1/chat/completions',
  model: 'Qwen/Qwen2.5-7B-Instruct',  // 使用7B模型（速度快、稳定）
  apiKey: process.env.QWEN_API_KEY,
  temperature: 0.7,        // 创造性
  maxTokens: 2000,         // 最大输出长度
  topP: 0.9
};
```

**模型选择说明**:
- ✅ **Qwen2.5-7B-Instruct**: 速度快（<2秒），稳定可靠，适合博客生成
- ❌ **QwQ-32B**: 推理模型，速度慢（>30秒），token消耗大，容易超时

**Prompt设计**:

**System Prompt（系统角色）**:
```
你是一位站在科技与人文交叉点的思考者，擅长从热点事件中提炼深度见解。

写作风格特点：
1. 温暖而不失深度 - 语言优美，有人文关怀
2. 理性而不冷漠 - 基于事实，有科学依据
3. 个人化表达 - 避免宏大叙事，从小切口入手
4. 思辨性 - 提出独特观点，不人云亦云
5. 真诚 - 避免空洞的口号和说教

参考风格示例：
"研究表明人对于数量增加的感知不是线性的，而是呈log函数。比如对于时间的增加，在人脑中大体上会认为1、2、4、8、16、32岁之间的间隔是一样的，这也是为什么大家普遍觉得时间越来越快。三年，确实转瞬即逝。但很奇怪的是，回想起刚入学时居然有种恍如隔世的感觉..."

这段文字的特点：
- 有科学依据（log函数）
- 个人化表达（"我"的感受）
- 温暖真诚（"恍如隔世"）
- 引发思考（时间感知）
```

**User Prompt（任务指令）**:
```
今天是 {当前日期}，以下是今日热点：

【AI咨询 Top 5】
1. {新闻标题1}
2. {新闻标题2}
...

【互联网资讯 Top 5】
1. {新闻标题1}
2. {新闻标题2}
...

【科学探索 Top 5】
1. {新闻标题1}
2. {新闻标题2}
...

【任务】
请从这些15条热点中选择1-2个最有思考价值的话题，写一篇800-1200字的博客。

【要求】
1. 标题：简洁有力，体现核心观点（15字以内）
2. 结构：
   - 引子（100-150字）：从一个小的观察或现象切入，引出话题
   - 分析（500-700字）：
     * 结合科技与人文的双重视角
     * 可引用研究、数据、理论支撑
     * 提出独特观点，不简单复述新闻
     * 可以有个人经历或思考
   - 升华（200-300字）：提出更深层次的思考或未来展望
3. 语言风格：
   - 温暖、优美、有文学性
   - 避免"让我们一起"、"未来可期"等套话
   - 可以适当使用比喻、类比
4. 不要生硬堆砌所有热点，选择最有价值的1-2个深入挖掘

【输出格式】
请严格按照以下JSON格式返回，不要添加任何其他内容：
{
  "title": "博客标题",
  "content": "博客正文（Markdown格式，可包含标题、段落、引用等）",
  "summary": "150字以内的摘要，概括文章核心观点",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}
```

**请求示例**:
```typescript
const response = await fetch(API_CONFIG.url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_CONFIG.apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: API_CONFIG.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: API_CONFIG.temperature,
    max_tokens: API_CONFIG.maxTokens
  })
});
```

**返回解析**:
```typescript
const result = await response.json();
const content = result.choices[0].message.content;
const generatedContent: GeneratedContent = JSON.parse(content);
```

**质量检查**:
- 标题长度: 5-20字
- 正文长度: 600-1500字
- 摘要长度: 50-200字
- 关键词数量: 2-5个
- 不通过则重新生成（最多3次）

---

#### 3.1.3 图片获取模块
**文件**: `lib/ai-generator/image-fetcher.ts`

**功能**:
- 将中文关键词翻译成英文
- 调用Unsplash API搜索图片
- 下载图片到本地
- 提供Fallback方案

**翻译关键词**:
```typescript
// 使用Qwen快速翻译（简单调用，低成本）
async function translateKeyword(chineseKeyword: string): Promise<string> {
  const prompt = `将以下中文关键词翻译成英文（只返回英文单词）：${chineseKeyword}`;
  // 调用Qwen API...
  return englishKeyword;
}
```

**Unsplash API调用**:
```typescript
const response = await fetch(
  `https://api.unsplash.com/search/photos?` +
  `query=${englishKeyword}&` +
  `per_page=1&` +
  `orientation=landscape&` +
  `content_filter=high`,
  {
    headers: {
      'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
    }
  }
);

const data = await response.json();
const imageUrl = data.results[0]?.urls.regular;
```

**图片下载**:
```typescript
const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
const fileName = `${date}-cover.jpg`;
const filePath = path.join(process.cwd(), 'public/images/ai-covers', fileName);

await fs.writeFile(filePath, Buffer.from(imageBuffer));
```

**Fallback方案**:
如果Unsplash搜索失败或无结果：
- 使用默认渐变色背景
- 或使用预设的通用科技主题图片
- cover字段设为: `/images/ai-covers/default.jpg`

---

#### 3.1.4 文章组装模块
**文件**: `lib/ai-generator/post-builder.ts`

**功能**:
- 组装Frontmatter
- 生成文件名
- 计算阅读时间
- 写入Markdown文件

**文件名生成规则**:
```typescript
// 格式: YYYY-MM-DD-{关键词}.md
// 示例: 2025-01-15-ai-ethics.md

function generateFileName(date: string, keywords: string[]): string {
  const slug = keywords[0]
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fa5]+/g, '-')  // 中文和空格转为-
    .replace(/[^a-z0-9-]/g, '')           // 移除特殊字符
    .substring(0, 30);                     // 限制长度

  return `${date}-${slug}.md`;
}
```

**Markdown文件生成**:
```typescript
function buildMarkdown(data: {
  title: string;
  date: string;
  tags: string[];
  cover: string;
  summary: string;
  content: string;
  readingTime: string;
}): string {
  return `---
title: "${data.title}"
date: "${data.date}"
tags: ${JSON.stringify(data.tags)}
cover: "${data.cover}"
summary: "${data.summary}"
draft: true
aiGenerated: true
readingTime: "${data.readingTime}"
---

${data.content}
`;
}
```

**保存文件**:
```typescript
const filePath = path.join(
  process.cwd(),
  'content/ai-posts',
  fileName
);

await fs.writeFile(filePath, markdownContent, 'utf-8');
```

---

### 3.2 生成脚本设计

#### 3.2.1 主脚本
**文件**: `scripts/generate-ai-post.ts`

**执行流程**:
```typescript
async function main() {
  try {
    console.log('🤖 开始生成AI博客...');

    // Step 1: 获取热点新闻
    console.log('📰 正在获取热点新闻...');
    const news = await fetchNews();
    console.log(`✅ 获取到 ${news.aiNews.length} 条AI咨询`);
    console.log(`✅ 获取到 ${news.internetNews.length} 条互联网资讯`);
    console.log(`✅ 获取到 ${news.scienceNews.length} 条科学探索`);
    console.log(`✅ 总计 15 条新闻`);

    // Step 2: AI生成博客内容
    console.log('✍️ AI正在生成博客内容...');
    const content = await generateContent(news);
    console.log(`✅ 生成成功: ${content.title}`);

    // Step 3: 跳过封面图（V1.0暂不实现）
    const coverPath = '';  // 留空

    // Step 4: 组装Markdown文件
    console.log('📝 正在生成Markdown文件...');
    const fileName = await buildPost({
      ...content,
      cover: coverPath,
      date: getTodayDate()
    });
    console.log(`✅ 文件已生成: content/ai-posts/${fileName}`);

    console.log('🎉 AI博客生成完成！');
    console.log('💡 请审核后将 draft: true 改为 draft: false 以发布');

  } catch (error) {
    console.error('❌ 生成失败:', error);
    process.exit(1);
  }
}

main();
```

**错误处理**:
- 每一步都有try-catch
- 失败时输出详细错误信息
- 提供重试建议

**日志记录**:
- 保存生成日志到 `logs/ai-generation.log`
- 记录: 时间、热点列表、生成的标题、是否成功

---

#### 3.2.2 package.json配置
```json
{
  "scripts": {
    "generate-ai-post": "tsx scripts/generate-ai-post.ts"
  },
  "devDependencies": {
    "tsx": "^4.7.0"  // 用于直接运行TypeScript
  }
}
```

**使用方法**:
```bash
npm run generate-ai-post
```

---

### 3.3 前端实现

#### 3.3.1 AI博客数据处理
**文件**: `lib/ai-posts.ts`

**功能**: 复用 `lib/posts.ts` 的逻辑，但读取不同目录

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostMetadata } from "@/types";
import { calculateReadingTime } from "./markdown";

const aiPostsDirectory = path.join(process.cwd(), "content/ai-posts");

// 获取所有AI博客的slug
export function getAIPostSlugs(): string[] {
  if (!fs.existsSync(aiPostsDirectory)) {
    return [];
  }
  return fs.readdirSync(aiPostsDirectory).filter(file => file.endsWith(".md"));
}

// 根据slug获取单篇AI博客
export function getAIPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(aiPostsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "",
    date: data.date || "",
    tags: data.tags || [],
    cover: data.cover || "",
    summary: data.summary || "",
    content,
    readingTime: data.readingTime || calculateReadingTime(content),
    draft: data.draft || false,
    aiGenerated: data.aiGenerated || false,
  };
}

// 获取所有AI博客（元数据）
export function getAllAIPosts(): PostMetadata[] {
  const slugs = getAIPostSlugs();
  const posts = slugs
    .map(slug => {
      const post = getAIPostBySlug(slug);
      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        tags: post.tags,
        cover: post.cover,
        summary: post.summary,
        readingTime: post.readingTime,
        draft: post.draft,
        aiGenerated: post.aiGenerated,
      };
    })
    // 生产环境过滤草稿
    .filter(post => {
      if (process.env.NODE_ENV === 'production') {
        return !post.draft;
      }
      return true;
    })
    // 按日期倒序
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}
```

---

#### 3.3.2 AI博客列表页
**文件**: `app/ai-blog/page.tsx`

**代码结构**:
```typescript
import { getAllAIPosts } from "@/lib/ai-posts";
import { PostCard } from "@/components/PostCard";

export const metadata = {
  title: "AI博客 - SINHAO的基地",
  description: "AI每日基于热点生成的深度思考",
};

export default function AIBlogPage() {
  const posts = getAllAIPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          🤖 AI博客
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          AI每天基于热点科技新闻和社会事件，从科技与人文的交叉点进行深度思考
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            暂无AI博客，敬请期待...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              basePath="/ai-blog"  // 指定链接前缀
              showAIBadge={true}    // 显示AI徽章
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

#### 3.3.3 AI博客详情页
**文件**: `app/ai-blog/[slug]/page.tsx`

**代码结构**:
```typescript
import { getAIPostBySlug, getAIPostSlugs } from "@/lib/ai-posts";
import { markdownToHtml, extractTableOfContents } from "@/lib/markdown";
import { TableOfContents } from "@/components/TableOfContents";
import { Comments } from "@/components/Comments";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { notFound } from "next/navigation";
import Image from "next/image";

interface AIPostPageProps {
  params: Promise<{ slug: string }>;
}

// 静态生成所有AI博客页面
export async function generateStaticParams() {
  const slugs = getAIPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

// 动态生成元数据
export async function generateMetadata({ params }: AIPostPageProps) {
  const { slug } = await params;
  try {
    const post = getAIPostBySlug(slug);
    return {
      title: `${post.title} - AI博客`,
      description: post.summary,
    };
  } catch {
    return { title: "文章未找到" };
  }
}

export default async function AIPostPage({ params }: AIPostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = getAIPostBySlug(slug);
  } catch {
    notFound();
  }

  const htmlContent = await markdownToHtml(post.content);
  const toc = extractTableOfContents(post.content);
  const formattedDate = format(new Date(post.date), "yyyy年MM月dd日", {
    locale: zhCN,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          {/* Main Content */}
          <article className="min-w-0">
            {/* AI生成提示 */}
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                💡 本文由AI基于当日热点自动生成，内容仅供参考和思考
              </p>
            </div>

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" /* ... 日期图标 ... */>
                  {formattedDate}
                </span>
                {post.readingTime && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" /* ... 时钟图标 ... */>
                    {post.readingTime}
                  </span>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-sm rounded-full ${
                        tag === "AI生成"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          : "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Cover Image */}
            {post.cover && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-dark max-w-none
                prose-headings:scroll-mt-20
                /* ... 其他样式同现有博客 ... */"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Comments */}
            <Comments />
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
```

---

#### 3.3.4 修改Header组件
**文件**: `components/Header.tsx`

**修改点**:
在导航链接中添加"AI博客"：

```typescript
// 找到导航部分，添加新链接
<Link
  href="/ai-blog"
  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
>
  AI博客
</Link>
```

**完整导航顺序**:
```
首页 | AI博客 | 分类 | 关于
```

---

#### 3.3.5 PostCard组件扩展（可选）
**文件**: `components/PostCard.tsx`

**新增Props**:
```typescript
interface PostCardProps {
  post: PostMetadata;
  basePath?: string;     // 新增：链接前缀（默认 "/posts"）
  showAIBadge?: boolean; // 新增：是否显示AI徽章
}
```

**AI徽章样式**:
```typescript
{showAIBadge && (
  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
    🤖 AI生成
  </div>
)}
```

---

### 3.4 自动化配置

#### 3.4.1 GitHub Actions工作流
**文件**: `.github/workflows/generate-ai-post.yml`

```yaml
name: Generate AI Blog Post

on:
  schedule:
    # 每天早上6:00（北京时间 UTC+8）
    # Cron使用UTC时间，所以是22:00（前一天）
    - cron: '0 22 * * *'

  # 支持手动触发（用于测试）
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      # 2. 设置Node.js环境
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      # 3. 安装依赖
      - name: Install dependencies
        run: npm ci

      # 4. 运行生成脚本
      - name: Generate AI blog post
        env:
          TIANAPI_KEY: ${{ secrets.TIANAPI_KEY }}
          QWEN_API_KEY: ${{ secrets.QWEN_API_KEY }}
          UNSPLASH_ACCESS_KEY: ${{ secrets.UNSPLASH_ACCESS_KEY }}
        run: npm run generate-ai-post

      # 5. 提交生成的文件
      - name: Commit and push changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add content/ai-posts/
          git add public/images/ai-covers/

          # 检查是否有变更
          if git diff --staged --quiet; then
            echo "No changes to commit"
            exit 0
          fi

          # 提交并推送
          git commit -m "🤖 Auto-generated AI blog post for $(date +'%Y-%m-%d')"
          git push

      # 6. 发送通知（可选）
      - name: Notify on failure
        if: failure()
        run: echo "AI博客生成失败，请检查日志"
```

**定时规则说明**:
- `0 22 * * *` = 每天UTC 22:00 = 北京时间早上6:00
- 可通过 https://crontab.guru/ 验证

**手动触发方式**:
- 进入GitHub仓库页面
- Actions → Generate AI Blog Post → Run workflow

---

#### 3.4.2 GitHub Secrets配置

**需要在GitHub仓库设置的Secrets**:

1. **TIANAPI_KEY**
   - 值: 【你填写的天行数据API Key】
   - 用途: 获取热点新闻

2. **QWEN_API_KEY**
   - 值: `sk-dgdxmlxmoumvczimwvxzkvbrvxgwtddplzwyjcvyhydmipti`
   - 用途: AI生成博客内容

3. **UNSPLASH_ACCESS_KEY**
   - 值: 【你填写的Unsplash Access Key】
   - 用途: 获取封面图

**配置步骤**:
1. 进入GitHub仓库
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 分别添加上述3个Secret

**注意**: `GITHUB_TOKEN` 是自动提供的，不需要手动配置

---

#### 3.4.3 本地环境变量配置
**文件**: `.env.local`

```env
# 天行数据API
TIANAPI_KEY=【待填写】

# Qwen API（SiliconFlow）
QWEN_API_KEY=sk-dgdxmlxmoumvczimwvxzkvbrvxgwtddplzwyjcvyhydmipti

# Unsplash API
UNSPLASH_ACCESS_KEY=【待填写】
```

**注意**: `.env.local` 已在 `.gitignore` 中，不会提交到GitHub

---

#### 3.4.4 Vercel环境变量配置

在Vercel项目设置中也需要添加相同的环境变量（用于构建时读取）：

1. 进入Vercel项目
2. Settings → Environment Variables
3. 添加:
   - `TIANAPI_KEY`
   - `QWEN_API_KEY`
   - `UNSPLASH_ACCESS_KEY`

---

## 四、数据流图

```
┌─────────────────────────────────────────────────────────────────┐
│                     触发（每天早上6:00）                         │
│                  GitHub Actions / 手动命令                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  scripts/generate-ai-post.ts  │
         └───────────────┬───────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  news-fetcher    │          │ content-generator│
│  天行数据API     │─────────▶│  Qwen API        │
│  获取热点        │          │  生成博客        │
└──────────────────┘          └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  image-fetcher   │
                              │  Unsplash API    │
                              │  获取封面图      │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  post-builder    │
                              │  组装Markdown    │
                              └────────┬─────────┘
                                       │
                 ┌─────────────────────┴─────────────────┐
                 │                                       │
                 ▼                                       ▼
    ┌────────────────────┐                  ┌────────────────────┐
    │ content/ai-posts/  │                  │ public/images/     │
    │ YYYY-MM-DD-xxx.md  │                  │ ai-covers/         │
    │ draft: true        │                  │ YYYY-MM-DD.jpg     │
    └────────┬───────────┘                  └────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │  Git Commit        │
    │  自动推送到GitHub  │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │  Vercel自动部署    │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │  你早上审核草稿    │
    │  draft: false      │
    │  正式发布          │
    └────────────────────┘
```

---

## 五、开发计划

### 5.1 开发阶段

#### **Phase 1: 核心功能开发**（预计2-3小时）
- [ ] 创建目录结构
- [ ] 实现 `news-fetcher.ts`
- [ ] 实现 `content-generator.ts`
- [ ] 实现 `image-fetcher.ts`
- [ ] 实现 `post-builder.ts`
- [ ] 创建 `generate-ai-post.ts` 脚本
- [ ] 本地测试生成流程

#### **Phase 2: 前端展示**（预计1-2小时）
- [ ] 实现 `lib/ai-posts.ts`
- [ ] 创建 `app/ai-blog/page.tsx`
- [ ] 创建 `app/ai-blog/[slug]/page.tsx`
- [ ] 修改 `components/Header.tsx`
- [ ] 扩展 `components/PostCard.tsx`（可选）
- [ ] 本地测试前端展示

#### **Phase 3: 自动化配置**（预计30分钟）
- [ ] 创建 `.github/workflows/generate-ai-post.yml`
- [ ] 配置GitHub Secrets
- [ ] 配置Vercel环境变量
- [ ] 测试GitHub Actions手动触发

#### **Phase 4: 测试与优化**（预计1小时）
- [ ] 生成3-5篇测试博客
- [ ] 检查内容质量
- [ ] 优化Prompt
- [ ] 测试错误处理
- [ ] 测试草稿审核流程
- [ ] 性能优化

---

### 5.2 实施步骤

**第一步：API申请**（开发前完成）
1. 注册天行数据，获取API Key
2. 注册Unsplash开发者，获取Access Key
3. 填写到本文档开头的待填写信息

**第二步：本地开发**
1. 创建所有必要的目录和文件
2. 实现核心模块（新闻、生成、图片、组装）
3. 运行 `npm run generate-ai-post` 测试

**第三步：前端开发**
1. 实现AI博客数据处理
2. 创建AI博客列表页和详情页
3. 修改Header导航
4. 本地预览效果

**第四步：自动化配置**
1. 创建GitHub Actions工作流
2. 配置所有必要的Secrets
3. 手动触发测试

**第五步：上线**
1. 提交所有代码到GitHub
2. Vercel自动部署
3. 等待第二天早上6:00自动生成
4. 审核并发布第一篇AI博客

---

## 六、质量保证

### 6.1 内容质量标准

**必须满足**:
- ✅ 字数: 800-1200字
- ✅ 标题: 简洁有力，15字以内
- ✅ 结构: 引子 + 分析 + 升华
- ✅ 风格: 温暖、有深度、不空洞
- ✅ 原创性: 不是简单复述新闻

**质量检查清单**:
- [ ] 是否结合了科技与人文视角？
- [ ] 是否提出了独特观点？
- [ ] 语言是否优美、有文学性？
- [ ] 是否避免了口号式表达？
- [ ] 是否有真实的思考和情感？

**不合格示例**:
- ❌ "科技改变生活，让我们一起拥抱未来"
- ❌ 简单罗列新闻事件
- ❌ 大段空洞的说教

**合格示例**:
- ✅ 从具体现象切入，引用研究数据
- ✅ 提出反思性问题，有个人化表达
- ✅ 结尾有深度思考，不是简单总结

---

### 6.2 技术质量标准

**代码质量**:
- ✅ TypeScript类型完整
- ✅ 错误处理完善
- ✅ 日志记录清晰
- ✅ 代码注释充分

**性能要求**:
- ✅ 单次生成时间 < 60秒
- ✅ API调用有超时设置
- ✅ 图片大小 < 500KB

**稳定性**:
- ✅ API调用失败有重试机制
- ✅ 关键步骤有Fallback方案
- ✅ 生成失败不影响网站正常运行

---

### 6.3 测试清单

**单元测试**:
- [ ] 新闻获取模块
- [ ] 内容生成模块
- [ ] 图片获取模块
- [ ] 文件组装模块

**集成测试**:
- [ ] 完整生成流程
- [ ] 前端展示效果
- [ ] 草稿审核流程

**端到端测试**:
- [ ] GitHub Actions自动运行
- [ ] 自动提交到仓库
- [ ] Vercel自动部署
- [ ] 网站正常显示

---

## 七、风险管理

### 7.1 技术风险

| 风险 | 概率 | 影响 | 应对方案 |
|------|------|------|----------|
| API调用失败 | 中 | 中 | 重试机制 + 告警通知 |
| AI生成质量不佳 | 中 | 高 | 草稿审核 + Prompt优化 |
| 免费额度用尽 | 低 | 中 | 监控用量 + 降频方案 |
| GitHub Actions失败 | 低 | 低 | 手动补发 + 日志追踪 |
| 图片下载失败 | 低 | 低 | Fallback默认图 |
| Vercel部署失败 | 低 | 中 | Vercel日志排查 |

---

### 7.2 成本风险

**API成本预估**（每月30篇）:
- 天行数据: ¥0（免费额度内）
- Qwen API: ¥0（免费额度内）
- Unsplash: ¥0（免费）
- GitHub Actions: ¥0（免费额度内）
- **月成本**: ¥0

**超额情况**:
- 如免费额度用尽，单篇成本约 ¥0.1-0.2
- 月成本上限: ¥6

---

### 7.3 内容风险

| 风险 | 应对方案 |
|------|----------|
| 生成内容不符合个人风格 | 草稿审核 + 手动编辑 |
| 生成敏感或不当内容 | 审核后再发布 + Prompt约束 |
| 重复热点话题 | 每日生成，自然避免重复 |
| 缺乏深度 | 优化Prompt + 提高模型参数 |

---

## 八、监控与维护

### 8.1 日常监控

**每日检查**:
- [ ] GitHub Actions是否成功运行
- [ ] 是否生成了新文章
- [ ] 审核文章质量并决定是否发布

**每周检查**:
- [ ] API调用次数是否正常
- [ ] 生成的文章质量趋势
- [ ] 用户阅读数据（如有）

**每月检查**:
- [ ] API费用统计
- [ ] 生成成功率统计
- [ ] 优化Prompt或参数

---

### 8.2 维护任务

**定期优化**:
- 根据生成效果调整Prompt
- 更新热点新闻源（如API更新）
- 优化图片搜索关键词翻译

**故障处理**:
- API调用失败: 检查密钥、额度、网络
- 生成质量下降: 优化Prompt、调整模型参数
- 部署失败: 查看Vercel日志

---

## 九、扩展功能（未来）

### 9.1 V2.0计划

**内容增强**:
- [ ] 添加文章内配图（2-3张）
- [ ] 支持生成多种风格（严肃/轻松/学术）
- [ ] 引用真实的研究论文或数据

**交互增强**:
- [ ] 用户可以投票"喜欢/不喜欢"
- [ ] 根据反馈调整生成策略
- [ ] 支持用户建议话题

**自动化增强**:
- [ ] 自动发布到社交媒体
- [ ] 自动生成SEO元数据
- [ ] 自动生成摘要音频（TTS）

**分析功能**:
- [ ] 统计最受欢迎的话题
- [ ] 分析阅读时长和跳出率
- [ ] 生成月度报告

---

### 9.2 可选优化

**性能优化**:
- [ ] 缓存热点新闻（避免重复请求）
- [ ] 图片压缩和CDN加速
- [ ] 并行调用API（减少总时间）

**体验优化**:
- [ ] 添加"今日热点"标签展示
- [ ] 生成过程可视化（进度条）
- [ ] 支持RSS订阅AI博客

---

## 十、验收标准

### 10.1 功能完整性

- [ ] 能够每天自动获取热点新闻
- [ ] 能够调用AI生成高质量博客
- [ ] 能够自动获取封面图
- [ ] 能够生成Markdown文件并标记为草稿
- [ ] 能够自动提交到GitHub并部署
- [ ] Header显示"AI博客"导航链接
- [ ] AI博客列表页正常显示
- [ ] AI博客详情页正常显示
- [ ] 草稿过滤功能正常
- [ ] 手动测试命令可用

---

### 10.2 质量标准

**内容质量**:
- [ ] 生成的博客字数在800-1200字
- [ ] 标题简洁有力，不超过15字
- [ ] 内容有深度，不是简单复述
- [ ] 语言温暖优美，符合网站风格
- [ ] 摘要准确概括核心观点

**技术质量**:
- [ ] 代码通过ESLint检查
- [ ] 无TypeScript类型错误
- [ ] 所有API调用有错误处理
- [ ] 关键步骤有日志记录
- [ ] 生成失败不影响网站运行

**用户体验**:
- [ ] AI博客与手写博客有明显区分
- [ ] 页面加载速度正常
- [ ] 移动端显示正常
- [ ] 评论系统正常工作

---

### 10.3 自动化测试

- [ ] 本地手动生成测试通过
- [ ] GitHub Actions手动触发测试通过
- [ ] 定时任务测试通过（等待第二天）
- [ ] 草稿审核流程测试通过
- [ ] Vercel自动部署测试通过

---

## 十一、文档与培训

### 11.1 使用文档

**日常使用**:
1. 每天早上起床后，Pull最新代码
2. 打开 `content/ai-posts/` 查看新生成的文章
3. 阅读审核内容
4. 修改 `draft: true` 为 `draft: false`
5. Commit并Push，等待部署

**手动生成**:
```bash
# 生成今日博客
npm run generate-ai-post

# 查看生成的文件
ls content/ai-posts/

# 预览效果
npm run dev
# 访问 http://localhost:3000/ai-blog
```

**故障排查**:
- 生成失败: 查看终端错误信息
- API错误: 检查环境变量是否配置
- 部署失败: 查看Vercel日志

---

### 11.2 代码注释

**每个模块都需要包含**:
- 文件顶部的功能说明
- 函数的JSDoc注释
- 关键逻辑的行内注释
- 复杂算法的解释

**示例**:
```typescript
/**
 * 从天行数据API获取热点新闻
 *
 * @returns {Promise<FetchedNews>} 包含科技新闻和社会热点的对象
 * @throws {Error} 当API调用失败或超时时抛出错误
 */
async function fetchNews(): Promise<FetchedNews> {
  // 实现...
}
```

---

## 十二、附录

### 12.1 API文档链接

- **天行数据**: https://www.tianapi.com/apiview/223
- **Unsplash API**: https://unsplash.com/documentation
- **Qwen API**: https://docs.siliconflow.cn/

---

### 12.2 参考资源

- **Next.js文档**: https://nextjs.org/docs
- **GitHub Actions**: https://docs.github.com/en/actions
- **Markdown语法**: https://www.markdownguide.org/
- **Cron表达式**: https://crontab.guru/

---

### 12.3 示例Prompt（完整版）

详见第三部分"3.1.2 内容生成模块"中的Prompt设计。

---

### 12.4 故障排查指南

**常见问题**:

1. **生成失败: API调用错误**
   - 检查环境变量是否正确配置
   - 检查API Key是否有效
   - 检查网络连接

2. **图片下载失败**
   - 检查Unsplash API额度
   - 检查关键词翻译是否正确
   - 使用Fallback默认图

3. **GitHub Actions失败**
   - 查看Actions日志
   - 检查Secrets配置
   - 手动本地运行测试

4. **前端不显示AI博客**
   - 检查 `draft: false` 是否设置
   - 检查文件路径是否正确
   - 清除浏览器缓存

---

## 十三、项目里程碑

### 13.1 开发里程碑

| 里程碑 | 目标 | 预计时间 |
|--------|------|----------|
| M1 | 完成核心模块开发 | 第1天 |
| M2 | 完成前端展示 | 第1-2天 |
| M3 | 配置自动化任务 | 第2天 |
| M4 | 测试并优化 | 第2-3天 |
| M5 | 上线第一篇AI博客 | 第3天 |

---

### 13.2 质量里程碑

| 里程碑 | 标准 |
|--------|------|
| Alpha | 核心功能可用，手动测试通过 |
| Beta | 自动化流程完整，质量稳定 |
| RC | 所有测试通过，文档完善 |
| Release | 正式上线，连续3天成功生成 |

---

## 📝 PRD版本信息

- **文档版本**: v1.1
- **创建日期**: 2025-01-15
- **最后更新**: 2025-01-18
- **状态**: ✅ 已确认，准备开发
- **下一步**: 开始实施Phase 1开发

---

## ✅ 最终确认清单

**开始开发前，请确认**:
- [x] 已填写所有API Key
- [x] 已理解整体流程
- [x] 已准备好开发环境
- [x] 已阅读并同意本PRD

**✅ 确认完成，开始实施开发！**

---

## 🚀 实际配置信息（已完成API测试验证）

**已确认的API配置**（2025-01-18测试）:
- **天行数据**: 使用 AI咨询 + 互联网资讯 + 科学探索 三个接口，每个5条，总计15条
- **Qwen模型**: 使用 `Qwen/Qwen2.5-7B-Instruct` 模型（速度快、稳定、token消耗低）
- **新闻API调用方式**: 使用现代 `fetch` API + GET 方法
- **封面图**: V1.0不实现（cover字段留空），简化流程
- **所有API Key**: 已填写完整并验证格式正确

### API测试结果（2025-01-18）

| API | 状态 | 响应时间 | 数据质量 | 备注 |
|-----|------|---------|---------|------|
| **天行数据 - AI咨询** | ✅ 正常 | <1秒 | 优秀 | 有description字段，内容丰富 |
| **天行数据 - 互联网资讯** | ✅ 正常 | <1秒 | 良好 | description可能为空 |
| **天行数据 - 科学探索** | ✅ 正常 | <1秒 | 优秀 | 有description字段，内容丰富 |
| **Qwen2.5-7B-Instruct** | ✅ 正常 | <2秒 | 优秀 | 速度快，适合生产环境 |
| **Unsplash API** | ✅ 正常 | <1秒 | 优秀 | 暂不使用（V2.0考虑） |

### 模型选择决策

**❌ QwQ-32B（被弃用）**：
- 推理模型，深度思考能力强
- 响应时间>30秒，经常超时
- 推理token消耗大（~200+ tokens）
- 不适合自动化场景

**✅ Qwen2.5-7B-Instruct（最终选择）**：
- 指令微调模型，专为对话和生成任务优化
- 响应时间<2秒，稳定可靠
- token消耗合理（~100-150 tokens）
- 完全满足博客生成需求
