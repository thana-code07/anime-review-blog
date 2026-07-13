import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  FileText,
  Folder,
  LogOut,
  RotateCcw,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { to: "/admin/articles", label: "Article management", icon: FileText },
  { to: "/admin/categories", label: "Category management", icon: Folder },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin/notifications", label: "Notification", icon: Bell, disabled: true },
  { to: "/reset-password", label: "Reset password", icon: RotateCcw },
];

function SidebarLink({ to, label, icon: Icon, disabled, end }) {
  if (disabled) {
    return (
      <span
        className="flex cursor-not-allowed items-center gap-3 px-6 py-3 text-base text-brown-400"
        aria-disabled="true"
      >
        <Icon className="size-5 shrink-0 stroke-[1.5]" aria-hidden />
        {label}
      </span>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-3 px-6 py-3 text-base transition-colors",
          isActive
            ? "bg-brown-200 font-medium text-brown-900 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-brown-900"
            : "text-brown-800 hover:bg-brown-200/60 hover:text-brown-900",
        )
      }
    >
      <Icon className="size-5 shrink-0 stroke-[1.5]" aria-hidden />
      {label}
    </NavLink>
  );
}

export function AdminLayout() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-svh bg-white">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-brown-200 bg-brown-100">
        <div className="px-6 pt-8 pb-6">
          <Link
            to="/"
            className="font-poppins text-2xl font-semibold leading-none text-brown-900 no-underline"
            aria-label="Best Thana home"
          >
            Best Thana<span className="text-green-500">.</span>
          </Link>
          <p className="mt-1 text-sm font-medium text-orange-500">Admin panel</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 py-2" aria-label="Admin">
          {PRIMARY_LINKS.map((link) => (
            <SidebarLink key={link.label} {...link} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-brown-200 py-4">
          <SidebarLink
            to="/"
            label="Best Thana. website"
            icon={SquareArrowOutUpRight}
            end
          />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 text-left text-base text-brown-800 transition-colors hover:bg-brown-200/60 hover:text-brown-900"
          >
            <LogOut className="size-5 shrink-0 stroke-[1.5]" aria-hidden />
            Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
