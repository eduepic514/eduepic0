import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";
import { mockCategories } from "../../data/mockCategories";
import { getCategoryLabel } from "../../services/categoryService";
import type { SupportedLangCode } from "../../types/blog";

export const Categories = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;

  return (
    <>
      <SEO title={t("nav.categories")} description={t("hero.subtitle")} path="/categories" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("nav.categories") }]} />
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900 dark:text-white">{t("nav.categories")}</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">{getCategoryLabel(cat, lang)}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{cat.translations[lang]?.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
