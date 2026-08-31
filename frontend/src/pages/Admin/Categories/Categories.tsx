import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Category, SupportedLangCode } from "../../../types/blog";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../../services/categoryService";
import { getCategoryLabel } from "../../../services/categoryService";
import { getAuthToken } from "../../../services/authService";
import Loader from "../../../components/common/Loader";

export const Categories = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "📁",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Check if id is valid
    if (!id || id === "undefined") {
      alert("Invalid category ID. Please refresh and try again.");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login first");
        return;
      }
      await deleteCategory(id, token);
      await fetchCategories();
      alert("Category deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || error.message || "Error deleting category. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login first");
        return;
      }

      const payload = {
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        icon: formData.icon || "📁",
        translations: {
          en: { name: formData.name, description: formData.description },
        }
      };

      let result;
      if (editingCategory) {
        // ✅ Ensure we have a valid ID for update
        const catId = editingCategory._id || editingCategory.id;
        if (!catId) {
          alert("Invalid category ID for update");
          return;
        }
        result = await updateCategory(catId, payload, token);
      } else {
        result = await createCategory(payload, token);
      }

      if (result) {
        await fetchCategories();
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: "", slug: "", description: "", icon: "📁" });
        alert(editingCategory ? "Category updated successfully!" : "Category created successfully!");
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || error.message || "Error saving category. Please try again.");
    }
  };

  const handleEdit = (category: Category) => {
    const tr = category.translations.en;
    if (!tr) return;
    
    // ✅ Ensure we have a valid ID
    const catId = category._id || category.id;
    if (!catId) {
      console.error('Category ID is missing:', category);
      alert('Invalid category data. Please refresh and try again.');
      return;
    }
    
    setEditingCategory({ ...category, id: catId });
    setFormData({
      name: tr.name,
      slug: category.slug,
      description: tr.description || "",
      icon: category.icon || "📁",
    });
    setShowModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("dashboard.categories")}</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", slug: "", description: "", icon: "📁" });
            setShowModal(true);
          }}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 flex items-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <div className="col-span-3 py-8 text-center text-slate-400">
            No categories found. Click "Add Category" to create your first category.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{cat.icon || "📁"}</span>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{getCategoryLabel(cat, lang)}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{cat.translations[lang]?.description}</p>
              <p className="mt-2 text-xs text-slate-400">{Object.keys(cat.translations).length}/9 translations</p>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="e.g., Technology"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="auto-generated from name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="📁"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                  rows={3}
                  placeholder="Category description..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-full border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;