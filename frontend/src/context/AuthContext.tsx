import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getMe, type AuthUser } from "../api/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AUTH_TOKEN_KEY = "funko_hunter_token";
const AUTH_USER_KEY = "funko_hunter_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(AUTH_TOKEN_KEY)
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    async function restoreUser() {
      if (!token) return;

      try {
        const me = await getMe(token);
        setUser(me);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(me));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }

    restoreUser();
  }, [token]);

  function login(nextToken: string, nextUser: AuthUser) {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };