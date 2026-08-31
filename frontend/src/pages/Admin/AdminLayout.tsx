import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../../components/layout/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "../../components/layout/ThemeToggle/ThemeToggle";

const menuItems = [
  { key: "dashboard", to: "/admin/dashboard", icon: "📊" },
  { key: "blogs", to: "/admin/blogs", icon: "📝" },
  { key: "categories", to: "/admin/categories", icon: "🗂️" },
  { key: "users", to: "/admin/users", icon: "👥" },
  { key: "settings", to: "/admin/settings", icon: "⚙️" },
];

export const AdminLayout = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
            E
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">{t("brand.name")}</span>
        </div>
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("dashboard.menu")}</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <span>{item.icon}</span>
              {t(`dashboard.${item.key}`)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-sm text-slate-400">{t("dashboard.welcome")},</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-300"
            >
              {t("buttons.logout")}
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
