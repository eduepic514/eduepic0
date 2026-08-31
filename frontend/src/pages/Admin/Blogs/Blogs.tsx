import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BlogPost, SupportedLangCode } from "../../../types/blog";
import { getBlogs, deleteBlog, createBlog, updateBlog } from "../../../services/blogService";
import { getCategoryLabel, getCategories } from "../../../services/categoryService";
import Loader from "../../../components/common/Loader";
import { getAuthToken } from "../../../services/authService";

export const Blogs = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tags: "",
    featuredImage: "",
    videoUrl: "",
    featured: false,
    status: "published",
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      cleanupPreviews();
    };
  }, []);

  const cleanupPreviews = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
      const result = await getBlogs({ page: 1, pageSize: 100 });
      setBlogs(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const result = await getBlogs({ page: 1, pageSize: 100 });
      setBlogs(result.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || id === "undefined") {
      alert("Invalid blog ID. Please refresh and try again.");
      return;
    }

    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login first");
        return;
      }
      await deleteBlog(id, token);
      await fetchBlogs();
      alert("Blog deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      alert(error.response?.data?.message || error.message || "Error deleting blog. Please try again.");
    }
  };

  // ✅ Handle image file upload from PC
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size should be less than 5MB");
        e.target.value = '';
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file (JPEG, PNG, WebP, etc.)");
        e.target.value = '';
        return;
      }
      
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData({ ...formData, featuredImage: imageUrl });
      
      console.log("✅ Image selected from PC:", file.name);
    }
  };

  // ✅ Handle video file upload from PC
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 100 * 1024 * 1024) {
        alert("Video file size should be less than 100MB");
        e.target.value = '';
        return;
      }
      
      if (!file.type.startsWith('video/')) {
        alert("Please select a video file (MP4, WebM, etc.)");
        e.target.value = '';
        return;
      }
      
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
      
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      setFormData({ ...formData, videoUrl });
      
      console.log("✅ Video selected from PC:", file.name);
    }
  };

  // ✅ Handle URL-based image
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    
    // Clear file if URL is entered
    if (imageFile) {
      setImageFile(null);
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    }
    
    setFormData({ ...formData, featuredImage: url });
    if (url && url.startsWith('http')) {
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  // ✅ Handle URL-based video
  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    
    if (videoFile) {
      setVideoFile(null);
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
    }
    
    setFormData({ ...formData, videoUrl: url });
    if (url && url.startsWith('http')) {
      setVideoPreview(url);
    } else {
      setVideoPreview("");
    }
  };

  const resetForm = () => {
    cleanupPreviews();
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: "",
      tags: "",
      featuredImage: "",
      videoUrl: "",
      featured: false,
      status: "published",
    });
    setImageFile(null);
    setVideoFile(null);
    setImagePreview("");
    setVideoPreview("");
    setEditingBlog(null);
    setIsSubmitting(false);
  };

  // ✅ Complete handleSubmit with FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📤 SUBMIT START");
    
    if (isSubmitting) {
      console.log("⚠️ Already submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login first");
        setIsSubmitting(false);
        return;
      }

      const user = JSON.parse(localStorage.getItem("eduepic_user") || "{}");
      let userId = user.id || user._id || "admin";
      
      if (!formData.categoryId) {
        alert("Please select a valid category");
        setIsSubmitting(false);
        return;
      }

      let finalSlug = formData.slug.trim();
      if (!finalSlug) {
        finalSlug = formData.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }

      // ✅ Create FormData
      const formDataToSend = new FormData();
      
      formDataToSend.append('category', formData.categoryId);
      formDataToSend.append('tags', JSON.stringify(formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean)));
      formDataToSend.append('author', userId);
      formDataToSend.append('featured', String(formData.featured));
      formDataToSend.append('status', formData.status || 'published');
      
      const translations = {
        en: {
          title: formData.title,
          slug: finalSlug,
          excerpt: formData.excerpt,
          content: formData.content,
          metaTitle: formData.title,
          metaDescription: formData.excerpt.substring(0, 160),
          seoKeywords: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
          videoUrl: formData.videoUrl || '',
        }
      };
      formDataToSend.append('translations', JSON.stringify(translations));
      
      // ✅ Add image file if selected from PC
      if (imageFile) {
        console.log("✅ Adding image file:", imageFile.name);
        formDataToSend.append('image', imageFile);
      } else if (formData.featuredImage && formData.featuredImage.startsWith('http')) {
        console.log("✅ Adding image URL:", formData.featuredImage);
        formDataToSend.append('featuredImage', formData.featuredImage);
      }
      
      // ✅ Add video file if selected from PC
      if (videoFile) {
        console.log("✅ Adding video file:", videoFile.name);
        formDataToSend.append('video', videoFile);
      } else if (formData.videoUrl && formData.videoUrl.startsWith('http')) {
        console.log("✅ Adding video URL:", formData.videoUrl);
        formDataToSend.append('videoUrl', formData.videoUrl);
      }

      console.log("📤 Sending request...");

      let result;
      if (editingBlog) {
        const blogId = editingBlog._id || editingBlog.id;
        if (!blogId) {
          alert("Invalid blog ID for update");
          setIsSubmitting(false);
          return;
        }
        result = await updateBlog(blogId, formDataToSend as any, token);
      } else {
        result = await createBlog(formDataToSend as any, token);
      }

      if (result) {
        await fetchBlogs();
        resetForm();
        setShowModal(false);
        alert(editingBlog ? "✅ Blog updated successfully!" : "✅ Blog created successfully!");
      }
    } catch (error: any) {
      console.error("❌ Error saving blog:", error);
      
      // ✅ Better timeout error handling
      if (error.message?.includes('timeout')) {
        alert('Upload is taking too long. Please try with a smaller file.');
      } else {
        alert(error.response?.data?.message || error.message || "Error saving blog. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    const tr = blog.translations.en;
    if (!tr) {
      alert('Blog data is incomplete. Please refresh and try again.');
      return;
    }
    
    const blogId = blog._id || blog.id;
    if (!blogId) {
      alert('Invalid blog data. Please refresh and try again.');
      return;
    }
    
    const category = categories.find(c => c.slug === blog.categorySlug);
    
    setEditingBlog({ ...blog, id: blogId });
    setFormData({
      title: tr.title || '',
      slug: tr.slug || '',
      excerpt: tr.excerpt || '',
      content: tr.content || '',
      categoryId: category?._id || category?.id || "",
      tags: blog.tags ? blog.tags.join(", ") : "",
      featuredImage: blog.featuredImage || "",
      videoUrl: blog.videoUrl || tr.videoUrl || "",
      featured: blog.featured || false,
      status: blog.status || "published",
    });
    
    if (blog.featuredImage) {
      setImagePreview(blog.featuredImage);
    }
    if (blog.videoUrl || tr.videoUrl) {
      setVideoPreview(blog.videoUrl || tr.videoUrl || "");
    }
    
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    cleanupPreviews();
    setShowModal(false);
    resetForm();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("dashboard.blogs")}</h1>
        <button
          onClick={openAddModal}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 flex items-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Blog
        </button>
      </div>

      {/* Blog List Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-start">Title</th>
              <th className="px-4 py-3 text-start">Category</th>
              <th className="px-4 py-3 text-start">Image</th>
              <th className="px-4 py-3 text-start">Video</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No blogs found. Click "Add Blog" to create your first blog.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => {
                const tr = blog.translations.en;
                if (!tr) return null;
                const category = categories.find(c => c.slug === blog.categorySlug);
                const hasImage = blog.featuredImage && blog.featuredImage !== "";
                const hasVideo = blog.videoUrl || tr.videoUrl;
                return (
                  <tr key={blog.id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/50">
                    <td className="max-w-xs truncate px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                      {tr.title}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {category ? getCategoryLabel(category, lang) : blog.categorySlug}
                    </td>
                    <td className="px-4 py-3">
                      {hasImage ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                          ✅ Image
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {hasVideo ? (
                        <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                          🎥 Video
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        blog.status === "published" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300" :
                        blog.status === "draft" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" :
                        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}>
                        {blog.status || "draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button onClick={() => handleEdit(blog)} className="mr-2 text-indigo-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              {editingBlog ? "Edit Blog" : "Add New Blog"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="auto-generated from title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.translations?.en?.name || cat.slug}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="AI, Technology, Education"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Excerpt *</label>
                <input
                  type="text"
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* Featured Image Upload - Link + File */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured Image</label>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={handleImageUrlChange}
                      className="flex-1 min-w-[200px] rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                      placeholder="https://example.com/image.jpg"
                    />
                    <span className="text-sm text-slate-400">OR</span>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 whitespace-nowrap"
                    >
                      📤 Upload from PC
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-32 w-48 object-cover rounded-lg border border-slate-200"
                      />
                      <p className="mt-1 text-xs text-emerald-600">
                        ✅ Image ready {imageFile && `(${imageFile.name})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Upload - Link + File */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Video (YouTube/Vimeo URL or Upload)</label>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={handleVideoUrlChange}
                      className="flex-1 min-w-[200px] rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                      placeholder="https://www.youtube.com/watch?v=xxx or https://vimeo.com/xxx"
                    />
                    <span className="text-sm text-slate-400">OR</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 whitespace-nowrap"
                    >
                      📤 Upload Video
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                  </div>
                  {videoPreview && (
                    <div className="mt-2">
                      {videoPreview.startsWith('blob:') ? (
                        <video className="h-32 w-48 object-cover rounded-lg border border-slate-200" controls>
                          <source src={videoPreview} />
                        </video>
                      ) : (
                        <p className="text-xs text-slate-400">Video URL: {videoPreview}</p>
                      )}
                      <p className="mt-1 text-xs text-emerald-600">
                        ✅ Video ready {videoFile && `(${videoFile.name})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Content * (HTML supported)</label>
                <textarea
                  required
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-800"
                  placeholder="<h2>Heading</h2><p>Your content here...</p>"
                />
                <p className="mt-1 text-xs text-slate-400">Supports HTML: h1-h6, p, ul, ol, li, a, img, strong, em, blockquote</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-1 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold text-white ${
                    isSubmitting 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isSubmitting ? "Saving..." : (editingBlog ? "Update Blog" : "Create Blog")}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
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

export default Blogs;