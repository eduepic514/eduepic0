import { useTranslation } from "react-i18next";

const mockUsers = [
  { id: 1, name: "EduEpic Admin", email: "admin@eduepic.com", role: "Super Admin", status: "Active" },
  { id: 2, name: "Sarah Khan", email: "sarah@eduepic.com", role: "Editor", status: "Active" },
  { id: 3, name: "Ahmed Raza", email: "ahmed@eduepic.com", role: "Author", status: "Invited" },
];

export const Users = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("dashboard.users")}</h1>
        <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          + {t("buttons.add")}
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-start">Name</th>
              <th className="px-4 py-3 text-start">Email</th>
              <th className="px-4 py-3 text-start">Role</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{u.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${u.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-end">
                  <button className="mr-2 text-indigo-600 hover:underline">{t("buttons.edit")}</button>
                  <button className="text-red-500 hover:underline">{t("buttons.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
