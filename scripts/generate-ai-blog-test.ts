/**
 * AI Blog Test Script
 * Generates a fresh AI blog draft on every run and requires a cover image.
 */

import { GenerationStatus } from '../types/ai-blog';
import { main, validateEnvironment } from './generate-ai-blog';

async function run() {
  const envCheck = validateEnvironment();
  if (!envCheck.valid) {
    console.error('[ai-blog:test] Missing environment variables:');
    envCheck.missing.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }

  console.log('[ai-blog:test] Starting test generation run...');
  const result = await main();

  if (result.status === GenerationStatus.ERROR) {
    console.error('[ai-blog:test] Generation failed:', result.error ?? 'Unknown error');
    process.exit(1);
  }

  if (!result.post) {
    console.error('[ai-blog:test] No post returned from generator');
    process.exit(1);
  }

  if (!result.post.cover) {
    console.error('[ai-blog:test] Cover image missing - ensure KWAI_KOLORS_API_KEY is configured and reachable');
    process.exit(1);
  }

  console.log('[ai-blog:test] Draft ready at:', result.post.slug);
  console.log('[ai-blog:test] Cover image:', result.post.cover);
}

run().catch((error) => {
  console.error('[ai-blog:test] Unhandled error:', error);
  process.exit(1);
});
