import {
  GeneratedContent,
  FetchedNews,
  QwenAPIConfig,
  QwenAPIRequest,
  QwenAPIResponse,
} from '@/types/ai-blog';
import { formatNewsForAI } from './news-fetcher';

function getModelConfig(): QwenAPIConfig {
  return {
    url: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-V3.1-Terminus',
    apiKey: process.env.QWEN_API_KEY || '',
    temperature: 0.6,
    maxTokens: 2200,
    topP: 0.9,
  };
}

const SYSTEM_PROMPT_LINES = [
  '你是一位关注科技与人文交叉点的中文创作者，擅长把新闻素材融汇成走心的随笔。',
  '',
  '【写作目标】',
  '- 提炼出一个鲜明的核心观点，串联提供的两条科技新闻。',
  '- 用理性分析和具象细节呈现技术对人的影响，保持温度与洞察并存。',
  '',
  '【结构建议】',
  '1. 开篇 120-180 字：用场景或提问引出矛盾或主题。',
  '2. 主体 600-800 字：分 2-3 段展开论证，每段围绕一个论点深化，并在全文自然整合两条新闻。',
  '3. 收束 120-180 字：回到人的处境，给出余味或行动启发。',
  '',
  '【引用规范】',
  '- 必须引用提供的两条新闻，并在正文中用 Markdown 链接 `[标题](URL)` 指向对应链接。',
  '- 不要杜撰外部来源，也不要使用脚注或自行输出参考资料小节（系统会自动补充）。',
  '',
  '【输出格式】',
  '{',
  '  "title": "...",',
  '  "summary": "...", // 80-120 字，概括核心洞察',
  '  "content": "...", // Markdown 正文，含两条新闻的内联链接',
  '  "tags": ["AI生成", "主题标签1", "主题标签2"]',
  '}',
  '',
  '【额外约束】',
  '- 避免空泛口号，为每个判断提供事实或体验支撑。',
  '- 摘要需能独立成段，避免第一人称。',
  '- 若讨论普通人处境或未来趋势，请结合具体场景描绘。',
];

const SYSTEM_PROMPT = SYSTEM_PROMPT_LINES.join('\n');

function buildUserPrompt(news: FetchedNews): string {
  const { formattedText } = formatNewsForAI(news);
  const fetchDate = new Date(news.fetchTime).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lines = [
    `今天是${fetchDate}。以下是经过整理的两条科技新闻素材：`,
    '',
    formattedText,
    '',
    '请围绕这些线索完成深度随笔：',
    '- 提炼一个贯穿全文的核心洞察，避免把新闻简单拼接。',
    '- 在正文中引用新闻时，直接使用 Markdown 链接指向提供的 URL，并确保两条新闻都被引用到。',
    '- 参考资料部分由系统统一生成，无需在正文末尾重复列出。',
  ];

  return lines.join('\n');
}

function normalizeTags(tags: string[]): string[] {
  const cleaned = tags
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && tag !== 'AI生成');
  const unique = Array.from(new Set(cleaned));
  return ['AI生成', ...unique];
}

function parseAIResponse(content: string): Omit<GeneratedContent, 'generatedAt'> {
  try {
    const parsed = JSON.parse(content);
    const tags = Array.isArray(parsed.tags) ? parsed.tags.map((tag: unknown) => String(tag)) : [];

    if (!parsed.title || !parsed.summary || !parsed.content) {
      throw new Error('Missing required fields in AI response');
    }

    return {
      title: String(parsed.title).trim(),
      summary: String(parsed.summary).trim(),
      content: String(parsed.content).trim(),
      tags: normalizeTags(tags),
    };
  } catch (error) {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return parseAIResponse(jsonMatch[1]);
    }
    throw new Error('Failed to parse AI response as JSON');
  }
}

export function validateGeneratedContent(content: GeneratedContent): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!content.title) {
    issues.push('Title is empty');
  } else if (content.title.length > 50) {
    issues.push('Title is too long (>50 characters)');
  }

  if (!content.summary) {
    issues.push('Summary is empty');
  } else if (content.summary.length > 200) {
    issues.push('Summary is too long (>200 characters)');
  }

  if (!content.content) {
    issues.push('Content is empty');
  } else if (content.content.length < 500) {
    issues.push('Content is too short (<500 characters)');
  } else if (content.content.length > 12000) {
    issues.push('Content is too long (>12000 characters)');
  }

  if (!content.tags || content.tags.length === 0) {
    issues.push('No tags provided');
  } else if (content.tags.length > 10) {
    issues.push('Too many tags (>10)');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export async function generateContent(news: FetchedNews): Promise<GeneratedContent> {
  const config = getModelConfig();
  if (!config.apiKey) {
    throw new Error('QWEN_API_KEY not found in environment variables');
  }

  const prompt = buildUserPrompt(news);

  const requestBody: QwenAPIRequest = {
    model: config.model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    top_p: config.topP,
    stream: false,
  };

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `DeepSeek API request failed: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  const data: QwenAPIResponse = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error('DeepSeek API returned empty choices');
  }

  const parsed = parseAIResponse(data.choices[0].message.content);
  return {
    ...parsed,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateContentWithRetry(
  news: FetchedNews,
  maxRetries: number = 3
): Promise<GeneratedContent> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[content-generator] Attempt ${attempt}/${maxRetries}`);
      const content = await generateContent(news);
      const validation = validateGeneratedContent(content);

      if (!validation.valid) {
        console.warn('[content-generator] Content validation issues:', validation.issues);
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`[content-generator] Retrying after ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
      }

      return content;
    } catch (error) {
      lastError = error as Error;
      console.error(`[content-generator] Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`[content-generator] Retrying after ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Failed to generate content after all retries');
}
