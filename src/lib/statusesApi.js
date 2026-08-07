import api from "@/lib/api";

export async function fetchStatuses() {
  const { data } = await api.get("/statuses");
  return data.statuses ?? [];
}

export function statusIdFromLabel(statuses, label) {
  const target = label === "Published" ? "publish" : "draft";
  const match = statuses.find((item) => item.status === target);
  return match?.id ?? null;
}

export function statusLabelFromDb(status) {
  return status === "publish" ? "Published" : "Draft";
}
