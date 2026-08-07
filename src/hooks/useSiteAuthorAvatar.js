import { useEffect, useState } from "react";

import { DEFAULT_AVATAR } from "@/lib/constants";
import { fetchSiteAuthorAvatar } from "@/lib/siteAuthor";

export function useSiteAuthorAvatar() {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    let cancelled = false;

    fetchSiteAuthorAvatar().then((url) => {
      if (!cancelled) setAvatar(url);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return avatar;
}
