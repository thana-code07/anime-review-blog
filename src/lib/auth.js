const USERS_KEY = "registeredUsers";
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

export function getRegisteredUsers() {
  return readJson(USERS_KEY, []);
}

export function getCurrentUser() {
  return readJson(SESSION_KEY, null);
}

export function isLoggedIn() {
  return getCurrentUser() !== null;
}

export function registerUser({ name, username, email, password }) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, field: "email", message: "Email is already registered" };
  }

  if (users.some((u) => u.username.toLowerCase() === normalizedUsername)) {
    return { success: false, field: "username", message: "Username is already taken" };
  }

  const newUser = {
    name: name.trim(),
    username: username.trim(),
    email: normalizedEmail,
    password,
  };

  writeJson(USERS_KEY, [...users, newUser]);

  return { success: true, user: { name: newUser.name, username: newUser.username, email: newUser.email } };
}

export function loginUser({ email, password }) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
  );

  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  const sessionUser = {
    name: user.name,
    username: user.username,
    email: user.email,
  };

  writeJson(SESSION_KEY, sessionUser);

  return { success: true, user: sessionUser };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}
