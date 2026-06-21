import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-brown-300 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 lg:h-20 lg:px-[120px]">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            className="px-3 py-2 text-sm sm:px-4 sm:text-base"
          >
            Log in
          </Button>
          <Button
            variant="primary"
            className="px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base"
          >
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
