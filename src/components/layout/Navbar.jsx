import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { UserMenu } from "@/components/auth/UserMenu";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";

// top navigation bar with logo, links, search, and auth actions
export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brown-300/60 bg-brown-100/85 backdrop-blur-md transition-colors">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 lg:h-20 lg:px-[120px]">
          <Logo />

          <div className="hidden items-center gap-2 sm:gap-4 md:flex">
            {isLoggedIn ? (
              <UserMenu variant="desktop" />
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="px-3 py-2 text-sm sm:px-4 sm:text-base"
                  asChild
                >
                  <Link to="/login">Log in</Link>
                </Button>
                <Button
                  variant="primary"
                  className="px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base"
                  asChild
                >
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <CollapsibleTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="border-t border-brown-300/60 bg-brown-100 md:hidden">
          {isLoggedIn ? (
            <UserMenu variant="mobile" onNavigate={closeMenu} />
          ) : (
            <div className="flex flex-col gap-3 px-4 py-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login" onClick={closeMenu}>
                  Log in
                </Link>
              </Button>
              <Button variant="primary" className="w-full" asChild>
                <Link to="/signup" onClick={closeMenu}>
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </header>
  );
}
