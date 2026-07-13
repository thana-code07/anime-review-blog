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

function toSessionUser(user) {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar ?? null,
  };
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
    avatar: null,
  };

  writeJson(USERS_KEY, [...users, newUser]);

  return { success: true, user: toSessionUser(newUser) };
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

  const sessionUser = toSessionUser(user);

  writeJson(SESSION_KEY, sessionUser);

  return { success: true, user: sessionUser };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function updateProfile({ name, username, avatar }) {
  const session = getCurrentUser();
  if (!session) {
    return { success: false, message: "You must be logged in" };
  }

  const users = getRegisteredUsers();
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === session.email.toLowerCase(),
  );

  if (index === -1) {
    return { success: false, message: "User not found" };
  }

  const trimmedUsername = username.trim();
  const normalizedUsername = trimmedUsername.toLowerCase();

  const usernameTaken = users.some(
    (u, i) =>
      i !== index && u.username.toLowerCase() === normalizedUsername,
  );

  if (usernameTaken) {
    return {
      success: false,
      field: "username",
      message: "Username is already taken",
    };
  }

  const updatedUser = {
    ...users[index],
    name: name.trim(),
    username: trimmedUsername,
    avatar: avatar === undefined ? (users[index].avatar ?? null) : avatar,
  };

  const nextUsers = [...users];
  nextUsers[index] = updatedUser;
  writeJson(USERS_KEY, nextUsers);

  const sessionUser = toSessionUser(updatedUser);
  writeJson(SESSION_KEY, sessionUser);

  return { success: true, user: sessionUser };
}

export function changePassword({ currentPassword, newPassword }) {
  const session = getCurrentUser();
  if (!session) {
    return { success: false, message: "You must be logged in" };
  }

  const users = getRegisteredUsers();
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === session.email.toLowerCase(),
  );

  if (index === -1) {
    return { success: false, message: "User not found" };
  }

  if (users[index].password !== currentPassword) {
    return {
      success: false,
      field: "currentPassword",
      message: "Current password is incorrect",
    };
  }

  const nextUsers = [...users];
  nextUsers[index] = { ...users[index], password: newPassword };
  writeJson(USERS_KEY, nextUsers);

  return { success: true };
}
