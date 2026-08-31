import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";

export const Terms = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("pages.terms")} description={t("pages.terms")} path="/terms" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pages.terms") }]} />
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900 dark:text-white">{t("pages.terms")}</h1>
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>By using EduEpic you agree to the following terms and conditions.</p>
          <h2>Use of Content</h2>
          <p>All articles are provided for informational purposes only and may not be reproduced without permission.</p>
          <h2>User Conduct</h2>
          <p>Comments and submissions must remain respectful and free of spam or harmful content.</p>
          <h2>Limitation of Liability</h2>
          <p>EduEpic is not liable for any damages resulting from the use of this website.</p>
        </div>
      </div>
    </>
  );
};

export default Terms;
