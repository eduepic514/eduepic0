import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../../constants/languages";
import { SITE_CONFIG } from "../../../constants/site";

export const Settings = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">{t("dashboard.settings")}</h1>

      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Site Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Site Name</label>
            <input defaultValue={SITE_CONFIG.name} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Site Domain</label>
            <input defaultValue={SITE_CONFIG.domain} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Supported Languages</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LANGUAGES.map((lang) => (
            <label key={lang.code} className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
              <input type="checkbox" defaultChecked className="accent-indigo-600" />
              <span>{lang.flag} {lang.nativeName}</span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          The system supports unlimited languages — add new locale JSON files under src/locales to expand coverage.
        </p>
      </div>
    </div>
  );
};

export default Settings;
