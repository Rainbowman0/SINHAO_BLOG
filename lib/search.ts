import { Index } from "flexsearch";
import { PostMetadata } from "@/types";

let index: Index | null = null;
let posts: PostMetadata[] = [];

export function initializeSearch(allPosts: PostMetadata[]) {
  posts = allPosts;

  index = new Index({
    tokenize: "forward",
  });

  allPosts.forEach((post, i) => {
    const searchContent = `${post.title} ${post.summary} ${post.tags.join(" ")}`;
    index!.add(i, searchContent);
  });
}

export function searchPosts(query: string): PostMetadata[] {
  if (!index || !query.trim()) {
    return [];
  }

  const results = index.search(query, { limit: 10 });
  return results.map((i) => posts[i as number]).filter(Boolean);
}
