import { Navigate, Route, Routes } from "react-router-dom";

import { AccountLayout } from "@/components/layout/AccountLayout";
import {
  AdminCenteredFormLayout,
  AdminLayout,
} from "@/components/layout/AdminLayout";
import { Toaster } from "@/components/ui/sonner";
import { AdminArticleFormPage } from "./pages/admin/AdminArticleFormPage";
import { AdminArticlesPage } from "./pages/admin/AdminArticlesPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminCategoryFormPage } from "./pages/admin/AdminCategoryFormPage";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegistrationSuccessPage } from "./pages/RegistrationSuccessPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignUpPage } from "./pages/SignUpPage";
import HealthTestPage from "./pages/HealthTestPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test-health" element={<HealthTestPage />} />
        <Route path="/post/:postId" element={<BlogPostPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/success" element={<RegistrationSuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AccountLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="articles" replace />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="articles/new" element={<AdminArticleFormPage />} />
          <Route
            path="articles/:articleId/edit"
            element={<AdminArticleFormPage />}
          />
          <Route path="categories/new" element={<AdminCategoryFormPage />} />
          <Route
            path="categories/:categoryId/edit"
            element={<AdminCategoryFormPage />}
          />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route element={<AdminCenteredFormLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
