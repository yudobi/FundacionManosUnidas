import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchMe,
  isAdminUser,
  login as apiLogin,
  logout as apiLogout,
  restoreSession,
  type AuthUser,
} from "../api/auth";
import { clearTokens, onAuthFailure } from "../api/client";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al montar (lee cookie httpOnly de refresh).
  useEffect(() => {
    let cancelled = false;
    restoreSession().then((u) => {
      if (cancelled) return;
      setUser(u);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Si una llamada autenticada falla y refresh tampoco funciona,
  // limpiar el usuario para que las rutas protegidas redirijan a login.
  useEffect(() => {
    onAuthFailure(() => {
      clearTokens();
      setUser(null);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await apiLogin(email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const u = await fetchMe();
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isAdmin: isAdminUser(user),
      login,
      logout,
      refresh,
    }),
    [user, isLoading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
