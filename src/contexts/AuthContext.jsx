import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  changePassword as changePasswordUser,
  fetchCurrentUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile as updateProfileUser,
  uploadAvatar,
} from "@/lib/auth";
import { subscribeAuthCleared } from "@/lib/authEvents";
import { getAccessToken } from "@/lib/tokenStorage";

const AuthContext = createContext(null);

// provides auth state and login/logout/profile helpers to the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [isBootstrapping, setIsBootstrapping] = useState(() =>
    Boolean(getAccessToken()),
  );

  useEffect(() => {
    return subscribeAuthCleared(() => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!getAccessToken()) {
        setIsBootstrapping(false);
        return;
      }

      const result = await fetchCurrentUser();

      if (cancelled) return;

      if (result.success) {
        setUser(result.user);
      } else if (result.cleared) {
        // Tokens were wiped for an auth failure — clear React session.
        setUser(null);
      }
      // Soft failures (network/5xx): keep cached user; tokens still present.

      setIsBootstrapping(false);
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(async (credentials) => {
    const result = await registerUser(credentials);
    if (result.success && result.user && getAccessToken()) {
      setUser(result.user);
    }
    return result;
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await loginUser(credentials);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (profile) => {
    const payload = {
      name: profile.name,
      username: profile.username,
    };

    if (profile.avatarFile instanceof File) {
      const uploadResult = await uploadAvatar(profile.avatarFile);
      if (!uploadResult.success) {
        return uploadResult;
      }
      if (!uploadResult.url) {
        return {
          success: false,
          message: "Upload succeeded but no image URL was returned",
        };
      }
      payload.avatar = uploadResult.url;
    }
    // No new file: omit avatar so the server keeps the existing profile_pic

    const result = await updateProfileUser(payload);

    if (result.success) {
      setUser(result.user);
    }

    return result;
  }, []);

  const changePassword = useCallback(async (passwords) => {
    return changePasswordUser(passwords);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: user !== null,
      isAdmin: user?.role === "admin",
      isBootstrapping,
      register,
      login,
      logout,
      updateProfile,
      changePassword,
    }),
    [
      user,
      isBootstrapping,
      register,
      login,
      logout,
      updateProfile,
      changePassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// hook to read auth context; throws if used outside AuthProvider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
