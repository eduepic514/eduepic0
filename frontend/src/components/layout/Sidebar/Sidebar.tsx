import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mockCategories } from "../../../data/mockCategories";
import { mockBlogs } from "../../../data/mockBlogs";
import { getCategoryLabel } from "../../../services/categoryService";
import { getTranslation } from "../../../services/blogService";
import type { SupportedLangCode } from "../../../types/blog";

export const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;
  const trending = [...mockBlogs].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <aside className="space-y-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
          {t("misc.browseCategories")}
        </h3>
        <ul className="space-y-2">
          {mockCategories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {getCategoryLabel(cat, lang)}
                </span>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
          {t("misc.trendingNow")}
        </h3>
        <ul className="space-y-4">
          {trending.map((blog) => {
            const tr = getTranslation(blog, lang);
            if (!tr) return null;
            return (
              <li key={blog.id}>
                <Link to={`/blog/${tr.slug}`} className="group flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-slate-700 dark:text-indigo-300">
                    {blog.views > 1000 ? `${Math.round(blog.views / 1000)}k` : blog.views}
                  </span>
                  <span className="text-sm font-medium text-slate-700 transition group-hover:text-indigo-600 dark:text-slate-200">
                    {tr.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
