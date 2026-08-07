import api from "@/lib/api";

export async function fetchNotifications(scope = "dropdown") {
  const { data } = await api.get("/notifications", {
    params: { scope },
  });
  return data.notifications ?? [];
}

export async function fetchUnreadCount() {
  const { data } = await api.get("/notifications/unread-count");
  return data.count ?? 0;
}

export async function markNotificationsRead() {
  const { data } = await api.post("/notifications/mark-read");
  return data;
}
