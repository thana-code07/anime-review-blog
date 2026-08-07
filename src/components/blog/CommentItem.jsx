import { DEFAULT_AVATAR } from "@/lib/constants";

export function CommentItem({ name, avatar, date, text }) {
  return (
    <div className="flex gap-4 border-t border-brown-300 pt-6">
      <img
        src={avatar || DEFAULT_AVATAR}
        alt={name}
        className="size-10 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-brown-900">{name}</span>
          <span className="text-sm text-brown-600">{date}</span>
        </div>
        <p className="mt-2 text-brown-800">{text}</p>
      </div>
    </div>
  );
}
