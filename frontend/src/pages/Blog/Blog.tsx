import { useState } from "react";
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
import { breadcrumbSchema } from "../../utils/seoSchemas";
import { SITE_CONFIG } from "../../constants/site";

export const Blog = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(() => getBlogs({ page, pageSize: 6 }), [page]);

  return (
    <>
      <SEO
        title={t("nav.blog")}
        description={t("hero.subtitle")}
        path="/blog"
        jsonLd={breadcrumbSchema([{ name: t("nav.blog"), url: `${SITE_CONFIG.domain}/blog` }])}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("nav.blog") }]} />
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900 dark:text-white">{t("nav.blog")}</h1>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {loading ? (
              <Loader />
            ) : data && data.data && data.data.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {data.data.map((blog, index) => (
                    <BlogCard 
                      key={blog.id || `blog-${index}`}
                      blog={blog} 
                    />
                  ))}
                </div>
                <Pagination 
                  page={page} 
                  totalPages={data.totalPages || 1} 
                  onChange={setPage} 
                />
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

export default Blog;