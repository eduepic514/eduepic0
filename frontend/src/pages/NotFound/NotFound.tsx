import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("errors.notFound")} description={t("errors.notFoundDesc")} path="/404" noIndex />
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <span className="mb-4 text-6xl font-black text-indigo-600">404</span>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{t("errors.notFound")}</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">{t("errors.notFoundDesc")}</p>
        <Link to="/" className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
          {t("buttons.backToHome")}
        </Link>
      </div>
    </>
  );
};

export default NotFound;
