import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
const CARDS = [
    {
        title: "Proyectos",
        to: "/admin/proyectos",
        desc: "Crear, editar y archivar proyectos. Subir fotos a la galería antes/después.",
        status: "coming",
    },
    {
        title: "Testimonios",
        to: "/admin/testimonios",
        desc: "Aprobar o rechazar los testimonios enviados por la comunidad.",
        status: "coming",
    },
    {
        title: "Contenido del sitio",
        to: "/admin/contenido",
        desc: "Editar Misión, Visión, Valores, resultados, banco y contacto.",
        status: "coming",
    },
    {
        title: "Usuarios registrados",
        to: "/admin/usuarios",
        desc: "Listar donantes, voluntarios, familias y aliados. Cambiar roles.",
        status: "coming",
    },
];
export default function AdminDashboard() {
    const { user } = useAuth();
    return (_jsxs("div", { style: { maxWidth: 900 }, children: [_jsx("span", { className: "eyebrow blue", children: "Panel de administraci\u00F3n" }), _jsxs("h1", { style: {
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(36px, 4.5vw, 56px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    margin: "16px 0 12px",
                }, children: ["Bienvenida, ", user?.first_name || user?.username, "."] }), _jsx("p", { style: {
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: "var(--ink-soft)",
                    maxWidth: 620,
                    marginBottom: 36,
                }, children: "Desde aqu\u00ED podr\u00E1s administrar el contenido p\u00FAblico del sitio de la Fundaci\u00F3n Manos Unidas P.E.A.C. Las pr\u00F3ximas entregas habilitar\u00E1n los m\u00F3dulos de cada tarjeta." }), _jsx("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 20,
                }, children: CARDS.map((c) => (_jsxs(Link, { to: c.to, style: {
                        display: "block",
                        background: "#fff",
                        border: "1px solid var(--line)",
                        borderRadius: "var(--radius-lg)",
                        padding: 24,
                        textDecoration: "none",
                        color: "var(--ink)",
                        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                            "0 18px 40px -22px rgba(10,15,31,0.22)";
                        e.currentTarget.style.borderColor = "var(--ink)";
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "var(--line)";
                    }, children: [_jsxs("div", { style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 10,
                            }, children: [_jsx("h3", { style: {
                                        fontSize: 18,
                                        fontWeight: 600,
                                        letterSpacing: "-0.02em",
                                        margin: 0,
                                    }, children: c.title }), _jsx("span", { className: "chip", style: {
                                        background: c.status === "ready" ? "var(--green-soft)" : "var(--bg-soft)",
                                        color: c.status === "ready" ? "var(--green-dark)" : "var(--muted)",
                                    }, children: c.status === "ready" ? "Listo" : "Próximamente" })] }), _jsx("p", { style: {
                                fontSize: 13.5,
                                lineHeight: 1.5,
                                color: "var(--ink-soft)",
                                margin: 0,
                            }, children: c.desc })] }, c.to))) }), _jsxs("div", { style: {
                    marginTop: 48,
                    padding: 20,
                    background: "var(--blue-soft)",
                    color: "var(--blue)",
                    borderRadius: "var(--radius)",
                    fontSize: 13.5,
                    lineHeight: 1.5,
                }, children: [_jsx("strong", { children: "Acci\u00F3n pendiente:" }), " esta cuenta usa la contrase\u00F1a placeholder. C\u00E1mbiala desde la terminal con", " ", _jsx("code", { style: {
                            fontFamily: "var(--font-mono)",
                            background: "rgba(30,58,138,0.12)",
                            padding: "2px 6px",
                            borderRadius: 4,
                        }, children: "python manage.py changepassword admin" }), " ", "antes de salir a producci\u00F3n."] })] }));
}
