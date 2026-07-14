import { CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { Navbar } from "../components/Navbar.jsx";
import { FooterSection } from "../components/FooterSection.jsx";
import { Button } from "../components/ui/Button.jsx";

// 404 page when a route is not found
export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col bg-brown-100">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
        <CircleAlert
          className="size-16 stroke-[1.5] text-brown-900"
          aria-hidden="true"
        />
        <h1 className="font-poppins text-3xl font-bold text-brown-900">
          Page Not Found
        </h1>
        <Button asChild variant="primary">
          <Link to="/">Go To Homepage</Link>
        </Button>
      </main>
      <FooterSection />
    </div>
  );
}
