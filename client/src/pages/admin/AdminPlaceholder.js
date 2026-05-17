import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function AdminPlaceholder({ title, description }) {
    return (_jsxs("div", { style: { maxWidth: 720 }, children: [_jsx("span", { className: "eyebrow", children: "M\u00F3dulo en construcci\u00F3n" }), _jsx("h1", { style: {
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(32px, 4vw, 48px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    margin: "16px 0 12px",
                }, children: title }), _jsx("p", { style: { fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.55 }, children: description }), _jsx("div", { style: {
                    marginTop: 32,
                    padding: 24,
                    background: "#fff",
                    border: "1px dashed var(--line)",
                    borderRadius: "var(--radius-lg)",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                }, children: "Disponible en la siguiente entrega" })] }));
}
