import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as authApi from "../api/authApi";
import { refreshAccessToken, UNAUTHORIZED_EVENT } from "../api/axios";
import { clearTokens, getAccessToken, setTokens } from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On first load, restore the session. The access token lives in memory
  // only, so when it is missing we first try to mint a new one from the
  // httpOnly refresh-token cookie before giving up.
  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        if (!getAccessToken()) {
          await refreshAccessToken();
        }

        const { data } = await authApi.getProfile();

        if (active) {
          setAdmin(data);
        }
      } catch {
        clearTokens();

        if (active) {
          setAdmin(null);
        }
      } finally {
        if (active) {
          setInitializing(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  // The axios layer emits this when the refresh token is no longer valid.
  useEffect(() => {
    const handleUnauthorized = () => setAdmin(null);

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);

    setTokens({ token: data.token });
    setAdmin(data.admin);

    return data.admin;
  }, []);

  const logout = useCallback(async () => {
    // Revoke server-side first (the httpOnly cookie must be cleared by the
    // server). Retry once on transient network failures before giving up.
    try {
      await authApi.logout();
    } catch {
      try {
        await authApi.logout();
      } catch {
        // Local state is still cleared below: we never leave a stale session
        // visible in the UI even if the server is unreachable.
      }
    }

    clearTokens();
    setAdmin(null);
  }, []);

  const updateAdmin = useCallback((partial) => {
    setAdmin((current) => (current ? { ...current, ...partial } : current));
  }, []);

  const value = useMemo(
    () => ({
      admin,
      initializing,
      isAuthenticated: Boolean(admin),
      isSuperAdmin: admin?.role === "super_admin",
      login,
      logout,
      updateAdmin,
    }),
    [admin, initializing, login, logout, updateAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
