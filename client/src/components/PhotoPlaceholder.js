import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PhotoPlaceholder({ tint = "none", tag, label, className = "", style, src, alt = "", }) {
    const tintClass = tint === "red" ? "tint-red" : tint === "blue" ? "tint-blue" : "";
    return (_jsxs("div", { className: `photo ${tintClass} ${className}`.trim(), style: style, children: [src && (_jsx("img", { src: src, alt: alt, loading: "lazy", style: {
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 1,
                } })), tag !== undefined && _jsx("span", { className: "photo-tag", children: tag }), label !== undefined && _jsx("span", { className: "photo-label", children: label })] }));
}
