import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { fetchMe, login as apiLogin, logout as apiLogout, restoreSession, } from "../api/auth";
import { onAuthFailure, setAccessToken } from "../api/client";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Restaurar sesión al montar (lee cookie httpOnly de refresh).
    useEffect(() => {
        let cancelled = false;
        restoreSession().then((u) => {
            if (cancelled)
                return;
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
            setAccessToken(null);
            setUser(null);
        });
    }, []);
    const login = useCallback(async (email, password) => {
        const u = await apiLogin(email, password);
        setUser(u);
        return u;
    }, []);
    const logout = useCallback(async () => {
        try {
            await apiLogout();
        }
        finally {
            setAccessToken(null);
            setUser(null);
        }
    }, []);
    const refresh = useCallback(async () => {
        try {
            const u = await fetchMe();
            setUser(u);
        }
        catch {
            setUser(null);
        }
    }, []);
    const value = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: user !== null,
        isAdmin: user?.is_admin ?? false,
        login,
        logout,
        refresh,
    }), [user, isLoading, login, logout, refresh]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }
    return ctx;
}
