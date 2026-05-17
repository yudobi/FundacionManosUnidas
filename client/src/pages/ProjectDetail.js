import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProject } from "../hooks/queries";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { formatMXN } from "../lib/formatMXN";
export default function ProjectDetail() {
    const { t } = useTranslation();
    const { id } = useParams();
    const { data: project, isLoading, isError } = useProject(id);
    const [activeImg, setActiveImg] = useState(0);
    const statusLabel = project
        ? t(`${project.id}.statusLabel`, { ns: "projects" })
        : "";
    const location = project
        ? t(`${project.id}.location`, { ns: "projects" })
        : "";
    const title = project ? t(`${project.id}.title`, { ns: "projects" }) : "";
    const summary = project
        ? t(`${project.id}.summary`, { ns: "projects" })
        : "";
    const photoLabel = project
        ? t(`${project.id}.photoLabel`, { ns: "projects" })
        : "";
    return (_jsxs(_Fragment, { children: [_jsx(SiteHeader, {}), _jsx("main", { id: "main", children: _jsx("section", { className: "section", children: _jsxs("div", { className: "container", children: [_jsx("div", { style: { marginBottom: 24 }, children: _jsx(Link, { to: "/", className: "eyebrow", children: t("projectDetail.back") }) }), isLoading && (_jsx("p", { className: "head-lead", children: t("projectDetail.loading") })), isError && (_jsx("p", { className: "head-lead", style: { color: "var(--red)" }, children: t("projectDetail.loadError") })), !isLoading && !isError && !project && (_jsxs(_Fragment, { children: [_jsx("h2", { style: {
                                            fontFamily: "Geist, sans-serif",
                                            fontWeight: 600,
                                            fontSize: "clamp(40px,5vw,72px)",
                                            letterSpacing: "-0.04em",
                                        }, children: t("projectDetail.notFoundTitle") }), _jsx("p", { className: "head-lead", style: { marginTop: 16, maxWidth: 540 }, dangerouslySetInnerHTML: {
                                            __html: `${t("projectDetail.notFoundDesc", { id })} <a href="/#proyectos" style="color: var(--blue); text-decoration: underline">${t("projectDetail.viewAll")}</a>.`,
                                        } })] })), project && (_jsx(_Fragment, { children: _jsxs("div", { style: {
                                        display: "grid",
                                        gridTemplateColumns: "1.1fr 1fr",
                                        gap: 56,
                                        alignItems: "start",
                                    }, children: [_jsxs("div", { children: [_jsx(PhotoPlaceholder, { src: project.images[activeImg], alt: photoLabel, tint: project.tint && project.tint !== "none"
                                                        ? project.tint
                                                        : "none", tag: project.tag, label: photoLabel, style: {
                                                        aspectRatio: "4 / 3",
                                                        borderRadius: "var(--radius-lg)",
                                                    } }), _jsx("div", { style: {
                                                        display: "grid",
                                                        gridTemplateColumns: `repeat(${project.images.length}, 1fr)`,
                                                        gap: 8,
                                                        marginTop: 12,
                                                    }, children: project.images.map((src, i) => (_jsx("button", { type: "button", onClick: () => setActiveImg(i), style: {
                                                            padding: 0,
                                                            aspectRatio: "1 / 1",
                                                            borderRadius: 8,
                                                            overflow: "hidden",
                                                            border: activeImg === i
                                                                ? "2px solid var(--red)"
                                                                : "1px solid var(--line)",
                                                            background: "transparent",
                                                        }, "aria-label": t("projectDetail.thumbAria", {
                                                            index: i + 1,
                                                        }), children: _jsx("img", { src: src, alt: "", loading: "lazy", style: {
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: "block",
                                                            } }) }, src))) })] }), _jsxs("div", { children: [_jsxs("span", { className: "eyebrow red", children: [statusLabel, " \u00B7 ", location] }), _jsx("h1", { style: {
                                                        fontFamily: "Geist, sans-serif",
                                                        fontWeight: 600,
                                                        fontSize: "clamp(40px,5vw,72px)",
                                                        lineHeight: 1,
                                                        letterSpacing: "-0.04em",
                                                        marginTop: 18,
                                                        textWrap: "balance",
                                                    }, children: title }), _jsx("p", { className: "head-lead", style: { marginTop: 20, maxWidth: 540 }, children: summary }), _jsxs("div", { style: {
                                                        marginTop: 32,
                                                        padding: 24,
                                                        border: "1px solid var(--line)",
                                                        borderRadius: "var(--radius-lg)",
                                                        background: "#fff",
                                                    }, children: [_jsx("div", { className: "divider-mono", children: t("projectDetail.progress") }), _jsx("div", { className: "progress", style: { marginTop: 8 }, children: _jsx("span", { style: {
                                                                    width: `${Math.min(project.percent, 100)}%`,
                                                                    background: project.status === "realizado"
                                                                        ? "var(--blue)"
                                                                        : "var(--red)",
                                                                } }) }), _jsx("div", { className: "progress-line", style: { marginTop: 10 }, children: project.status === "realizado" ? (_jsxs(_Fragment, { children: [_jsxs("span", { children: [t("projectDetail.applied"), " ", formatMXN(project.raised)] }), _jsx("span", { className: "vals", children: t("projectDetail.deliveredPct", {
                                                                            pct: project.percent,
                                                                        }) })] })) : (_jsxs(_Fragment, { children: [_jsxs("span", { children: [t("projectDetail.goal"), " ", formatMXN(project.goal)] }), _jsxs("span", { className: "vals", children: [formatMXN(project.raised), " \u00B7 ", project.percent, " %"] })] })) })] }), _jsxs("div", { style: {
                                                        marginTop: 28,
                                                        display: "flex",
                                                        gap: 12,
                                                        flexWrap: "wrap",
                                                    }, children: [_jsx(Link, { to: "/#donar", className: "btn btn-red btn-lg", children: t("projectDetail.donateCta") }), _jsx(Link, { to: "/#proyectos", className: "btn btn-ghost btn-lg", children: t("projectDetail.viewAll") })] })] })] }) }))] }) }) }), _jsx(SiteFooter, {})] }));
}
