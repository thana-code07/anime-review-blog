import { ArticlesSection } from "@/components/blog/ArticlesSection";
import {
  AuthorIntroSection,
  HeroSection,
} from "@/components/blog/HeroSection";
import { FooterSection } from "@/components/layout/FooterSection";
import { Navbar } from "@/components/layout/Navbar";

// home page with hero, author intro, articles, and footer
export function LandingPage() {
  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />
      <main>
        <HeroSection />
        <AuthorIntroSection />
        <ArticlesSection />
      </main>
      <FooterSection />
    </div>
  );
}
