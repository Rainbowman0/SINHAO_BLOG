export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover?: string;
  summary: string;
  content: string;
  readingTime?: string;
  views?: number;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover?: string;
  summary: string;
  readingTime?: string;
  views?: number;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}
