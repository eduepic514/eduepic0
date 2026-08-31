import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const navItems = [
  { key: "home", to: "/" },
  { key: "blog", to: "/blog" },
  { key: "categories", to: "/categories" },
  { key: "about", to: "/about" },
  { key: "contact", to: "/contact" },
  { key: "faq", to: "/faq" },
];

export const Navbar = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium transition duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300"
        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 sm:px-8 lg:px-12">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img 
            src="/logo2.png" 
            alt="EduEpic Logo" 
            className="h-9 w-9 object-contain rounded-lg transition-transform hover:scale-105"
          />
          <span className="text-lg font-bold tracking-tight">
            <span className="text-indigo-600 dark:text-indigo-400">Edu</span>
            <span className="text-violet-600 dark:text-violet-400">Epic</span>
          </span>
        </Link>

        {/* Navigation Items - Centered */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.key} to={item.to} end={item.to === "/"} className={linkClass}>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="hidden rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:bg-slate-800 md:inline-block"
          >
            {t("nav.adminLogin")}
          </Link>
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-100 px-6 py-4 dark:border-slate-800 lg:hidden">
          {navItems.map((item) => (
            <NavLink 
              key={item.key} 
              to={item.to} 
              end={item.to === "/"} 
              className={({ isActive }) =>
                `rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t("nav.adminLogin")}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;