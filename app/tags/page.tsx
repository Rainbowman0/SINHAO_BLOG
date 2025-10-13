import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";

export const metadata = {
  title: "分类 - 我的博客",
  description: "浏览所有文章分类",
};

interface TagsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function TagsPage({ searchParams }: TagsPageProps) {
  const params = await searchParams;
  const selectedTag = params.tag;
  const allTags = getAllTags();
  const posts = selectedTag ? getPostsByTag(selectedTag) : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          文章分类
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          探索不同主题的文章
        </p>
      </div>

      {/* Tags Cloud */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {allTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags?tag=${encodeURIComponent(tag)}`}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedTag === tag
                  ? "bg-primary-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              {tag}
              <span className="ml-2 text-sm opacity-75">({count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {selectedTag && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              标签: {selectedTag}
            </h2>
            <Link
              href="/tags"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              查看所有标签
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                该分类下暂无文章
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedTag && allTags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">暂无分类标签</p>
        </div>
      )}
    </div>
  );
}
