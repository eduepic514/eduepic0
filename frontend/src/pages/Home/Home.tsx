import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import SearchBar from "../../components/layout/Search/SearchBar";
import BlogCard from "../../components/blog/BlogCard";
import Loader from "../../components/common/Loader";
import { useFetch } from "../../hooks/useFetch";
import { getFeaturedBlogs, getBlogs } from "../../services/blogService";
import { getCategories } from "../../services/categoryService";
import { getCategoryLabel } from "../../services/categoryService";
import { organizationSchema, websiteSchema } from "../../utils/seoSchemas";
import type { SupportedLangCode } from "../../types/blog";
import { useState, useEffect } from "react";

export const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  const { data: featured, loading: loadingFeatured } = useFetch(() => getFeaturedBlogs(4), []);
  const { data: latest, loading: loadingLatest } = useFetch(() => getBlogs({ page: 1, pageSize: 6 }), []);

  // Fetch real categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <SEO
        title={t("brand.name")}
        description={t("hero.subtitle")}
        path="/"
        jsonLd={[organizationSchema(), websiteSchema()]}
      />

      {/* ====== CATEGORY BAR - From Database ====== */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {categoriesLoading ? (
              <span className="text-sm text-slate-400">Loading categories...</span>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat._id || cat.id}
                  to={`/category/${cat.slug}`}
                  className="whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 flex items-center gap-1.5"
                >
                  <span>{cat.icon || "📁"}</span>
                  {getCategoryLabel(cat, lang)}
                </Link>
              ))
            ) : (
              <span className="text-sm text-slate-400">No categories found</span>
            )}
          </nav>
        </div>
      </div>

      {/* ====== HERO SECTION WITH SHAPE DIVIDER ====== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest">
            {t("brand.tagline")}
          </span>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-base text-indigo-100">{t("hero.subtitle")}</p>
          <div className="mx-auto mb-4 max-w-xl">
            <SearchBar className="[&_input]:py-2.5" />
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            {t("hero.cta")}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Shape Divider */}
        <div className="custom-shape-divider-bottom-1784725825">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section - Quick Links from Database */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t("misc.browseCategories")}</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {categoriesLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-800/50">
                <span className="text-xl">📁</span>
                <span className="text-xs text-slate-400">Loading...</span>
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id || cat.id}
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50"
              >
                <span className="text-xl">{cat.icon || "📁"}</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {getCategoryLabel(cat, lang)}
                </span>
              </Link>
            ))
          ) : (
            <span className="col-span-full text-center text-slate-400">No categories available</span>
          )}
        </div>
      </section>

      {/* Featured Section - From Database */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("misc.featured")}</h2>
          <Link to="/blog" className="text-sm font-medium text-indigo-600 hover:underline">{t("buttons.viewAll")}</Link>
        </div>
        {loadingFeatured ? (
          <Loader />
        ) : featured && featured.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((blog, idx) => (
              <BlogCard key={blog.id} blog={blog} featured={idx === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">No featured articles available</div>
        )}
      </section>

      {/* Latest Articles Section - From Database */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("misc.latestArticles")}</h2>
          <Link to="/blog" className="text-sm font-medium text-indigo-600 hover:underline">{t("buttons.viewAll")}</Link>
        </div>
        {loadingLatest ? (
          <Loader />
        ) : latest && latest.data && latest.data.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.data.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">No articles available</div>
        )}
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-shape-divider-bottom-1784725825 {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }
        .custom-shape-divider-bottom-1784725825 svg {
          position: relative;
          display: block;
          width: calc(102% + 1.3px);
          height: 63px;
        }
        .custom-shape-divider-bottom-1784725825 .shape-fill {
          fill: #FFFFFF;
        }
        .dark .custom-shape-divider-bottom-1784725825 .shape-fill {
          fill: #0f172a;
        }
      `}</style>
    </>
  );
};

export default Home;