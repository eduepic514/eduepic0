import { useTranslation } from "react-i18next";
import { BlogPost } from "../../types/blog";
import BlogCard from "./BlogCard";

export const RelatedArticles = ({ blogs }: { blogs: BlogPost[] }) => {
  const { t } = useTranslation();
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t("misc.relatedArticles")}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.id || `related-${index}`} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;