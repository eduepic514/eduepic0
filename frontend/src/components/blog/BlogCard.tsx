import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BlogPost, SupportedLangCode } from "../../types/blog";
import { getTranslation } from "../../services/blogService";
import { calculateReadingTime } from "../../utils/readingTime";
import { getCategoryLabel } from "../../services/categoryService";
import { mockCategories } from "../../data/mockCategories";

const API_ORIGIN =
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(
    /\/api\/v1\/?$/,
    ""
  );

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  if (url.startsWith("/uploads/") || url.startsWith("/")) {
    return `${API_ORIGIN}${url}`;
  }
  return url;
};

export const BlogCard = ({
  blog,
  featured = false,
}: {
  blog: BlogPost;
  featured?: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;

  if (!blog?.translations) return null;

  const translation = getTranslation(blog, lang);
  if (!translation) return null;

  const isFallback = !blog.translations[lang];
  const category =
    mockCategories.find((c) => c.slug === blog.categorySlug) || null;

  const imageSrc = getImageUrl(blog.featuredImage);
  const rawDate =
    (blog as any).publishedAt ||
    (blog as any).createdAt ||
    (blog as any).updatedAt ||
    "";
  const dateLabel = rawDate ? new Date(rawDate).toLocaleDateString(lang) : "";

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/50 ${
        featured ? "md:col-span-2 md:flex" : ""
      }`}
    >
      <Link
        to={`/blog/${translation.slug}`}
        className={`block overflow-hidden ${featured ? "md:w-1/2" : ""}`}
      >
        <div
          className="aspect-[16/10] w-full bg-cover bg-center bg-gradient-to-br from-indigo-100 to-violet-100 transition duration-500 group-hover:scale-105 dark:from-slate-700 dark:to-slate-800"
          style={
            imageSrc
              ? {
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
      </Link>

      <div className={`flex flex-1 flex-col p-5 ${featured ? "md:p-7" : ""}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          {category && (
            <Link
              to={`/category/${category.slug}`}
              className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-600 dark:bg-slate-700 dark:text-indigo-300"
            >
              {getCategoryLabel(category, lang)}
            </Link>
          )}
          <span className="text-slate-400">
            {calculateReadingTime(translation.content || "")} {t("misc.minRead")}
          </span>
        </div>

        <Link to={`/blog/${translation.slug}`}>
          <h3
            className={`mb-2 font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white ${
              featured ? "text-2xl" : "text-lg"
            }`}
          >
            {translation.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
          {translation.excerpt || ""}
        </p>

        {isFallback && (
          <p className="mb-3 text-xs italic text-amber-600 dark:text-amber-400">
            {t("misc.translationNotice")}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-700">
          <span>{blog.author?.name || "Unknown"}</span>
          <span>{dateLabel}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;