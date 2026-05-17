import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { formatMXN } from "../lib/formatMXN";
export default function ProjectCard({ project }) {
    const { t } = useTranslation();
    const isDone = project.status === "realizado";
    const dotClass = project.status === "emergencia"
        ? "red"
        : project.status === "en-curso"
            ? "green"
            : ""; // realizado → default (blue)
    const cover = project.images[0];
    const statusLabel = t(`${project.id}.statusLabel`, { ns: "projects" });
    const location = t(`${project.id}.location`, { ns: "projects" });
    const title = t(`${project.id}.title`, { ns: "projects" });
    const summary = t(`${project.id}.summary`, { ns: "projects" });
    const photoLabel = t(`${project.id}.photoLabel`, { ns: "projects" });
    return (_jsxs(Link, { to: `/proyectos/${project.id}`, className: `project-card${isDone ? " done" : ""}`, style: { textDecoration: "none", color: "inherit" }, children: [_jsx(PhotoPlaceholder, { src: cover, alt: photoLabel, tint: project.tint && project.tint !== "none" ? project.tint : "none", tag: project.tag, label: photoLabel }), _jsxs("div", { className: "body", children: [_jsxs("div", { className: "meta", children: [_jsx("span", { children: _jsxs("span", { className: "chip", children: [_jsx("span", { className: `dot ${dotClass}`.trim() }), statusLabel] }) }), _jsx("span", { children: location })] }), _jsx("h3", { children: title }), _jsx("p", { className: "summary", children: summary }), _jsx("div", { className: "progress", style: { marginTop: 8 }, children: _jsx("span", { style: {
                                width: `${Math.min(project.percent, 100)}%`,
                                background: project.status === "emergencia"
                                    ? "var(--red)"
                                    : project.status === "en-curso"
                                        ? "var(--green)"
                                        : undefined,
                            } }) }), _jsx("div", { className: "progress-line", children: isDone ? (_jsxs(_Fragment, { children: [_jsxs("span", { children: [t("projectsSection.card.applied"), " ", formatMXN(project.raised)] }), _jsx("span", { className: "vals", children: project.percent >= 100
                                        ? `${project.percent} ${t("projectsSection.card.delivered")}`
                                        : `${project.percent} %` })] })) : (_jsxs(_Fragment, { children: [_jsxs("span", { children: [t("projectsSection.card.goal"), " ", formatMXN(project.goal)] }), _jsxs("span", { className: "vals", children: [formatMXN(project.raised), " \u00B7 ", project.percent, " %"] })] })) })] })] }));
}
