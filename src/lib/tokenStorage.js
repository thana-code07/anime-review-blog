const TOKENS_KEY = "authTokens";
const SESSION_KEY = "currentUser";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getTokens() {
  return readJson(TOKENS_KEY, null);
}

export function getAccessToken() {
  return getTokens()?.access_token ?? null;
}

export function setTokens({ access_token, refresh_token }) {
  writeJson(TOKENS_KEY, {
    access_token: access_token ?? null,
    refresh_token: refresh_token ?? null,
  });
}

export function clearTokens() {
  localStorage.removeItem(TOKENS_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function getCachedUser() {
  return readJson(SESSION_KEY, null);
}

export function setCachedUser(user) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  writeJson(SESSION_KEY, user);
}
