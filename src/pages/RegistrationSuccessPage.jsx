import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

// success screen after sign up with link to login
export function RegistrationSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-svh overflow-hidden bg-brown-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(218_214_209/0.55),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgb(146_111_84/0.12),_transparent_45%)]"
        aria-hidden
      />
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center px-4 py-14 sm:py-16">
        <div className="w-full max-w-[480px] rounded-3xl border border-brown-300/70 bg-brown-100/90 p-8 shadow-[0_20px_60px_rgb(38_35_30/0.06)] backdrop-blur-sm sm:p-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-brown-900">
              <Check className="size-8 text-white" strokeWidth={3} />
            </div>

            <h1 className="font-poppins text-2xl font-bold tracking-tight text-brown-900">
              Registration success
            </h1>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Continue
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
