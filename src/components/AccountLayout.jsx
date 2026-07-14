import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { RotateCcw, User } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR = "/default-avatar.png";

const ACCOUNT_LINKS = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/reset-password", label: "Reset password", icon: RotateCcw },
];

function getSectionTitle(pathname) {
  if (pathname.startsWith("/reset-password")) return "Reset password";
  return "Profile";
}

function AccountNavLink({ to, label, icon: Icon, variant }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 text-base transition-colors",
          variant === "tabs" && "gap-2 py-1",
          variant === "sidebar" && "gap-3 rounded-xl px-4 py-3",
          variant === "tabs" &&
            (isActive
              ? "font-semibold text-brown-900"
              : "font-normal text-brown-600 hover:text-brown-900"),
          variant === "sidebar" &&
            (isActive
              ? "bg-brown-200 font-medium text-brown-900"
              : "text-brown-800 hover:bg-brown-200/60 hover:text-brown-900"),
        )
      }
    >
      <Icon className="size-5 shrink-0 stroke-[1.5]" aria-hidden />
      {label}
    </NavLink>
  );
}

// account pages shell with profile sidebar and outlet
export function AccountLayout() {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const sectionTitle = getSectionTitle(location.pathname);
  const avatarSrc = user.avatar || DEFAULT_AVATAR;

  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-4 sm:px-8 sm:py-6 lg:px-[120px] lg:py-8">
        <nav
          className="mb-6 flex flex-row gap-6 md:hidden"
          aria-label="Account settings"
        >
          {ACCOUNT_LINKS.map((link) => (
            <AccountNavLink key={link.to} {...link} variant="tabs" />
          ))}
        </nav>

        <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
          <img
            src={avatarSrc}
            alt=""
            className="size-10 shrink-0 rounded-full object-cover sm:size-14"
          />
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="truncate text-base font-semibold text-brown-900 sm:text-xl">
              {user.name}
            </span>
            <span
              className="h-5 w-px shrink-0 bg-brown-300 sm:h-6"
              aria-hidden
            />
            <span className="shrink-0 text-base font-semibold text-brown-900 sm:text-xl">
              {sectionTitle}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          <aside className="hidden w-56 shrink-0 md:block">
            <nav
              className="flex flex-col gap-1"
              aria-label="Account settings"
            >
              {ACCOUNT_LINKS.map((link) => (
                <AccountNavLink key={link.to} {...link} variant="sidebar" />
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
