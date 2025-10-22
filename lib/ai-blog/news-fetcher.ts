/**
 * News Fetcher Module
 * 从天行数据 API 抓取新闻并为 AI 生成做准备
 */

import {
  FetchedNews,
  NewsItem,
  NewsReference,
  TianapiResponse,
  TianapiEndpoint,
} from '@/types/ai-blog';

const TIANAPI_BASE_URL = 'https://apis.tianapi.com';

const SECTION_CONFIG = [
  { key: 'aiNews', endpoint: TianapiEndpoint.AI, label: 'AI资讯', prefix: 'AI' },
] as const;

type SectionKey = (typeof SECTION_CONFIG)[number]['key'];

export interface FormattedNewsResult {
  formattedText: string;
  references: NewsReference[];
  referenceMap: Record<string, NewsReference>;
}

function buildNewsReferences(news: FetchedNews): NewsReference[] {
  const referenced: NewsReference[] = [];

  for (const section of SECTION_CONFIG) {
    const items = news[section.key];
    if (!items?.length) continue;

    items.forEach((item, index) => {
      referenced.push({
        id: `${section.prefix}-${index + 1}`,
        section: section.label,
        title: item.title,
        url: item.url,
        source: item.source,
        summary: item.description,
        publishedAt: item.ctime,
      });
    });
  }

  return referenced;
}

export function buildNewsReferenceMap(news: FetchedNews): Record<string, NewsReference> {
  const entries = buildNewsReferences(news);
  return entries.reduce<Record<string, NewsReference>>((acc, entry) => {
    acc[entry.id] = entry;
    return acc;
  }, {});
}

async function fetchFromTianapi(
  endpoint: TianapiEndpoint,
  num: number = 5
): Promise<NewsItem[]> {
  const apiKey = process.env.TIANAPI_KEY;

  if (!apiKey) {
    throw new Error('TIANAPI_KEY not found in environment variables');
  }

  const url = `${TIANAPI_BASE_URL}/${endpoint}/index?key=${apiKey}&num=${num}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Tianapi request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: TianapiResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`Tianapi error: ${data.msg} (code: ${data.code})`);
    }

    return data.result.newslist;
  } catch (error) {
    console.error(`[news-fetcher] Failed to fetch from ${endpoint}:`, error);
    throw error;
  }
}

export async function fetchAllNews(): Promise<FetchedNews> {
  console.log('[news-fetcher] Fetching AI news...');

  try {
    const aiNewsRaw = await fetchFromTianapi(TianapiEndpoint.AI, 5);
    const aiNews = aiNewsRaw.slice(0, 2);

    if (aiNews.length < 2) {
      throw new Error('Expected at least 2 AI news items from Tianapi');
    }

    const fetchedNews: FetchedNews = {
      aiNews,
      internetNews: [],
      scienceNews: [],
      fetchTime: new Date().toISOString(),
    };

    console.log('[news-fetcher] Successfully fetched AI news:');
    aiNews.forEach((item, index) => {
      console.log(`  - [AI-${index + 1}] ${item.title}`);
    });

    return fetchedNews;
  } catch (error) {
    console.error('[news-fetcher] Failed to fetch news:', error);
    throw new Error('Failed to fetch news from Tianapi');
  }
}

export function formatNewsForAI(news: FetchedNews): FormattedNewsResult {
  const references = buildNewsReferences(news);
  const referenceMap = references.reduce<Record<string, NewsReference>>((acc, ref) => {
    acc[ref.id] = ref;
    return acc;
  }, {});

  const lines: string[] = [];
  lines.push('## 新闻素材概览');
  lines.push('（正文引用时请直接使用 Markdown 链接指向提供的 URL）');
  lines.push('');

  for (const section of SECTION_CONFIG) {
    const items = news[section.key];
    if (!items?.length) continue;

    lines.push(`### ${section.label}`);
    lines.push('');

    items.forEach((item, index) => {
      const id = `${section.prefix}-${index + 1}`;
      lines.push(`- [${id}] ${item.title}`);
      lines.push(`  - 来源：${item.source}｜时间：${item.ctime}`);
      if (item.description) {
        lines.push(`  - 简介：${item.description}`);
      }
      lines.push(`  - 链接：${item.url}`);
      lines.push('');
    });
  }

  const formattedText = lines.join('\n').trim();

  return { formattedText, references, referenceMap };
}

export function validateNewsData(news: FetchedNews): boolean {
  const totalItems = SECTION_CONFIG.reduce(
    (sum, section) => sum + (news[section.key]?.length ?? 0),
    0
  );

  if (totalItems === 0) {
    console.error('[news-fetcher] No news items found');
    return false;
  }

  if (totalItems < 2) {
    console.error('[news-fetcher] Expected at least 2 news items but received fewer');
    return false;
  }

  return true;
}
