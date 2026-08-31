import { useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";
import { faqSchema } from "../../utils/seoSchemas";

const faqItems = [
  {
    question: "Which languages does EduEpic support?",
    answer: "EduEpic currently supports English, Urdu, Arabic, Spanish, French, German, Chinese, Hindi and Turkish, with more languages planned.",
  },
  {
    question: "How is the language automatically detected?",
    answer: "On your first visit we detect your browser's language settings. You can change it anytime using the language switcher in the header — your choice is remembered for future visits.",
  },
  {
    question: "What happens if an article isn't translated yet?",
    answer: "If a translation is not yet available in your selected language, we automatically show you the English version so you never miss out on content.",
  },
  {
    question: "Can I contribute an article?",
    answer: "Yes! Reach out via our Contact page and our editorial team will get back to you with contribution guidelines.",
  },
];

export const FAQ = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <SEO title={t("pages.faq")} description={t("pages.faq")} path="/faq" jsonLd={faqSchema(faqItems.map((f) => ({ question: f.question, answer: f.answer })))} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pages.faq") }]} />
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900 dark:text-white">{t("pages.faq")}</h1>
        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-800/50">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="flex w-full items-center justify-between px-5 py-4 text-start text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                {item.question}
                <svg className={`h-4 w-4 shrink-0 transition-transform ${open === idx ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {open === idx && (
                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
