import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  const { t } = useTranslation();
  return (
    <nav aria-label="breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      <Link to="/" className="hover:text-indigo-600">{t("misc.home")}</Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <span>/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-indigo-600">{item.label}</Link>
          ) : (
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
