import api, { getApiErrorField, getApiErrorMessage } from "@/lib/api";
import {
  clearTokens,
  getCachedUser,
  setCachedUser,
  setTokens,
} from "@/lib/tokenStorage";

export function toSessionUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.profile_pic ?? user.avatar ?? null,
    role: user.role === "admin" ? "admin" : "user",
  };
}

function saveSession(payload) {
  const sessionUser = toSessionUser(payload.user);

  if (payload.access_token) {
    setTokens({
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
    });
  }

  setCachedUser(sessionUser);
  return sessionUser;
}

export function getCurrentUser() {
  return getCachedUser();
}

export async function registerUser({ name, username, email, password }) {
  try {
    const { data } = await api.post("/auth/register", {
      name,
      username,
      email,
      password,
    });

    if (data.access_token) {
      saveSession(data);
    }

    return { success: true, user: toSessionUser(data.user) };
  } catch (error) {
    return {
      success: false,
      field: getApiErrorField(error),
      message: getApiErrorMessage(error, "Registration failed"),
    };
  }
}

export async function loginUser({ email, password }) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    const user = saveSession(data);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Invalid email or password"),
    };
  }
}

export function logoutUser() {
  clearTokens();
}

export async function fetchCurrentUser() {
  try {
    const { data } = await api.get("/auth/get-user");
    const user = toSessionUser(data.user);
    setCachedUser(user);
    return { success: true, user };
  } catch (error) {
    const status = error.response?.status;
    const isAuthFailure = status === 401 || status === 403;

    if (isAuthFailure) {
      clearTokens();
      return {
        success: false,
        cleared: true,
        message: getApiErrorMessage(error, "Session expired"),
      };
    }

    return {
      success: false,
      cleared: false,
      message: getApiErrorMessage(error, "Could not refresh session"),
    };
  }
}

export async function updateProfile({ name, username, avatar }) {
  try {
    const body = { name, username };

    // Only include profile_pic when explicitly provided (undefined = leave unchanged)
    if (avatar !== undefined) {
      body.profile_pic = avatar;
    }

    const { data } = await api.put("/auth/profile", body);

    const user = toSessionUser(data.user);
    setCachedUser(user);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      field: getApiErrorField(error),
      message: getApiErrorMessage(error, "Failed to update profile"),
    };
  }
}

export async function changePassword({ currentPassword, newPassword }) {
  try {
    await api.post("/auth/reset-password", {
      currentPassword,
      newPassword,
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status ?? null,
      field: getApiErrorField(error),
      message: getApiErrorMessage(error, "Failed to reset password"),
    };
  }
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    // Do not set Content-Type manually — browser must include the multipart boundary
    const { data } = await api.post("/uploads/avatar", formData);

    if (!data?.url || typeof data.url !== "string") {
      return {
        success: false,
        message: "Upload succeeded but no image URL was returned",
      };
    }

    return { success: true, url: data.url };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to upload avatar"),
    };
  }
}
