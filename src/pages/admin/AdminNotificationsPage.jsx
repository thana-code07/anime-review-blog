import { useEffect, useState } from "react";
import { toast } from "sonner";

import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useNotifications } from "@/contexts/NotificationsContext";
import { fetchNotifications } from "@/lib/notificationApi";

// admin list of likes/comments on the current author's articles
export function AdminNotificationsPage() {
  const { markAllRead } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const rows = await fetchNotifications("admin");
        if (cancelled) return;
        setNotifications(rows);
        await markAllRead();
      } catch {
        if (cancelled) return;
        setNotifications([]);
        toast.error("Failed to load notifications");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [markAllRead]);

  return (
    <div className="px-6 py-10 sm:px-10 lg:px-16">
      <h1 className="font-poppins text-3xl font-semibold text-brown-900">
        Notification
      </h1>

      <div className="mt-8 max-w-4xl">
        {isLoading && (
          <p className="py-10 text-brown-600">Loading notifications...</p>
        )}

        {!isLoading && notifications.length === 0 && (
          <p className="border-t border-brown-300 py-10 text-brown-600">
            No notifications yet.
          </p>
        )}

        {!isLoading &&
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              variant="admin"
            />
          ))}
      </div>
    </div>
  );
}
