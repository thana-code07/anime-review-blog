import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export function RegistrationSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] rounded-2xl bg-brown-200/40 p-8 sm:p-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500">
              <Check className="size-8 text-white" strokeWidth={3} />
            </div>

            <h1 className="text-2xl font-bold text-brown-900">
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
