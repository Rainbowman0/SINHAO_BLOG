/**
 * Cover Image Generator
 * Uses SiliconFlow's Kwai-Kolors/Kolors model to create blog cover art
 */

import fs from 'fs';
import path from 'path';
import { NewsReference } from '@/types/ai-blog';

const AI_COVERS_DIR = path.join(process.cwd(), 'public/images/ai-covers');
const KWAI_KOLORS_ENDPOINT = 'https://api.siliconflow.cn/v1/images/generations';

export interface CoverImageParams {
  slug: string;
  tags: string[];
  articleTitle: string;
  articleSummary: string;
  newsHighlights: NewsReference[];
}

interface KwaiKolorsResponse {
  images?: Array<{ url: string }>;
}

function ensureCoversDirectory(): void {
  if (!fs.existsSync(AI_COVERS_DIR)) {
    fs.mkdirSync(AI_COVERS_DIR, { recursive: true });
  }
}

function buildPrompt({ articleTitle, articleSummary, newsHighlights, tags }: CoverImageParams): string {
  const tagPhrase =
    tags
      .filter((tag) => tag !== 'AI生成')
      .slice(0, 3)
      .map((tag) => `“${tag}”`)
      .join('、') || '科技与人文';

  const newsPhrase = newsHighlights
    .slice(0, 2)
    .map((ref) => ref.title)
    .join('；');

  return [
    `Illustrate the theme "${articleTitle}".`,
    `Focus on an atmospheric, modern digital art style that blends technology and humanity.`,
    `Convey these ideas: ${articleSummary}`,
    `Incorporate subtle visual hints of the headlines: ${newsPhrase}.`,
    `Use a warm yet futuristic palette, cinematic lighting, and keep the composition blog-cover friendly.`,
    `Keywords to emphasize: ${tagPhrase}.`
  ].join(' ');
}

async function requestCoverFromKwaiKolors(params: CoverImageParams): Promise<string> {
  const apiKey = process.env.KWAI_KOLORS_API_KEY;

  if (!apiKey) {
    throw new Error('KWAI_KOLORS_API_KEY not found in environment variables');
  }

  const prompt = buildPrompt(params);

  const response = await fetch(KWAI_KOLORS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Kwai-Kolors/Kolors',
      prompt,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Kwai-Kolors image generation failed: ${response.status} ${response.statusText}\n${errorBody}`
    );
  }

  const data = (await response.json()) as KwaiKolorsResponse;
  const imageUrl = data.images?.[0]?.url;

  if (!imageUrl) {
    throw new Error('Kwai-Kolors response did not include an image URL');
  }

  return imageUrl;
}

async function downloadImageToCovers(imageUrl: string, slug: string): Promise<string> {
  ensureCoversDirectory();

  const fileName = `${slug}.png`;
  const filePath = path.join(AI_COVERS_DIR, fileName);

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download generated image: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/images/ai-covers/${fileName}`;
}

export async function fetchCoverImage(params: CoverImageParams): Promise<string> {
  console.log('[image-fetcher] Generating cover image with Kwai-Kolors...');

  try {
    const imageUrl = await requestCoverFromKwaiKolors(params);
    const coverPath = await downloadImageToCovers(imageUrl, params.slug);
    console.log(`[image-fetcher] Cover image generated: ${coverPath}`);
    return coverPath;
  } catch (error) {
    console.error('[image-fetcher] Failed to generate cover image:', error);
    console.warn('[image-fetcher] Falling back to empty cover');
    return '';
  }
}

export function cleanupOldCovers(): void {
  ensureCoversDirectory();

  try {
    const files = fs
      .readdirSync(AI_COVERS_DIR)
      .filter((file) => file.startsWith('ai-blog-') && (file.endsWith('.png') || file.endsWith('.jpg')))
      .map((file) => ({
        name: file,
        path: path.join(AI_COVERS_DIR, file),
        time: fs.statSync(path.join(AI_COVERS_DIR, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    const filesToDelete = files.slice(30);

    filesToDelete.forEach((file) => {
      fs.unlinkSync(file.path);
      console.log(`[image-fetcher] Deleted old cover: ${file.name}`);
    });

    if (filesToDelete.length > 0) {
      console.log(`[image-fetcher] Cleaned up ${filesToDelete.length} old covers`);
    }
  } catch (error) {
    console.error('[image-fetcher] Failed to cleanup old covers:', error);
  }
}
