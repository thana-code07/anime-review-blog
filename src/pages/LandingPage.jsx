import { Navbar } from "../components/Navbar.jsx";
import { HeroSection } from "../components/HeroSection.jsx";
import { ArticlesSection } from "../components/ArticlesSection.jsx";
import { FooterSection } from "../components/FooterSection.jsx";

// home page with hero, articles section, and footer
export function LandingPage() {
  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />
      <main>
        <HeroSection />
        <ArticlesSection />
      </main>
      <FooterSection />
    </div>
  );
}
