import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense } from "react";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./components/common/Loader";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import Categories from "./pages/Categories/Categories";
import Category from "./pages/Category/Category";
import SearchPage from "./pages/Search/Search";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";
import FAQ from "./pages/FAQ/FAQ";
import NotFound from "./pages/NotFound/NotFound";

import Login from "./pages/Admin/Login/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminBlogs from "./pages/Admin/Blogs/Blogs";
import AdminCategories from "./pages/Admin/Categories/Categories";
import AdminUsers from "./pages/Admin/Users/Users";
import AdminSettings from "./pages/Admin/Settings/Settings";

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<Loader full />}>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogDetails />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="category/:slug" element={<Category />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="faq" element={<FAQ />} />
                </Route>

                <Route path="admin/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>

                <Route path="*" element={<Layout />}>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
