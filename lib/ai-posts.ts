/**
 * AI Posts Data Module
 * Utility helpers to read and summarize generated AI posts.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostMetadata } from "@/types";
import { calculateReadingTime } from "./markdown";

const aiPostsDirectory = path.join(process.cwd(), "content/ai-posts");

/**
 * Return every AI post slug (files like ai-blog-*.md).
 */
export function getAIPostSlugs(): string[] {
  if (!fs.existsSync(aiPostsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(aiPostsDirectory)
    .filter((file) => file.startsWith("ai-blog-") && file.endsWith(".md"));
}

/**
 * Read a single AI post by slug.
 */
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
  };
}

/**
 * Read all AI posts (metadata only). Drafts are filtered out in production.
 */
export function getAllAIPosts(): PostMetadata[] {
  const slugs = getAIPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        const post = getAIPostBySlug(slug);
        const fullPath = path.join(aiPostsDirectory, slug);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        return {
          slug: post.slug,
          title: post.title,
          date: post.date,
          tags: post.tags,
          cover: post.cover,
          summary: post.summary,
          readingTime: post.readingTime,
          draft: data.draft || false,
        };
      } catch (error) {
        console.error(`Error reading AI post ${slug}:`, error);
        return null;
      }
    })
    .filter((post): post is PostMetadata & { draft?: boolean } => post !== null)
    .filter((post) => {
      if (process.env.NODE_ENV === "production") {
        return !post.draft;
      }
      return true;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

/**
 * Count AI posts (drafts excluded in production).
 */
export function getAIPostsCount(): number {
  return getAllAIPosts().length;
}
