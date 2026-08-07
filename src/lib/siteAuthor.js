import api from "@/lib/api";
import { DEFAULT_AVATAR } from "@/lib/constants";

let cachedAvatar = undefined;
let inFlight = null;

/** Fetch the public admin avatar once; falls back to DEFAULT_AVATAR. */
export async function fetchSiteAuthorAvatar() {
  if (cachedAvatar !== undefined) {
    return cachedAvatar;
  }

  if (!inFlight) {
    inFlight = api
      .get("/auth/site-author")
      .then(({ data }) => {
        cachedAvatar =
          typeof data?.avatar === "string" && data.avatar.trim()
            ? data.avatar
            : DEFAULT_AVATAR;
        return cachedAvatar;
      })
      .catch(() => {
        cachedAvatar = DEFAULT_AVATAR;
        return cachedAvatar;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
}

/** Clear cache after admin updates their profile picture. */
export function clearSiteAuthorAvatarCache() {
  cachedAvatar = undefined;
}
