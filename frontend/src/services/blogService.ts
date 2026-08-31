import apiClient from "./api";
import { BlogPost, PaginatedResult, SupportedLangCode } from "../types/blog";

export interface GetBlogsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

// ============================================
// REAL API CALLS - NO MOCK DATA
// ============================================

export const getBlogs = async (params: GetBlogsParams = {}): Promise<PaginatedResult<BlogPost>> => {
  try {
    const response = await apiClient.get('/blogs', { params });
    console.log('✅ Blogs fetched from database:', response.data);
    
    // ✅ Parse response properly
    const result = response.data;
    if (result.success && result.data) {
      const data = result.data.data || [];
      return {
        data: data.map((blog: any) => ({
          ...blog,
          id: blog._id || blog.id,
          categorySlug: blog.category?.slug || blog.categorySlug,
          author: blog.author || { name: 'Unknown', avatar: '', bio: '' }
        })),
        total: result.data.total || data.length,
        page: result.data.page || 1,
        pageSize: result.data.pageSize || 6,
        totalPages: result.data.totalPages || 1
      };
    }
    
    return { data: [], total: 0, page: 1, pageSize: 6, totalPages: 1 };
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return { data: [], total: 0, page: 1, pageSize: 6, totalPages: 1 };
  }
};

export const getBlogBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  try {
    console.log(`🔍 Fetching blog with slug: ${slug}`);
    const response = await apiClient.get(`/blogs/${slug}`);
    console.log('✅ Blog response:', response.data);
    
    // ✅ Parse response properly
    const result = response.data;
    if (result.success && result.data) {
      const blogData = result.data.blog;
      if (blogData) {
        return {
          ...blogData,
          id: blogData._id || blogData.id,
          categorySlug: blogData.category?.slug || blogData.categorySlug,
          author: blogData.author || { name: 'Unknown', avatar: '', bio: '' }
        };
      }
    }
    return undefined;
  } catch (error) {
    console.error("❌ Error fetching blog from database:", error);
    return undefined;
  }
};

export const getFeaturedBlogs = async (limit = 4): Promise<BlogPost[]> => {
  try {
    const response = await apiClient.get('/blogs', { 
      params: { featured: true, pageSize: limit } 
    });
    console.log('✅ Featured blogs fetched:', response.data);
    
    const result = response.data;
    if (result.success && result.data) {
      const data = result.data.data || [];
      return data.map((blog: any) => ({
        ...blog,
        id: blog._id || blog.id,
        categorySlug: blog.category?.slug || blog.categorySlug,
        author: blog.author || { name: 'Unknown', avatar: '', bio: '' }
      }));
    }
    return [];
  } catch (error) {
    console.error("❌ Error fetching featured blogs:", error);
    return [];
  }
};

export const getRelatedBlogs = async (blog: BlogPost, limit = 3): Promise<BlogPost[]> => {
  try {
    const response = await apiClient.get('/blogs', { 
      params: { category: blog.categorySlug, pageSize: limit } 
    });
    const result = response.data;
    if (result.success && result.data) {
      const data = result.data.data || [];
      return data
        .filter((b: any) => b._id !== blog.id)
        .map((b: any) => ({
          ...b,
          id: b._id || b.id,
          categorySlug: b.category?.slug || b.categorySlug,
          author: b.author || { name: 'Unknown', avatar: '', bio: '' }
        }));
    }
    return [];
  } catch (error) {
    console.error("❌ Error fetching related blogs:", error);
    return [];
  }
};

