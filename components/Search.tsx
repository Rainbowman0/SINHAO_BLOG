"use client";

import { useEffect, useState, useRef } from "react";
import { PostMetadata } from "@/types";
import Link from "next/link";
import { initializeSearch, searchPosts } from "@/lib/search";

interface SearchProps {
  allPosts: PostMetadata[];
  isOpen: boolean;
  onClose: () => void;
}

export function Search({ allPosts, isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostMetadata[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeSearch(allPosts);
  }, [allPosts]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const searchResults = searchPosts(value);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-start justify-center p-4 pt-20">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索文章..."
              className="flex-1 px-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
            />
            <kbd className="hidden sm:block px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto p-4">
            {query && results.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                没有找到相关文章
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    onClick={onClose}
                    className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {post.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!query && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="mb-2">开始输入以搜索文章</p>
                <p className="text-xs">
                  提示: 使用{" "}
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                    Cmd/Ctrl + K
                  </kbd>{" "}
                  快速打开搜索
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
