export interface BlogTranslation {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  videoUrl?: string;
  videoFile?: string;
}

export type SupportedLangCode =
  | "en"
  | "ur"
  | "ar"
  | "es"
  | "fr"
  | "de"
  | "zh"
  | "hi"
  | "tr";

export interface BlogPost {
  _id?: string;
  id: string;
  categorySlug: string;
  tags: string[];
  featuredImage: string;
  videoUrl?: string;
  videoFile?: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
  status?: "draft" | "published" | "archived";
  translations: Partial<Record<SupportedLangCode, BlogTranslation>>;
}

export interface Category {
  _id?: string;
  id: string;
  slug: string;
  icon: string;
  image?: string; // ✅ URL ya /uploads/images/...
  translations: Partial<
    Record<SupportedLangCode, { name: string; description: string }>
  >;
}

export interface Comment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}