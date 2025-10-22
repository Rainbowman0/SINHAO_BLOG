/**
 * AI Blog Auto-Generation Types
 * 定义 AI 博客自动生成功能的类型系统
 */

/**
 * 新闻源 API 返回的新闻条目
 */
export interface NewsItem {
  id: string;
  ctime: string; // 发布时间
  title: string; // 标题
  description: string; // 描述（可能为空）
  source: string; // 来源
  picUrl: string; // 图片 URL（天行数据提供）
  url: string; // 原文链接
}

/**
 * 天行数据 API 响应结构
 */
export interface TianapiResponse {
  code: number;
  msg: string;
  result: {
    curpage: number;
    allnum: number;
    newslist: NewsItem[];
  };
}

/**
 * 抓取的新闻数据
 */
export interface FetchedNews {
  aiNews: NewsItem[];
  internetNews: NewsItem[];
  scienceNews: NewsItem[];
  fetchTime: string; // 抓取时间（ISO 字符串）
}

export interface NewsReference {
  id: string;
  section: string;
  title: string;
  url: string;
  source: string;
  summary?: string;
  publishedAt?: string;
}

/**
 * Qwen 返回的生成结果
 */
export interface GeneratedContent {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  generatedAt: string;
}

/**
 * AI 生成的博客文章（最终格式）
 */
export interface AIPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover: string;
  summary: string;
  content: string;
  isDraft: boolean;
  sourceNews: FetchedNews;
  references: NewsReference[];
  generatedAt: string;
}

/**
 * Qwen API 配置
 */
export interface QwenAPIConfig {
  url: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

/**
 * Qwen API 请求体
 */
export interface QwenAPIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
}

/**
 * Qwen API 响应
 */
export interface QwenAPIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 天行数据 API 端点枚举
 */
export enum TianapiEndpoint {
  AI = 'ai',
  INTERNET = 'internet',
  SCIENCE = 'sicprobe',
}

/**
 * 生成状态
 */
export enum GenerationStatus {
  FETCHING_NEWS = 'fetching_news',
  GENERATING_CONTENT = 'generating_content',
  BUILDING_POST = 'building_post',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * 生成结果
 */
export interface GenerationResult {
  status: GenerationStatus;
  post?: AIPost;
  error?: string;
  timestamp: string;
}
