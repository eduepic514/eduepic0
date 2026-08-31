import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";
import Loader from "../../components/common/Loader";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import TableOfContents from "../../components/blog/TableOfContents";
import { getBlogBySlug, getRelatedBlogs, getTranslation } from "../../services/blogService";
import { getCategoryBySlug, getCategoryLabel } from "../../services/categoryService";
import { calculateReadingTime } from "../../utils/readingTime";
import { extractHeadings, injectHeadingIds } from "../../utils/extractHeadings";
import { articleSchema, breadcrumbSchema } from "../../utils/seoSchemas";
import { SITE_CONFIG } from "../../constants/site";
import type { SupportedLangCode, BlogPost, Category } from "../../types/blog";

const API_ORIGIN =
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(
    /\/api\/v1\/?$/,
    ""
  );

/** Convert relative /uploads paths to absolute backend URL */
const getMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return `${API_ORIGIN}${url}`;
  }
  // fallback: treat as relative path on API origin
  if (url.startsWith("/")) {
    return `${API_ORIGIN}${url}`;
  }
  return url;
};

export const BlogDetails = () => {
  const { slug = "" } = useParams();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "en") as SupportedLangCode;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const blogData = await getBlogBySlug(slug);
        if (!blogData) {
          setError("Blog not found");
          return;
        }

        // Map → plain object
        let translations: any = blogData.translations || {};
        if (translations instanceof Map) {
          translations = Object.fromEntries(translations);
          blogData.translations = translations;
        }

        setBlog(blogData);

        if (blogData.categorySlug) {
          const catData = await getCategoryBySlug(blogData.categorySlug);
          if (catData) setCategory(catData);
        }

        try {
          const relatedData = await getRelatedBlogs(blogData, 3);
          setRelated(relatedData);
        } catch {
          /* ignore */
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
    else {
      setError("No blog specified");
      setLoading(false);
    }
  }, [slug]);

  const getBlogTranslation = (b: BlogPost | null, lng: string) => {
    if (!b?.translations) return null;
    const tr = b.translations as Record<string, any>;
    return tr[lng] || tr.en || null;
  };

  const translation = getBlogTranslation(blog, lang);

  // ---------- Image ----------
  const renderFeaturedImage = (imageUrl?: string) => {
    if (!imageUrl) return null;
    const src = getMediaUrl(imageUrl);
    if (!src) return null;

    return (
      <div className="mb-8 overflow-hidden rounded-2xl shadow-md">
        <img
          src={src}
          alt={translation?.title || "Blog image"}
          className="aspect-video w-full object-cover"
          onError={(e) => {
            console.error("Image failed:", src);
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    );
  };

  // ---------- Video ----------
  const renderVideo = (videoUrl?: string) => {
    if (!videoUrl) return null;
    const fullUrl = getMediaUrl(videoUrl);

    // YouTube
    const yt = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
    );
    if (yt) {
      return (
        <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${yt[1]}`}
            title="YouTube video"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      );
    }

    // Vimeo
    const vm = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vm) {
      return (
        <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://player.vimeo.com/video/${vm[1]}`}
            title="Vimeo video"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      );
    }

    // Local upload or direct file
    if (
      videoUrl.match(/\.(mp4|webm|ogg)(\?|$)/i) ||
      videoUrl.startsWith("/uploads/") ||
      videoUrl.startsWith("blob:") ||
      fullUrl.includes("/uploads/")
    ) {
      return (
        <div className="mb-8">
          <video
            controls
            playsInline
            preload="metadata"
            src={fullUrl}
            className="w-full rounded-xl bg-black"
            onError={() => console.error("Video failed:", fullUrl)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Other http URL → try iframe
    if (videoUrl.startsWith("http")) {
      return (
        <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={videoUrl}
            title="Video"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      );
    }

    return null;
  };

  if (loading) return <Loader full />;

  if (error || !blog || !translation) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="mb-4 block text-6xl">🔍</span>
        <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
          {error || "Blog Not Found"}
        </h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          The article you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/blog"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const isFallback = !blog.translations?.[lang as SupportedLangCode];
  const readingTime = calculateReadingTime(translation.content || "");
  const headings = extractHeadings(translation.content || "");
  const contentWithIds = injectHeadingIds(translation.content || "");
  const pageUrl = `${SITE_CONFIG.domain}/blog/${translation.slug}`;
  const categoryName = category
    ? getCategoryLabel(category, lang)
    : blog.categorySlug || "";

  // Date: publishedAt → createdAt → updatedAt
  const rawDate =
    (blog as any).publishedAt ||
    (blog as any).createdAt ||
    (blog as any).updatedAt ||
    "";
  const dateLabel = rawDate
    ? new Date(rawDate).toLocaleDateString(lang)
    : "—";

  const authorName =
    blog.author?.name ||
    (typeof (blog as any).author === "string" ? "Admin" : "Unknown");

  const videoUrl = blog.videoUrl || translation?.videoUrl || "";

  return (
    <>
      <SEO
        title={translation.metaTitle || translation.title || "Blog Post"}
        description={translation.metaDescription || translation.excerpt || ""}
        path={`/blog/${translation.slug}`}
        image={getMediaUrl(blog.featuredImage)}
        type="article"
        jsonLd={[
          articleSchema(blog, translation.title, translation.excerpt || "", pageUrl),
          breadcrumbSchema([
            { name: t("nav.blog"), url: `${SITE_CONFIG.domain}/blog` },
            {
              name: categoryName,
              url: `${SITE_CONFIG.domain}/category/${blog.categorySlug}`,
            },
            { name: translation.title, url: pageUrl },
          ]),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t("nav.blog"), to: "/blog" },
            { label: categoryName, to: `/category/${blog.categorySlug}` },
            { label: translation.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article>
            {categoryName && (
              <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                {categoryName}
              </span>
            )}

            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl">
              {translation.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-slate-700">
                  {authorName.charAt(0).toUpperCase()}
                </span>
                {authorName}
              </span>
              <span>•</span>
              <span>
                {t("misc.publishedOn")} {dateLabel}
              </span>
              <span>•</span>
              <span>
                {readingTime} {t("misc.minRead")}
              </span>
            </div>

            {isFallback && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                {t("misc.translationNotice")}
              </div>
            )}

            {/* 1. Featured Image (link OR PC upload) */}
            {renderFeaturedImage(blog.featuredImage)}

            {/* 2. Video (link OR PC upload) */}
            {renderVideo(videoUrl)}

            <div className="mb-8 lg:hidden">
              <TableOfContents headings={headings} />
            </div>

            {/* 3. Content */}
            <div
              className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("misc.tags")}:
              </span>
              {blog.tags && blog.tags.length > 0 ? (
                blog.tags.map((tag, i) => (
                  <span
                    key={`tag-${i}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No tags</span>
              )}
            </div>

            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  {t("misc.relatedArticles")}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((rel) => {
                    const relTr = getTranslation(rel, lang);
                    if (!relTr) return null;
                    return (
                      <Link
                        key={rel.id || rel._id}
                        to={`/blog/${relTr.slug}`}
                        className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/50"
                      >
                        <div
                          className="aspect-[16/10] w-full bg-cover bg-center bg-gradient-to-br from-indigo-100 to-violet-100 transition duration-500 group-hover:scale-105"
                          style={{
                            backgroundImage: rel.featuredImage
                              ? `url(${getMediaUrl(rel.featuredImage)})`
                              : undefined,
                          }}
                        />
                        <div className="p-5">
                          <h3 className="mb-2 text-lg font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white">
                            {relTr.title}
                          </h3>
                          <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                            {relTr.excerpt}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </article>

          <div className="hidden space-y-8 lg:block">
            <div className="sticky top-24 space-y-8">
              <TableOfContents headings={headings} />
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;