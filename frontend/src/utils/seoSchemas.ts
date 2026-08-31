import { SITE_CONFIG } from "../constants/site";
import { BlogPost } from "../types/blog";

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.domain,
  logo: `${SITE_CONFIG.domain}${SITE_CONFIG.logo}`,
  sameAs: Object.values(SITE_CONFIG.socials),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.domain,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.name,
    item: item.url,
  })),
});

export const articleSchema = (blog: BlogPost, title: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  image: `${SITE_CONFIG.domain}${blog.featuredImage}`,
  datePublished: blog.publishedAt,
  dateModified: blog.updatedAt,
  author: {
    "@type": "Person",
    name: blog.author.name,
    description: blog.author.bio,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: { "@type": "ImageObject", url: `${SITE_CONFIG.domain}${SITE_CONFIG.logo}` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": url },
});

export const faqSchema = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});
