import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
  children: React.ReactNode;
  /** Si true, requiere rol admin. Por defecto solo requiere estar autenticado. */
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = true }: Props) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "60vh",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Verificando sesión…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <Navigate to="/" replace />
    );
  }

  return <>{children}</>;
}
