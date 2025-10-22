import { getAIPostBySlug, getAIPostSlugs } from "@/lib/ai-posts";
import { markdownToHtml, extractTableOfContents } from "@/lib/markdown";
import { TableOfContents } from "@/components/TableOfContents";
import { Comments } from "@/components/Comments";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface AIPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAIPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({ params }: AIPostPageProps) {
  const { slug } = await params;
  try {
    const post = getAIPostBySlug(slug);
    return {
      title: `${post.title} - AI博客`,
      description: post.summary,
    };
  } catch {
    return {
      title: "文章未找到",
    };
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
        {/* 返回AI博客列表 */}
        <div className="mb-8">
          <Link
            href="/ai-blog"
            className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回AI博客列表
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          {/* Main Content */}
          <article className="min-w-0">
            {/* AI生成提示 */}
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  本文由AI基于当日科技新闻自动生成，内容经过人工审核。
                  文章旨在提供思考角度，而非客观事实陈述。
                </p>
              </div>
            </div>

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formattedDate}
                </span>
                {post.readingTime && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
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
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium"
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
                prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-primary-600 dark:prose-a:text-primary-400
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-primary-600 dark:prose-code:text-primary-400
                prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Comments */}
            <div className="mt-12">
              <Comments />
            </div>
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
