import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";

export const Privacy = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("pages.privacy")} description={t("pages.privacy")} path="/privacy" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pages.privacy") }]} />
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900 dark:text-white">{t("pages.privacy")}</h1>
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>Last updated: January 2026</p>
          <p>We collect minimal data required to operate EduEpic, including your preferred language, saved via local storage and cookies to enhance your browsing experience.</p>
          <h2>Information We Collect</h2>
          <p>Contact form submissions, newsletter subscriptions, and anonymized analytics data via Google Analytics.</p>
          <h2>How We Use Information</h2>
          <p>To personalize content, respond to inquiries, and improve our multilingual platform.</p>
          <h2>Cookies</h2>
          <p>We use cookies to remember your language preference and theme setting. You may disable cookies in your browser at any time.</p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
