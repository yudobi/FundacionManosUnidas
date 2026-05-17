import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            minHeight: "100vh",
            background: "var(--bg)",
        }, children: [_jsxs("aside", { style: {
                    background: "#fff",
                    borderRight: "1px solid var(--line)",
                    padding: "28px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                }, children: [_jsxs("div", { className: "brand", children: [_jsx(BrandMark, { useLogo: true, size: 40 }), _jsxs("div", { className: "brand-text", children: [_jsx("strong", { children: "Manos Unidas" }), _jsx("small", { children: "PANEL ADMIN" })] })] }), _jsx("nav", { style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }, children: NAV_ITEMS.map((item) => (_jsx(NavLink, { to: item.to, end: item.end, style: ({ isActive }) => ({
                                padding: "10px 14px",
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 500,
                                color: isActive ? "#fff" : "var(--ink-soft)",
                                background: isActive ? "var(--ink)" : "transparent",
                                transition: "background 160ms ease, color 160ms ease",
                                textDecoration: "none",
                            }), children: item.label }, item.to))) }), _jsxs("div", { style: {
                            marginTop: "auto",
                            paddingTop: 20,
                            borderTop: "1px solid var(--line)",
                            fontSize: 13,
                        }, children: [_jsx("div", { style: {
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    color: "var(--muted)",
                                    marginBottom: 6,
                                }, children: "Sesi\u00F3n activa" }), _jsxs("div", { style: { fontWeight: 500 }, children: [user?.first_name, " ", user?.last_name] }), _jsx("div", { style: {
                                    fontSize: 12,
                                    color: "var(--muted)",
                                    marginTop: 2,
                                    overflowWrap: "anywhere",
                                }, children: user?.email }), _jsx("button", { type: "button", className: "btn btn-ghost", onClick: handleLogout, style: {
                                    marginTop: 14,
                                    width: "100%",
                                    justifyContent: "center",
                                }, children: "Cerrar sesi\u00F3n" })] })] }), _jsx("section", { style: {
                    padding: "40px 48px",
                    minHeight: "100vh",
                    overflow: "auto",
                }, children: _jsx(Outlet, {}) })] }));
}
