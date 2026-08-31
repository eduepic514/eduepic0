import { useTranslation } from "react-i18next";

export const Loader = ({ full = false }: { full?: boolean }) => {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400 ${full ? "min-h-[50vh]" : "py-16"}`}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      <span className="text-sm">{t("misc.loading")}</span>
    </div>
  );
};

export default Loader;
