import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  changePassword as changePasswordUser,
  ensureAdminUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile as updateProfileUser,
} from "@/lib/auth";

const AuthContext = createContext(null);

// provides auth state and login/logout/profile helpers to the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    ensureAdminUser();
    return getCurrentUser();
  });

  const register = useCallback((credentials) => {
    const result = registerUser(credentials);
    return result;
  }, []);

  const login = useCallback((credentials) => {
    const result = loginUser(credentials);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback((profile) => {
    const result = updateProfileUser(profile);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  const changePassword = useCallback((passwords) => {
    return changePasswordUser(passwords);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: user !== null,
      isAdmin: user?.role === "admin",
      register,
      login,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, register, login, logout, updateProfile, changePassword],
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
