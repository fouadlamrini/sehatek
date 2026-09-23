import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as authApi from "../api/authApi";
import { UNAUTHORIZED_EVENT } from "../api/axios";
import { clearTokens, getAccessToken, setTokens } from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On first load, restore the session from stored tokens.
  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      if (!getAccessToken()) {
        setInitializing(false);
        return;
      }

      try {
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
    try {
      await authApi.logout();
    } catch {
      // Logging out locally must work even if the server call fails.
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
