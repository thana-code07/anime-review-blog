import axios from "axios";

import { clearTokens, getAccessToken } from "@/lib/tokenStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthAttempt =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/reset-password");

      if (!isAuthAttempt) {
        clearTokens();
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error, fallback = "Something went wrong") {
  return error.response?.data?.message || error.message || fallback;
}

export function getApiErrorField(error) {
  return error.response?.data?.field || null;
}

export default api;
