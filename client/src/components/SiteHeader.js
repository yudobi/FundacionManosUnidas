import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BrandMark from "./BrandMark";
const NAV_KEYS = [
    { hash: "#inicio", key: "nav.inicio" },
    { hash: "#nosotros", key: "nav.nosotros" },
    { hash: "#proyectos", key: "nav.proyectos" },
    { hash: "#testimonios", key: "nav.testimonios" },
    { hash: "#registro", key: "nav.registro" },
    { hash: "#contacto", key: "nav.contacto" },
];
export default function SiteHeader() {
    const { t, i18n } = useTranslation();
    const current = (i18n.resolvedLanguage ?? i18n.language ?? "es").slice(0, 2);
    function changeLang(lng) {
        void i18n.changeLanguage(lng);
    }
    return (_jsxs("header", { className: "site-header", children: [_jsx("a", { href: "#main", style: {
                    position: "absolute",
                    left: -9999,
                    top: "auto",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                }, onFocus: (e) => {
                    const el = e.currentTarget;
                    el.style.left = "16px";
                    el.style.top = "16px";
                    el.style.width = "auto";
                    el.style.height = "auto";
                    el.style.padding = "10px 14px";
                    el.style.background = "var(--ink)";
                    el.style.color = "#fff";
                    el.style.borderRadius = "8px";
                    el.style.zIndex = "100";
                    el.style.fontFamily = "var(--font-mono)";
                    el.style.fontSize = "12px";
                }, onBlur: (e) => {
                    const el = e.currentTarget;
                    el.style.left = "-9999px";
                    el.style.width = "1px";
                    el.style.height = "1px";
                    el.style.padding = "0";
                }, children: t("header.skipToContent") }), _jsxs("div", { className: "container bar", children: [_jsxs(Link, { to: "/", className: "brand", children: [_jsx(BrandMark, { useLogo: true, size: 40 }), _jsxs("div", { className: "brand-text", children: [_jsx("strong", { children: "Fundaci\u00F3n Manos Unidas" }), _jsx("small", { children: t("header.brandSubtitle") })] })] }), _jsx("nav", { className: "site-nav", children: NAV_KEYS.map((item) => (_jsx(Link, { to: `/${item.hash}`, children: t(item.key) }, item.hash))) }), _jsxs("div", { className: "header-actions", children: [_jsxs("div", { className: "lang-toggle", role: "group", "aria-label": t("header.langGroup"), children: [_jsx("button", { type: "button", className: current === "es" ? "active" : "", onClick: () => changeLang("es"), children: "ES" }), _jsx("button", { type: "button", className: current === "en" ? "active" : "", onClick: () => changeLang("en"), children: "EN" })] }), _jsx(Link, { to: "/#donar", className: "btn btn-red", children: t("header.donateNow") })] })] })] }));
}
