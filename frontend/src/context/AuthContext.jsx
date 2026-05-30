import { useCallback, useEffect, useMemo, useState } from 'react';
import { setOnUnauthorized } from '../api/api';
import { isTokenExpired } from '../utils/token';
import AuthContext from './authContextValue';
const STORAGE_KEY = 'icp_auth';

function readStoredAuth() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.token || isTokenExpired(parsed.token)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
    });
    return () => setOnUnauthorized(null);
  }, [logout]);

  useEffect(() => {
    const legacy = localStorage.getItem(STORAGE_KEY);
    if (legacy) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback((payload) => {
    if (isTokenExpired(payload.token)) {
      throw new Error('Received an expired token.');
    }
    const session = {
      token: payload.token,
      user: payload.user,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
  }, []);

  const value = useMemo(
    () => ({
      token: auth?.token ?? null,
      user: auth?.user ?? null,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
