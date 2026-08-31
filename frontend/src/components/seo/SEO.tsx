import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../constants/languages";
import { SITE_CONFIG } from "../../constants/site";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

/**
 * Centralized SEO component: dynamic meta tags, canonical URL, hreflang
 * alternates for every supported language, Open Graph, Twitter Cards and
 * JSON-LD structured data. Used on every page for full SEO coverage.
 */
export const SEO = ({ title, description, path = "/", image, type = "website", jsonLd, noIndex }: SEOProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || "en";
  const canonicalUrl = `${SITE_CONFIG.domain}${path}`;
  const ogImage = image ? `${SITE_CONFIG.domain}${image}` : `${SITE_CONFIG.domain}/logo.svg`;
  const fullTitle = title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`;

  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {LANGUAGES.map((lang) => (
        <link key={lang.code} rel="alternate" hrefLang={lang.code} href={`${SITE_CONFIG.domain}${path}?lang=${lang.code}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_CONFIG.domain}${path}`} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={currentLang} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
