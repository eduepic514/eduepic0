import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SITE_CONFIG } from "../../../constants/site";
import { mockCategories } from "../../../data/mockCategories";
import { getCategoryLabel } from "../../../services/categoryService";
import { subscribeNewsletter } from "../../../services/contactService";
import type { SupportedLangCode } from "../../../types/blog";

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await subscribeNewsletter(email);
    setStatus("done");
    setEmail("");
  };

  return (
    <footer className="border-t border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
                E
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{t("brand.name")}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t("footer.description")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/" className="hover:text-indigo-600">{t("nav.home")}</Link></li>
              <li><Link to="/blog" className="hover:text-indigo-600">{t("nav.blog")}</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600">{t("nav.about")}</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600">{t("nav.contact")}</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-600">{t("nav.faq")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {mockCategories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-indigo-600">
                    {getCategoryLabel(cat, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              {t("footer.newsletter")}
            </h4>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{t("footer.newsletterDesc")}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.newsletterPlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {status === "done" ? "✓" : t("footer.subscribe")}
              </button>
            </form>
            <div className="mt-4 flex gap-3 text-slate-400">
              {["facebook", "twitter", "instagram", "linkedin", "youtube"].map((social) => (
                <a
                  key={social}
                  href={SITE_CONFIG.socials[social as keyof typeof SITE_CONFIG.socials]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social}
                  className="transition hover:text-indigo-600"
                >
                  <span className="text-sm capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-slate-800 sm:flex-row">
          <p>© {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-indigo-600">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-indigo-600">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
