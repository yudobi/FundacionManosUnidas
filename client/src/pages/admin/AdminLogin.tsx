import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { isAdminUser } from "../../api/auth";
import BrandMark from "../../components/BrandMark";

interface LocationState {
  from?: string;
}

export default function AdminLogin() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Si ya hay sesión admin, saltarse el login.
  if (isAuthenticated && isAdmin) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email.trim().toLowerCase(), password);
      if (!isAdminUser(user)) {
        setError(
          "Esta cuenta no tiene permisos de administrador. Contacta al equipo de la fundación.",
        );
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      id="main"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          padding: 36,
          boxShadow: "0 24px 60px -32px rgba(10,15,31,0.18)",
        }}
      >
        <Link
          to="/"
          className="brand"
          style={{ marginBottom: 28, color: "var(--ink)" }}
        >
          <BrandMark useLogo size={40} />
          <div className="brand-text">
            <strong>Fundación Manos Unidas</strong>
            <small>PANEL DE ADMINISTRACIÓN</small>
          </div>
        </Link>

        <h1
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            fontSize: 32,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: "20px 0 8px",
          }}
        >
          Inicia sesión
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--muted)",
            margin: "0 0 24px",
          }}
        >
          Acceso restringido para el equipo de la fundación.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@manosunidaspeac.mx"
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              role="alert"
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "var(--red-soft)",
                color: "var(--red-dark)",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-red btn-lg btn-block"
            style={{ marginTop: 20 }}
            disabled={submitting || !email || !password}
          >
            {submitting ? "Entrando…" : "Entrar al panel →"}
          </button>
        </form>

        <p
          style={{
            marginTop: 22,
            paddingTop: 22,
            borderTop: "1px solid var(--line)",
            fontSize: 12,
            color: "var(--muted)",
            lineHeight: 1.5,
          }}
        >
          ¿Olvidaste tu contraseña? Contacta al equipo de TI de la
          fundación para reestablecerla.
        </p>
      </div>
    </main>
  );
}
