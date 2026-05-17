import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import BrandMark from "../../components/BrandMark";
export default function AdminLogin() {
    const { login, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from ?? "/admin";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    // Si ya hay sesión admin, saltarse el login.
    if (isAuthenticated && isAdmin) {
        return _jsx(Navigate, { to: from, replace: true });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const user = await login(email.trim().toLowerCase(), password);
            if (!user.is_admin) {
                setError("Esta cuenta no tiene permisos de administrador. Contacta al equipo de la fundación.");
                return;
            }
            navigate(from, { replace: true });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Error al iniciar sesión.";
            setError(msg);
        }
        finally {
            setSubmitting(false);
        }
    }
    return (_jsx("main", { id: "main", style: {
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "32px 20px",
            background: "var(--bg)",
        }, children: _jsxs("div", { style: {
                width: "100%",
                maxWidth: 440,
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-lg)",
                padding: 36,
                boxShadow: "0 24px 60px -32px rgba(10,15,31,0.18)",
            }, children: [_jsxs(Link, { to: "/", className: "brand", style: { marginBottom: 28, color: "var(--ink)" }, children: [_jsx(BrandMark, { useLogo: true, size: 40 }), _jsxs("div", { className: "brand-text", children: [_jsx("strong", { children: "Fundaci\u00F3n Manos Unidas" }), _jsx("small", { children: "PANEL DE ADMINISTRACI\u00D3N" })] })] }), _jsx("h1", { style: {
                        fontFamily: "Geist, sans-serif",
                        fontWeight: 600,
                        fontSize: 32,
                        lineHeight: 1.05,
                        letterSpacing: "-0.03em",
                        margin: "20px 0 8px",
                    }, children: "Inicia sesi\u00F3n" }), _jsx("p", { style: {
                        fontSize: 14,
                        color: "var(--muted)",
                        margin: "0 0 24px",
                    }, children: "Acceso restringido para el equipo de la fundaci\u00F3n." }), _jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [_jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "login-email", children: "Correo electr\u00F3nico" }), _jsx("input", { id: "login-email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@manosunidaspeac.mx" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "login-password", children: "Contrase\u00F1a" }), _jsx("input", { id: "login-password", name: "password", type: "password", autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), error && (_jsx("p", { role: "alert", style: {
                                marginTop: 12,
                                padding: "10px 12px",
                                background: "var(--red-soft)",
                                color: "var(--red-dark)",
                                borderRadius: "var(--radius-sm)",
                                fontSize: 13,
                                lineHeight: 1.4,
                            }, children: error })), _jsx("button", { type: "submit", className: "btn btn-red btn-lg btn-block", style: { marginTop: 20 }, disabled: submitting || !email || !password, children: submitting ? "Entrando…" : "Entrar al panel →" })] }), _jsx("p", { style: {
                        marginTop: 22,
                        paddingTop: 22,
                        borderTop: "1px solid var(--line)",
                        fontSize: 12,
                        color: "var(--muted)",
                        lineHeight: 1.5,
                    }, children: "\u00BFOlvidaste tu contrase\u00F1a? Contacta al equipo de TI de la fundaci\u00F3n para reestablecerla." })] }) }));
}
