import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  changePassword as changePasswordUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile as updateProfileUser,
} from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
