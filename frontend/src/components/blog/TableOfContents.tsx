import { useTranslation } from "react-i18next";
import { Heading } from "../../utils/extractHeadings";

export const TableOfContents = ({ headings }: { headings: Heading[] }) => {
  const { t } = useTranslation();
  if (!headings.length) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
        {t("misc.tableOfContents")}
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ps-4" : ""}>
            <button
              onClick={() => scrollTo(h.id)}
              className="text-start text-slate-600 transition hover:text-indigo-600 dark:text-slate-300"
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
