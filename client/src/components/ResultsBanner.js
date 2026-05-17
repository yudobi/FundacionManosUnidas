import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
export default function ResultsBanner() {
    const { t } = useTranslation();
    return (_jsx("section", { className: "results", children: _jsxs("div", { className: "container", children: [_jsx("span", { className: "eyebrow", children: t("results.eyebrow") }), _jsx("h2", { children: t("results.title") }), _jsxs("div", { className: "stat-grid", children: [_jsxs("div", { className: "stat", children: [_jsx("div", { className: "num", children: "1,842" }), _jsx("div", { className: "label", children: t("results.stat1Label") })] }), _jsxs("div", { className: "stat", children: [_jsx("div", { className: "num", children: "126" }), _jsx("div", { className: "label", children: t("results.stat2Label") })] }), _jsxs("div", { className: "stat", children: [_jsxs("div", { className: "num", children: ["340", _jsx("span", { className: "unit", children: t("results.stat3Unit") })] }), _jsx("div", { className: "label", children: t("results.stat3Label") })] }), _jsxs("div", { className: "stat", children: [_jsxs("div", { className: "num", children: ["8.4", _jsx("span", { className: "unit", children: t("results.stat4Unit") })] }), _jsx("div", { className: "label", children: t("results.stat4Label") })] })] }), _jsxs("div", { className: "footnote", children: [_jsx("span", { children: t("results.footnoteDate") }), _jsx("a", { href: "#donar", style: {
                                color: "#fff",
                                textDecoration: "underline",
                                textUnderlineOffset: 4,
                            }, children: t("results.footnoteLink") })] })] }) }));
}
