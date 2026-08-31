import apiClient from "./api";
import { Category, SupportedLangCode } from "../types/blog";

// ============================================
// REAL API CALLS - NO MOCK DATA
// ============================================

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/categories");
    console.log('✅ Categories fetched from database:', response.data);
    
    const data = response.data.data || [];
    
    // ✅ Ensure each category has an 'id' field (map from _id)
    return data.map((cat: any) => ({
      ...cat,
      id: cat._id || cat.id,
    }));
  } catch (error) {
    console.error("❌ Error fetching categories from database:", error);
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | undefined> => {
  try {
    const response = await apiClient.get(`/categories/${slug}`);
    
    // ✅ Ensure category has an 'id' field (map from _id)
    const category = response.data.data;
    if (category) {
      category.id = category._id || category.id;
    }
    
    return category;
  } catch (error) {
    console.error("❌ Error fetching category from database:", error);
    return undefined;
  }
};

export const createCategory = async (payload: any, token: string): Promise<Category> => {
  const response = await apiClient.post("/categories", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✅ Category created in database:', response.data);
  
  // ✅ Ensure created category has an 'id' field (map from _id)
  const category = response.data.data;
  if (category) {
    category.id = category._id || category.id;
  }
  
  return category;
};

export const updateCategory = async (id: string, payload: any, token: string): Promise<Category> => {
  const response = await apiClient.put(`/categories/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✅ Category updated in database:', response.data);
  
  // ✅ Ensure updated category has an 'id' field (map from _id)
  const category = response.data.data;
  if (category) {
    category.id = category._id || category.id;
  }
  
  return category;
};

export const deleteCategory = async (id: string, token: string): Promise<boolean> => {
  await apiClient.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✅ Category deleted from database:', id);
  return true;
};

export const getCategoryLabel = (category: Category, lang: SupportedLangCode): string => {
  return category.translations[lang]?.name ?? category.translations.en?.name ?? category.slug;
};