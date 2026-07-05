import { Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { BlogPostPage } from "./pages/BlogPostPage";
import { LandingPage } from "./pages/LandingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:postId" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
