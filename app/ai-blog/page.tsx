import { getAllAIPosts } from "@/lib/ai-posts";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";

export const metadata = {
  title: "AI博客 - SINHAO的基地",
  description: "AI每日基于科技新闻生成的深度思考文章",
};

export default function AIBlogPage() {
  const posts = getAllAIPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🤖 AI博客
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              AI每天基于科技新闻，从科技与人文的交叉点进行深度思考
            </p>
          </div>
        </div>

        {/* 说明卡片 */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg p-6">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
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
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                关于AI博客
              </h3>
              <p className="text-purple-700 dark:text-purple-300 leading-relaxed">
                这里的文章由AI基于当日科技新闻自动生成，但不是简单的新闻汇总。
                每篇文章都试图从科技现象中看到人性、社会和未来，用温暖而有力量的文字触动你的思考。
                <br />
                <span className="text-sm mt-2 block text-purple-600 dark:text-purple-400">
                  注：所有文章都经过人工审核后发布
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            暂无AI博客
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            系统会每天自动生成新文章，敬请期待...
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              共 {posts.length} 篇文章
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/ai-blog/${post.slug}`}
                className="group"
              >
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* AI生成徽章 */}
                  <div className="relative">
                    {post.cover ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white shadow-lg">
                            🤖 AI生成
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-purple-300 dark:text-purple-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white shadow-lg">
                            🤖 AI生成
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                      {post.summary}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span>{post.date}</span>
                      {post.readingTime && <span>{post.readingTime}</span>}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-full ${
                              tag === "AI生成"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
