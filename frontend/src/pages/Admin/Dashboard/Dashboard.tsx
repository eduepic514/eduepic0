import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getBlogs } from "../../../services/blogService";
import { getCategories } from "../../../services/categoryService";
import { getAuthToken } from "../../../services/authService";
import type { SupportedLangCode, BlogPost, Category } from "../../../types/blog";

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;
  
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    totalViews: 0,
    totalUsers: 1,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      // Fetch blogs
      const blogsResult = await getBlogs({ page: 1, pageSize: 100 });
      setBlogs(blogsResult.data);
      
      // Fetch categories
      const categoriesResult = await getCategories();
      setCategories(categoriesResult);
      
      // Calculate stats
      const totalViews = blogsResult.data.reduce((sum, blog) => sum + (blog.views || 0), 0);
      
      setStats({
        totalBlogs: blogsResult.data.length,
        totalCategories: categoriesResult.length,
        totalViews: totalViews,
        totalUsers: 1, // Will be replaced with real user count
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: "Total Blogs", 
      value: stats.totalBlogs, 
      icon: "📝", 
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300" 
    },
    { 
      label: "Categories", 
      value: stats.totalCategories, 
      icon: "🗂️", 
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300" 
    },
    { 
      label: "Total Views", 
      value: stats.totalViews.toLocaleString(), 
      icon: "👁️", 
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" 
    },
    { 
      label: "Admin Users", 
      value: stats.totalUsers, 
      icon: "👥", 
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300" 
    },
  ];

  // Get recent blogs (last 5)
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div key={stat.label || index} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Blogs */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
            Recent Blogs
          </h2>
          <Link to="/admin/blogs" className="text-sm text-indigo-600 hover:underline">
            View All →
          </Link>
        </div>
        
        {recentBlogs.length === 0 ? (
          <p className="text-center py-8 text-slate-400">No blogs found. Create your first blog!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-start text-xs uppercase text-slate-400 dark:border-slate-800">
                  <th className="px-3 py-2 text-start">Title</th>
                  <th className="px-3 py-2 text-start">Category</th>
                  <th className="px-3 py-2 text-start">Views</th>
                  <th className="px-3 py-2 text-start">Status</th>
                  <th className="px-3 py-2 text-start">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBlogs.map((blog) => {
                  const tr = blog.translations?.en;
                  if (!tr) return null;
                  const category = categories.find(c => c.slug === blog.categorySlug);
                  
                  return (
                    <tr key={blog.id || `blog-${blog._id}`} className="border-b border-slate-50 dark:border-slate-800/50">
                      <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-200">
                        <Link to={`/blog/${tr.slug}`} className="hover:text-indigo-600" target="_blank">
                          {tr.title}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                        {category?.translations?.en?.name || blog.categorySlug}
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                        {blog.views?.toLocaleString() || 0}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          blog.status === "published" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300" :
                          blog.status === "draft" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" :
                          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}>
                          {blog.status || "draft"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;