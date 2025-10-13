import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { TableOfContentsItem } from "@/types";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
    })
    .use(rehypePrettyCode, {
      theme: {
        dark: "github-dark",
        light: "github-light",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

export function extractTableOfContents(
  markdown: string
): TableOfContentsItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "");

    toc.push({ id, text, level });
  }

  return toc;
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const chineseCharacters = content.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords =
    content.match(/[a-zA-Z]+/g)?.length || 0;
  const totalWords = chineseCharacters + englishWords;
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  return `${minutes} 分钟`;
}
