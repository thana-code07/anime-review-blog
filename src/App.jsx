import { Route, Routes } from "react-router-dom";

import { BlogPostPage } from "./pages/BlogPostPage";
import { LandingPage } from "./pages/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/post/:postId" element={<BlogPostPage />} />
    </Routes>
  );
}

export default App;
