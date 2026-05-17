import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BrandMark({ useLogo = true, size = 40 }) {
    if (useLogo) {
        return (_jsx("img", { src: "/Logo.jpeg", alt: "Fundaci\u00F3n Manos Unidas P.E.A.C \u2014 logotipo", width: size, height: size, style: {
                width: size,
                height: size,
                borderRadius: "50%",
                objectFit: "cover",
                flex: "none",
            } }));
    }
    return (_jsxs("div", { className: "brand-mark", "aria-hidden": "true", children: [_jsx("span", { className: "b-blue" }), _jsx("span", { className: "b-red" })] }));
}
