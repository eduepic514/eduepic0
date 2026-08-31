import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "../../components/seo/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";
import { sendContactMessage } from "../../services/contactService";

export const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await sendContactMessage(form);
    setStatus("done");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800";

  return (
    <>
      <SEO title={t("pages.contact")} description={t("pages.contact")} path="/contact" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pages.contact") }]} />
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900 dark:text-white">{t("pages.contact")}</h1>

        {status === "done" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ {t("buttons.send")} — Thank you! We'll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder={t("forms.name")} value={form.name} onChange={handleChange("name")} className={inputClass} />
              <input required type="email" placeholder={t("forms.email")} value={form.email} onChange={handleChange("email")} className={inputClass} />
            </div>
            <input required placeholder={t("forms.subject")} value={form.subject} onChange={handleChange("subject")} className={inputClass} />
            <textarea required rows={6} placeholder={t("forms.message")} value={form.message} onChange={handleChange("message")} className={inputClass} />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {status === "loading" ? t("misc.loading") : t("buttons.send")}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Contact;
