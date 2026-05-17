import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import BrandMark from "../../components/BrandMark";

const NAV_ITEMS = [
  { to: "/admin", label: "Panel", end: true },
  { to: "/admin/proyectos", label: "Proyectos" },
  { to: "/admin/testimonios", label: "Testimonios" },
  { to: "/admin/contenido", label: "Contenido del sitio" },
  { to: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <aside
        style={{
          background: "#fff",
          borderRight: "1px solid var(--line)",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div className="brand">
          <BrandMark useLogo size={40} />
          <div className="brand-text">
            <strong>Manos Unidas</strong>
            <small>PANEL ADMIN</small>
          </div>
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? "#fff" : "var(--ink-soft)",
                background: isActive ? "var(--ink)" : "transparent",
                transition: "background 160ms ease, color 160ms ease",
                textDecoration: "none",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 20,
            borderTop: "1px solid var(--line)",
            fontSize: 13,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Sesión activa
          </div>
          <div style={{ fontWeight: 500 }}>
            {user?.first_name} {user?.last_name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 2,
              overflowWrap: "anywhere",
            }}
          >
            {user?.email}
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleLogout}
            style={{
              marginTop: 14,
              width: "100%",
              justifyContent: "center",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <section
        style={{
          padding: "40px 48px",
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <Outlet />
      </section>
    </div>
  );
}
