import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import SearchBar from "../../components/layout/Search/SearchBar";
import BlogCard from "../../components/blog/BlogCard";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { useFetch } from "../../hooks/useFetch";
import { getBlogs } from "../../services/blogService";

export const Search = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);

  const { data, loading } = useFetch(() => getBlogs({ page, pageSize: 6, search: query }), [page, query]);

  return (
    <>
      <SEO title={`${t("search.title")}: ${query}`} description={t("search.title")} path="/search" noIndex />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-extrabold text-slate-900 dark:text-white">{t("search.title")}</h1>
        {query && (
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            {t("search.resultsFor")} "<span className="font-semibold text-slate-700 dark:text-slate-200">{query}</span>"
          </p>
        )}
        <div className="mb-10">
          <SearchBar autoFocus />
        </div>
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
    </>
  );
};

export default Search;
