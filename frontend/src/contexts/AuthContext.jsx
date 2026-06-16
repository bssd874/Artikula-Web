import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('artikula_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = useCallback((payload) => {
    localStorage.setItem('artikula_token', payload.token);
    setToken(payload.token);
    setUser(payload.user);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('artikula_token')) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.me();
      setUser(response.data);
    } catch {
      localStorage.removeItem('artikula_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (payload) => {
      const response = await authApi.login(payload);
      persistSession(response.data);
      return response;
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload) => {
      const response = await authApi.register(payload);
      persistSession(response.data);
      return response;
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('artikula_token')) {
        await authApi.logout();
      }
    } finally {
      localStorage.removeItem('artikula_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [token, user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }

  return context;
}
