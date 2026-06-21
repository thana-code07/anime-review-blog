import { Navbar } from "../components/layout";
import { HeroSection } from "../components/hero";

export function LandingPage() {
  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
