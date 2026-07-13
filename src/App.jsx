import { Route, Routes } from "react-router-dom";

import { AccountLayout } from "@/components/AccountLayout";
import { Toaster } from "@/components/ui/sonner";
import { BlogPostPage } from "./pages/BlogPostPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegistrationSuccessPage } from "./pages/RegistrationSuccessPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignUpPage } from "./pages/SignUpPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:postId" element={<BlogPostPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/success" element={<RegistrationSuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AccountLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
