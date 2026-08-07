import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchUnreadCount,
  markNotificationsRead,
} from "@/lib/notificationApi";

const POLL_MS = 45_000;

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { isLoggedIn, isBootstrapping } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return 0;
    }

    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
      return count;
    } catch {
      return null;
    }
  }, [isLoggedIn]);

  const markAllRead = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      await markNotificationsRead();
      setUnreadCount(0);
    } catch {
      // keep previous unread count on failure
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isBootstrapping || !isLoggedIn) {
      setUnreadCount(0);
      return undefined;
    }

    let cancelled = false;

    async function poll() {
      try {
        const count = await fetchUnreadCount();
        if (!cancelled) {
          setUnreadCount(count);
        }
      } catch {
        // ignore transient poll errors
      }
    }

    poll();
    const intervalId = window.setInterval(poll, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isLoggedIn, isBootstrapping]);

  const value = useMemo(
    () => ({
      unreadCount,
      hasUnread: unreadCount > 0,
      refreshUnreadCount,
      markAllRead,
    }),
    [unreadCount, refreshUnreadCount, markAllRead],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider",
    );
  }
  return context;
}
