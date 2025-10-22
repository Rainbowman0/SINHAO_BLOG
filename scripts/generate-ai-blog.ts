import dotenv from 'dotenv';
import path from 'path';
import {
  fetchAllNews,
  validateNewsData,
  buildNewsReferenceMap,
} from '../lib/ai-blog/news-fetcher';
import {
  generateContentWithRetry,
  validateGeneratedContent,
} from '../lib/ai-blog/content-generator';
import { buildAIPost, savePost, generateSlug } from '../lib/ai-blog/post-builder';
import { fetchCoverImage, cleanupOldCovers } from '../lib/ai-blog/image-fetcher';
import { GenerationStatus, GenerationResult } from '../types/ai-blog';

const envPath = path.join(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

async function main(): Promise<GenerationResult> {
  console.log('============================================================');
  console.log('AI Blog Auto-Generation Script');
  console.log('============================================================');
  console.log('');

  const startTime = Date.now();

  try {
    console.log('Step 1/4: Fetching news from APIs...');
    console.log('------------------------------------------------------------');

    const news = await fetchAllNews();
    if (!validateNewsData(news)) {
      throw new Error('News data validation failed');
    }

    console.log('[OK] News fetched successfully');
    console.log('');

    console.log('Step 2/4: Generating content with DeepSeek...');
    console.log('------------------------------------------------------------');

    const content = await generateContentWithRetry(news, 3);
    const validation = validateGeneratedContent(content);
    if (!validation.valid) {
      console.warn('[WARN] Content validation warnings:', validation.issues);
    }

    const referenceMap = buildNewsReferenceMap(news);
    const references = Object.values(referenceMap).slice(0, 2);

    if (references.length < 2) {
      throw new Error('Expected two references after fetching news');
    }

    console.log('[OK] Content generated successfully');
    console.log('');

    console.log('Step 3/4: Generating cover image with Kwai-Kolors...');
    console.log('------------------------------------------------------------');

    const slug = generateSlug();
    const primaryReference = references[0];
    const coverPath = await fetchCoverImage({
      slug,
      tags: content.tags,
      articleTitle: content.title,
      articleSummary: content.summary,
      newsHighlights: references,
    });

    if (!coverPath) {
      throw new Error('Cover image could not be generated. Check KWAI_KOLORS_API_KEY.');
    }

    console.log('[OK] Cover image saved to ' + coverPath);
    console.log('');

    console.log('Step 4/4: Building and saving post...');
    console.log('------------------------------------------------------------');

    const post = buildAIPost(content, news, true, coverPath, references, slug);
    const filePath = await savePost(post, 'content/ai-posts', true);

    console.log('[OK] Post saved successfully');
    console.log('');

    cleanupOldCovers();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('============================================================');
    console.log('Generation Complete!');
    console.log('============================================================');
    console.log('Title: ' + post.title);
    console.log('Slug: ' + post.slug);
    console.log('File: ' + filePath);
    console.log('Tags: ' + post.tags.join(', '));
    console.log('Draft: ' + (post.isDraft ? 'Yes (manual review needed)' : 'No'));
    console.log('Duration: ' + duration + 's');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Review the generated article content');
    console.log('  2. Make edits directly in the Markdown file if needed');
    console.log('  3. Remove "draft: true" from the frontmatter to publish');
    console.log('============================================================');

    return {
      status: GenerationStatus.SUCCESS,
      post,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.error('');
    console.error('============================================================');
    console.error('Generation Failed!');
    console.error('============================================================');
    console.error('Error: ' + (error instanceof Error ? error.message : String(error)));
    console.error('Duration: ' + duration + 's');
    console.error('============================================================');

    return {
      status: GenerationStatus.ERROR,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
  }
}

function validateEnvironment(): { valid: boolean; missing: string[] } {
  const required = ['TIANAPI_KEY', 'QWEN_API_KEY', 'KWAI_KOLORS_API_KEY'];
  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

async function cli() {
  const envCheck = validateEnvironment();
  if (!envCheck.valid) {
    console.error('Error: Missing required environment variables:');
    envCheck.missing.forEach((key) => {
      console.error('  - ' + key);
    });
    console.error('');
    console.error('Please configure these in .env.local');
    process.exit(1);
  }

  const result = await main();
  if (result.status === GenerationStatus.ERROR) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (require.main === module) {
  cli().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main, validateEnvironment };
