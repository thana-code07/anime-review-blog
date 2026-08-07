import { Link } from "react-router-dom";

import { DEFAULT_AVATAR } from "@/lib/constants";
import { formatNotificationTime } from "@/lib/formatDate";

function buildActionText(notification) {
  const title = notification.post_title || "an article";

  switch (notification.type) {
    case "post_like":
      return `liked your article: ${title}`;
    case "post_comment":
      return `Commented on your article: ${title}`;
    case "new_post":
      return "Published new article.";
    case "thread_comment":
      return "Comment on the article you have commented on.";
    default:
      return "sent a notification.";
  }
}

function postPath(notification) {
  const isCommentType =
    notification.type === "post_comment" ||
    notification.type === "thread_comment";
  return isCommentType
    ? `/post/${notification.post_id}#comments`
    : `/post/${notification.post_id}`;
}

export function NotificationItem({
  notification,
  variant = "dropdown",
  onNavigate,
}) {
  const actorName = notification.actor?.name || "Someone";
  const avatar = notification.actor?.profile_pic || DEFAULT_AVATAR;
  const actionText = buildActionText(notification);
  const to = postPath(notification);
  const showPreview =
    variant === "admin" &&
    notification.type === "post_comment" &&
    notification.message_preview;

  if (variant === "admin") {
    return (
      <div className="flex items-start gap-4 border-b border-brown-300 py-6 last:border-b-0">
        <img
          src={avatar}
          alt=""
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-base leading-relaxed text-brown-800">
            <span className="font-semibold text-brown-900">{actorName}</span>{" "}
            {actionText}
          </p>
          {showPreview && (
            <p className="mt-2 text-base leading-relaxed text-brown-600">
              “{notification.message_preview}”
            </p>
          )}
          <p className="mt-2 text-sm text-brown-500">
            {formatNotificationTime(notification.created_at)}
          </p>
        </div>
        <Link
          to={to}
          onClick={onNavigate}
          className="shrink-0 text-base text-brown-900 underline underline-offset-2 hover:text-brown-600"
        >
          View
        </Link>
      </div>
    );
  }

  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-brown-100"
    >
      <img
        src={avatar}
        alt=""
        className="size-10 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-brown-800">
          <span className="font-semibold text-brown-900">{actorName}</span>{" "}
          <span className="text-brown-600">{actionText}</span>
        </p>
        <p className="mt-1 text-xs text-brown-500">
          {formatNotificationTime(notification.created_at)}
        </p>
      </div>
    </Link>
  );
}
