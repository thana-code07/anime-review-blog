import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  RotateCcw,
  User,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_AVATAR = "/default-avatar.png";

function Avatar({ size = "md", alt }) {
  const sizeClass = size === "lg" ? "size-12" : "size-10";

  return (
    <img
      src={DEFAULT_AVATAR}
      alt={alt}
      className={`${sizeClass} shrink-0 rounded-full object-cover`}
    />
  );
}

function NotificationBell({ showDot = false, className = "" }) {
  return (
    <span
      className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brown-300 bg-white ${className}`}
      aria-hidden
    >
      <Bell className="size-5 stroke-[1.5] text-brown-800" />
      {showDot && (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
      )}
    </span>
  );
}

function MenuItem({ to, icon: Icon, children, onClick }) {
  const className =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-base text-brown-800 transition-colors hover:bg-brown-100 hover:text-brown-900";

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={className}>
        <Icon className="size-5 shrink-0 stroke-[1.5]" aria-hidden />
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon className="size-5 shrink-0 stroke-[1.5]" aria-hidden />
      {children}
    </button>
  );
}

function MenuLinks({ onNavigate, onLogout }) {
  return (
    <nav className="flex flex-col" aria-label="Account">
      <MenuItem to="/profile" icon={User} onClick={onNavigate}>
        Profile
      </MenuItem>
      <MenuItem to="/reset-password" icon={RotateCcw} onClick={onNavigate}>
        Reset password
      </MenuItem>
      <div className="mx-4 border-t border-brown-300" role="separator" />
      <MenuItem
        icon={LogOut}
        onClick={() => {
          onLogout();
          onNavigate?.();
        }}
      >
        Log out
      </MenuItem>
    </nav>
  );
}

function MobileUserMenu({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar size="lg" alt="" />
        <span className="min-w-0 flex-1 truncate text-base font-medium text-brown-800">
          {user.name}
        </span>
        <NotificationBell />
      </div>
      <MenuLinks onNavigate={onNavigate} onLogout={logout} />
    </div>
  );
}

function DesktopUserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function close() {
    setOpen(false);
  }

  return (
    <div className="flex items-center gap-3">
      <NotificationBell showDot />

      <div ref={containerRef} className="relative">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1 text-brown-800 transition-colors hover:bg-brown-100"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Avatar alt="" />
          <span className="max-w-[140px] truncate text-base">{user.name}</span>
          <ChevronDown
            className={`size-4 shrink-0 stroke-[1.5] transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute top-[calc(100%+8px)] right-0 z-50 min-w-[220px] overflow-hidden rounded-xl border border-brown-300 bg-white py-1 shadow-md"
          >
            <MenuLinks onNavigate={close} onLogout={logout} />
          </div>
        )}
      </div>
    </div>
  );
}

export function UserMenu({ variant = "desktop", onNavigate }) {
  if (variant === "mobile") {
    return <MobileUserMenu onNavigate={onNavigate} />;
  }

  return <DesktopUserMenu />;
}