// ✅ Normal createBlog - works with JSON data (no files)
export const createBlog = async (payload: any, token: string): Promise<BlogPost> => {
  const response = await apiClient.post('/blogs', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✅ Blog created in database:', response.data);
  
  const result = response.data;
  if (result.success && result.data) {
    const blogData = result.data;
    return {
      ...blogData,
      id: blogData._id || blogData.id,
      categorySlug: blogData.category?.slug || blogData.categorySlug,
      author: blogData.author || { name: 'Unknown', avatar: '', bio: '' }
    };
  }
  throw new Error('Failed to create blog');
};

// ✅ Normal updateBlog - works with JSON data (no files)
export const updateBlog = async (id: string, payload: any, token: string): Promise<BlogPost> => {
  const response = await apiClient.put(`/blogs/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✅ Blog updated in database:', response.data);
  
  const result = response.data;
  if (result.success && result.data) {
    const blogData = result.data;
    return {
      ...blogData,
      id: blogData._id || blogData.id,
      categorySlug: blogData.category?.slug || blogData.categorySlug,
      author: blogData.author || { name: 'Unknown', avatar: '', bio: '' }
    };
  }
  throw new Error('Failed to update blog');
};

export const deleteBlog = async (id: string, token: string): Promise<boolean> => {
  await apiClient.delete(`/blogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✅ Blog deleted from database:', id);
  return true;
};

// ============================================
// FILE UPLOAD FUNCTIONS - FormData
// ============================================

// ✅ Create blog with file upload (FormData)
// ✅ CORRECT: No Content-Type header - let interceptor handle it
export const createBlogWithFiles = async (formData: FormData, token: string): Promise<BlogPost> => {
  const response = await apiClient.post('/blogs', formData, {
    headers: { 
      Authorization: `Bearer ${token}`
      // ✅ DO NOT set Content-Type - interceptor will handle it
    }
  });
  console.log('✅ Blog created with files:', response.data);
  
  const result = response.data;
  if (result.success && result.data) {
    const blogData = result.data;
    return {
      ...blogData,
      id: blogData._id || blogData.id,
      categorySlug: blogData.category?.slug || blogData.categorySlug,
      author: blogData.author || { name: 'Unknown', avatar: '', bio: '' }
    };
  }
  throw new Error('Failed to create blog with files');
};

// ✅ Update blog with file upload (FormData)
// ✅ CORRECT: No Content-Type header - let interceptor handle it
export const updateBlogWithFiles = async (id: string, formData: FormData, token: string): Promise<BlogPost> => {
  const response = await apiClient.put(`/blogs/${id}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`
      // ✅ DO NOT set Content-Type - interceptor will handle it
    }
  });
  console.log('✅ Blog updated with files:', response.data);
  
  const result = response.data;
  if (result.success && result.data) {
    const blogData = result.data;
    return {
      ...blogData,
      id: blogData._id || blogData.id,
      categorySlug: blogData.category?.slug || blogData.categorySlug,
      author: blogData.author || { name: 'Unknown', avatar: '', bio: '' }
    };
  }
  throw new Error('Failed to update blog with files');
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Helper function for translations
export const getTranslation = (blog: BlogPost, lang: SupportedLangCode) => {
  if (!blog || !blog.translations) return null;
  return blog.translations[lang] || blog.translations.en || null;
};

// Helper function to extract video ID
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) return youtubeMatch[1];
  
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) return vimeoMatch[1];
  
  if (url.match(/\.(mp4|webm|ogg)$/i)) return url;
  
  return null;
};

// Helper to create FormData for blog creation/update
export const createBlogFormData = (data: {
  category: string;
  translations: any;
  author?: string;
  tags?: string[];
  featuredImage?: string;
  videoUrl?: string;
  featured?: boolean;
  status?: string;
  imageFile?: File | null;
  videoFile?: File | null;
}): FormData => {
  const formData = new FormData();
  
  // Add basic fields
  formData.append('category', data.category);
  formData.append('translations', JSON.stringify(data.translations));
  
  if (data.author) formData.append('author', data.author);
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));
  if (data.featuredImage) formData.append('featuredImage', data.featuredImage);
  if (data.videoUrl) formData.append('videoUrl', data.videoUrl);
  if (data.featured !== undefined) formData.append('featured', String(data.featured));
  if (data.status) formData.append('status', data.status);
  
  // Add files if present
  if (data.imageFile) {
    formData.append('image', data.imageFile);
  }
  if (data.videoFile) {
    formData.append('video', data.videoFile);
  }
  
  return formData;
};

export default {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getRelatedBlogs,
  createBlog,
  createBlogWithFiles,
  updateBlog,
  updateBlogWithFiles,
  deleteBlog,
  getTranslation,
  extractVideoId,
  createBlogFormData,
};