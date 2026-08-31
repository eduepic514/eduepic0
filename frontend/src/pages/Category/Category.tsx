import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";
import BlogCard from "../../components/blog/BlogCard";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { useFetch } from "../../hooks/useFetch";
import { getBlogs } from "../../services/blogService";
import { getCategoryBySlug, getCategoryLabel } from "../../services/categoryService";
import type { SupportedLangCode } from "../../types/blog";

export const Category = () => {
  const { slug = "" } = useParams();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;
  const [page, setPage] = useState(1);

  const { data: category } = useFetch(() => getCategoryBySlug(slug), [slug]);
  const { data, loading } = useFetch(() => getBlogs({ page, pageSize: 6, category: slug }), [page, slug]);

  const categoryName = category ? getCategoryLabel(category, lang) : slug;

  return (
    <>
      <SEO title={categoryName} description={category?.translations[lang]?.description || ""} path={`/category/${slug}`} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("nav.categories"), to: "/categories" }, { label: categoryName }]} />
        <div className="mb-8 flex items-center gap-3">
          <span className="text-3xl">{category?.icon}</span>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{categoryName}</h1>
            {category && <p className="text-sm text-slate-500 dark:text-slate-400">{category.translations[lang]?.description}</p>}
          </div>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {loading ? (
              <Loader />
            ) : data && data.data.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {data.data.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
                <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
              </>
            ) : (
              <EmptyState message={t("search.noResults")} />
            )}
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Category;
