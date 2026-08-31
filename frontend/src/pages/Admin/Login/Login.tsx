// import { FormEvent, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useAuth } from "../../../context/AuthContext";
// import SEO from "../../../components/seo/SEO";

// export const Login = () => {
//   const { t } = useTranslation();
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("admin@eduepic.com");
//   const [password, setPassword] = useState("Admin@123");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await login(email, password);
//       navigate("/admin/dashboard");
//     } catch {
//       setError(t("errors.invalidCredentials"));
//     }
//   };

//   return (
//     <>
//       <SEO title={t("nav.adminLogin")} description="Admin login" path="/admin/login" noIndex />
//       <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
//         <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-800/50">
//           <div className="mb-6 text-center">
//             <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
//               E
//             </span>
//             <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("nav.adminLogin")}</h1>
//             <p className="mt-1 text-xs text-slate-400">Demo: admin@eduepic.com / Admin@123</p>
//           </div>
//           {error && (
//             <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
//               {error}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="mb-1 block text-xs font-semibold text-slate-500">{t("forms.email")}</label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-xs font-semibold text-slate-500">{t("forms.password")}</label>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
//             >
//               {loading ? t("misc.loading") : t("buttons.login")}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;


import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import SEO from "../../../components/seo/SEO";

export const Login = () => {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("eduepic72@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Only allow eduepic72@gmail.com
    if (email.toLowerCase() !== "eduepic72@gmail.com") {
      setError("Access denied. Only authorized admins can login.");
      return;
    }

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Admin login for EduEpic" path="/admin/login" noIndex />
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-800/50">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
              E
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
            <p className="mt-1 text-xs text-slate-400">Authorized admins only</p>
          </div>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                placeholder="eduepic72@gmail.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;