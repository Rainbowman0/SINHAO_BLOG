/**
 * Post Builder Module
 * 负责生成 Markdown 文件并保存到 content/ai-posts/
 */

import fs from 'fs';
import path from 'path';
import { AIPost, GeneratedContent, FetchedNews, NewsReference } from '@/types/ai-blog';

const AI_POST_DIRECTORY = path.join(process.cwd(), 'content/ai-posts');

export function generateSlug(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `ai-blog-${year}-${month}-${day}-${hours}${minutes}${seconds}${milliseconds}`;
}

export function generateDateString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function buildAIPost(
  content: GeneratedContent,
  news: FetchedNews,
  isDraft: boolean = true,
  cover: string = '',
  references: NewsReference[] = [],
  slugOverride?: string
): AIPost {
  return {
    slug: slugOverride ?? generateSlug(),
    title: content.title,
    date: generateDateString(),
    tags: content.tags,
    cover: cover || '',
    summary: content.summary,
    content: content.content,
    isDraft,
    sourceNews: news,
    references,
    generatedAt: content.generatedAt,
  };
}

function escapeQuotes(value: string): string {
  return value.replace(/"/g, '\\"');
}

function buildFrontmatter(post: AIPost): string {
  const lines = ['---'];
  lines.push(`title: "${escapeQuotes(post.title)}"`);
  lines.push(`date: "${post.date}"`);

  const tagsStr = post.tags.map((tag) => `"${escapeQuotes(tag)}"`).join(', ');
  lines.push(`tags: [${tagsStr}]`);

  if (post.cover) {
    lines.push(`cover: "${escapeQuotes(post.cover)}"`);
  }

  lines.push(`summary: "${escapeQuotes(post.summary)}"`);

  if (post.isDraft) {
    lines.push('draft: true');
  }

  lines.push('---');
  return lines.join('\n');
}

function buildMetadataComments(post: AIPost): string[] {
  return [
    '<!-- AI 生成文章元数据 -->',
    `<!-- 生成时间: ${post.generatedAt} -->`,
    `<!-- 新闻抓取时间: ${post.sourceNews.fetchTime} -->`,
    `<!-- 新闻来源：AI资讯 ${post.sourceNews.aiNews.length} 条 -->`,
    '',
  ];
}

function buildReferenceSection(references: NewsReference[]): string[] {
  if (!references.length) {
    return [];
  }

  const unique = new Map<string, NewsReference>();
  references.forEach((ref) => {
    if (!unique.has(ref.id)) {
      unique.set(ref.id, ref);
    }
  });

  const lines: string[] = ['## 参考资料', ''];

  unique.forEach((ref) => {
    const metaParts: string[] = [];
    if (ref.source) metaParts.push(ref.source);
    if (ref.section) metaParts.push(ref.section);
    if (ref.publishedAt) metaParts.push(ref.publishedAt);
    const meta = metaParts.length ? ` · ${metaParts.join(' · ')}` : '';

    lines.push(`- [${ref.title}](${ref.url})${meta}`);
  });

  return lines;
}

export function buildMarkdown(post: AIPost, includeMetadata: boolean = true): string {
  const sections: string[] = [];
  sections.push(buildFrontmatter(post));
  sections.push('');

  if (includeMetadata) {
    sections.push(...buildMetadataComments(post));
  }

  sections.push(post.content.trim());

  if (includeMetadata) {
    const referenceSection = buildReferenceSection(post.references);
    if (referenceSection.length > 0) {
      sections.push('');
      sections.push('---');
      sections.push('');
      sections.push(...referenceSection);
    }
  }

  return sections.join('\n');
}

function ensureDirectory(directory: string): string {
  const target = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory);

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
    console.log(`[post-builder] Created directory: ${target}`);
  }

  return target;
}

function resolveFilePath(slug: string, directory: string): { filePath: string; fileName: string } {
  const fileName = `${slug}.md`;
  const filePath = path.join(directory, fileName);
  return { fileName, filePath };
}

export async function savePost(
  post: AIPost,
  directory: string = AI_POST_DIRECTORY,
  includeMetadata: boolean = true
): Promise<string> {
  const targetDir = ensureDirectory(directory);
  const { fileName, filePath } = resolveFilePath(post.slug, targetDir);

  if (fs.existsSync(filePath)) {
    const backupPath = path.join(targetDir, `${post.slug}.${Date.now()}.backup.md`);
    fs.renameSync(filePath, backupPath);
    console.warn(`[post-builder] Existing file renamed to backup: ${path.basename(backupPath)}`);
  }

  const markdown = buildMarkdown(post, includeMetadata);
  fs.writeFileSync(filePath, markdown, 'utf8');

  console.log(`[post-builder] Post saved successfully: ${fileName}`);
  console.log(`  - Path: ${filePath}`);
  console.log(`  - Draft: ${post.isDraft ? 'Yes' : 'No'}`);
  console.log(`  - Size: ${Buffer.byteLength(markdown, 'utf8')} bytes`);

  return filePath;
}

export function getAIBlogPosts(directory: string = AI_POST_DIRECTORY): string[] {
  const targetDir = ensureDirectory(directory);
  return fs
    .readdirSync(targetDir)
    .filter((file) => file.startsWith('ai-blog-') && file.endsWith('.md'));
}

export function deleteAIBlogPost(
  slug: string,
  directory: string = AI_POST_DIRECTORY
): boolean {
  const targetDir = ensureDirectory(directory);
  const { filePath } = resolveFilePath(slug, targetDir);

  if (!fs.existsSync(filePath)) {
    console.error(`[post-builder] File not found: ${slug}.md`);
    return false;
  }

  try {
    fs.unlinkSync(filePath);
    console.log(`[post-builder] Deleted: ${slug}.md`);
    return true;
  } catch (error) {
    console.error(`[post-builder] Failed to delete ${slug}.md:`, error);
    return false;
  }
}

export function publishAIBlogPost(
  slug: string,
  directory: string = AI_POST_DIRECTORY
): boolean {
  const targetDir = ensureDirectory(directory);
  const { filePath } = resolveFilePath(slug, targetDir);

  if (!fs.existsSync(filePath)) {
    console.error(`[post-builder] File not found: ${slug}.md`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(/^draft:\s*true\r?\n?/m, '');
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`[post-builder] Published: ${slug}.md`);
    return true;
  } catch (error) {
    console.error(`[post-builder] Failed to publish ${slug}.md:`, error);
    return false;
  }
}
