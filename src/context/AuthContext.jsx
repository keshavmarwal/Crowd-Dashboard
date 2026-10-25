import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { loginRequest } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { tokenStorage } from '../utils/tokenStorage';
import { decodeJwt, isTokenValid } from '../utils/jwt';

export const AuthContext = createContext(null);

function readInitialToken() {
  const stored = tokenStorage.get();
  if (stored && isTokenValid(stored)) return stored;
  if (stored) tokenStorage.clear(); 
  return null;
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(readInitialToken);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    queryClient.clear(); // drop cached data of the previous session
  }, [queryClient]);

  const login = useCallback(async (email, password) => {
    const newToken = await loginRequest(email, password);
    tokenStorage.set(newToken);
    setToken(newToken);
  }, []);


  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const user = useMemo(() => {
    const p = decodeJwt(token);
    return p ? { name: p.name, email: p.email, role: p.role, exp: p.exp } : null;
  }, [token]);


  useEffect(() => {
    if (!user?.exp) return;
    const ms = user.exp * 1000 - Date.now();
    if (ms <= 0) {
      logout();
      return;
    }
    const id = setTimeout(logout, Math.min(ms, 2 ** 31 - 1));
    return () => clearTimeout(id);
  }, [user, logout]);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
