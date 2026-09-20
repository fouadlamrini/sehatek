import axios from "axios";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../utils/tokenStorage";

const baseURL = import.meta.env.VITE_API_URL;

// Emitted when the session can no longer be refreshed, so AuthContext can
// clear the current admin and send the user back to the login page.
export const UNAUTHORIZED_EVENT = "sehatek:unauthorized";

const api = axios.create({ baseURL });

// Attach the current access token to every request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Single-flight refresh: several 401 responses share one refresh request.
let refreshPromise = null;

const requestNewTokens = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  // Bare axios so this call never runs through the interceptors below.
  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });

  setTokens({
    token: data?.data?.token,
    refreshToken: data?.data?.refreshToken,
  });

  return data?.data?.token;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url ?? "";

    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = requestNewTokens().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;

        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original);
      } catch (refreshError) {
        clearTokens();
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
