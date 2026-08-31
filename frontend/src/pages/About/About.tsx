import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";

export const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t("pages.about")} description={t("footer.description")} path="/about" />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pages.about") }]} />
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900 dark:text-white">{t("pages.about")}</h1>
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>{t("footer.description")}</p>
          <p>
            {t("brand.name")} was founded with a simple mission: make world-class knowledge accessible to
            everyone, regardless of the language they speak. Our editorial team and translation network work
            together to publish carefully researched articles across technology, education, lifestyle,
            business, travel and health — translated into nine languages and counting.
          </p>
          <h2>Our Mission</h2>
          <p>
            Break language barriers and deliver a truly global reading experience, backed by an
            enterprise-grade, API-driven platform ready to scale with MongoDB Atlas.
          </p>
          <h2>Our Values</h2>
          <ul>
            <li>Accuracy and editorial integrity in every language</li>
            <li>Accessibility first — content for every reader, everywhere</li>
            <li>Continuous improvement through reader feedback</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default About;
