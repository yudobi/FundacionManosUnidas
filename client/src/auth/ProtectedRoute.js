import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function ProtectedRoute({ children, requireAdmin = true }) {
    const { isLoading, isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { style: {
                display: "grid",
                placeItems: "center",
                minHeight: "60vh",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
            }, children: "Verificando sesi\u00F3n\u2026" }));
    }
    if (!isAuthenticated) {
        return (_jsx(Navigate, { to: "/admin/login", replace: true, state: { from: location.pathname } }));
    }
    if (requireAdmin && !isAdmin) {
        return (_jsx(Navigate, { to: "/", replace: true }));
    }
    return _jsx(_Fragment, { children: children });
}
