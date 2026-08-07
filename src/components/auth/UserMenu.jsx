import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  RotateCcw,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";

import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { fetchNotifications } from "@/lib/notificationApi";

function Avatar({ size = "md", alt, src }) {
  const sizeClass = size === "lg" ? "size-12" : "size-10";

  return (
    <img
      src={src || DEFAULT_AVATAR}
      alt={alt}
      className={`${sizeClass} shrink-0 rounded-full object-cover`}
    />
  );
}

function NotificationBellButton({
  showDot = false,
  className = "",
  open = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brown-300 bg-white transition-colors hover:bg-brown-100 ${className}`}
      aria-label="Notifications"
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={onClick}
    >
      <Bell className="size-5 stroke-[1.5] text-brown-800" />
      {showDot && (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
      )}
    </button>
  );
}

function NotificationDropdown({ open, onClose, items, isLoading }) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="absolute top-[calc(100%+8px)] right-0 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-brown-300 bg-white py-2 shadow-md"
    >
      {isLoading && (
        <p className="px-4 py-6 text-center text-sm text-brown-600">
          Loading...
        </p>
      )}
      {!isLoading && items.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-brown-600">
          No notifications yet.
        </p>
      )}
      {!isLoading &&
        items.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            variant="dropdown"
            onNavigate={onClose}
          />
        ))}
    </div>
  );
}

function useNotificationPanel() {
  const { hasUnread, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  async function toggleOpen() {
    const next = !open;
    setOpen(next);

    if (!next) {
      return;
    }

    setIsLoading(true);
    try {
      const notifications = await fetchNotifications("dropdown");
      setItems(notifications);
      await markAllRead();
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  function close() {
    setOpen(false);
  }

  return {
    open,
    items,
    isLoading,
    hasUnread,
    containerRef,
    toggleOpen,
    close,
  };
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

function MenuLinks({ onNavigate, onLogout, isAdmin }) {
  const profilePath = isAdmin ? "/admin/profile" : "/profile";
  const resetPasswordPath = isAdmin
    ? "/admin/reset-password"
    : "/reset-password";

  return (
    <nav className="flex flex-col" aria-label="Account">
      <MenuItem to={profilePath} icon={User} onClick={onNavigate}>
        Profile
      </MenuItem>
      <MenuItem to={resetPasswordPath} icon={RotateCcw} onClick={onNavigate}>
        Reset password
      </MenuItem>
      {isAdmin && (
        <MenuItem
          to="/admin/articles"
          icon={SquareArrowOutUpRight}
          onClick={onNavigate}
        >
          Admin panel
        </MenuItem>
      )}
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
  const { user, logout, isAdmin } = useAuth();
  const panel = useNotificationPanel();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar size="lg" alt="" src={user.avatar} />
        <span className="min-w-0 flex-1 truncate text-base font-medium text-brown-800">
          {user.name}
        </span>
        <div ref={panel.containerRef} className="relative">
          <NotificationBellButton
            showDot={panel.hasUnread}
            open={panel.open}
            onClick={panel.toggleOpen}
          />
          <NotificationDropdown
            open={panel.open}
            onClose={() => {
              panel.close();
              onNavigate?.();
            }}
            items={panel.items}
            isLoading={panel.isLoading}
          />
        </div>
      </div>
      <MenuLinks onNavigate={onNavigate} onLogout={logout} isAdmin={isAdmin} />
    </div>
  );
}

function DesktopUserMenu() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const panel = useNotificationPanel();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      <div ref={panel.containerRef} className="relative">
        <NotificationBellButton
          showDot={panel.hasUnread}
          open={panel.open}
          onClick={panel.toggleOpen}
        />
        <NotificationDropdown
          open={panel.open}
          onClose={panel.close}
          items={panel.items}
          isLoading={panel.isLoading}
        />
      </div>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1 text-brown-800 transition-colors hover:bg-brown-100"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Avatar alt="" src={user.avatar} />
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
            <MenuLinks onNavigate={close} onLogout={logout} isAdmin={isAdmin} />
          </div>
        )}
      </div>
    </div>
  );
}

//user menu for edit profile and reset password and admin panel and logout
export function UserMenu({ variant = "desktop", onNavigate }) {
  if (variant === "mobile") {
    return <MobileUserMenu onNavigate={onNavigate} />;
  }

  return <DesktopUserMenu />;
}
