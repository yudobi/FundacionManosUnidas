import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "../hooks/queries";
import ProjectCard from "./ProjectCard";
import BeforeAfter from "./BeforeAfter";
const FILTER_IDS = ["todos", "en-curso", "realizado", "emergencia"];
export default function ProjectsSection() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState("todos");
    const { data: projects = [], isLoading, isError } = useProjects();
    const counts = useMemo(() => {
        return {
            todos: projects.length,
            "en-curso": projects.filter((p) => p.status === "en-curso").length,
            realizado: projects.filter((p) => p.status === "realizado").length,
            emergencia: projects.filter((p) => p.status === "emergencia").length,
        };
    }, [projects]);
    const filtered = filter === "todos"
        ? projects
        : projects.filter((p) => p.status === filter);
    return (_jsx("section", { className: "section section-divider", id: "proyectos", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-head", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow red", children: t("projectsSection.eyebrow") }), _jsxs("h2", { style: { marginTop: 20 }, children: [t("projectsSection.titleLine1"), " ", _jsx("em", { children: t("projectsSection.titleConstruyendo") }), ",", _jsx("br", {}), t("projectsSection.titleLine2"), " ", _jsx("span", { className: "blue-word", children: t("projectsSection.titleConstruimos") }), "."] })] }), _jsx("p", { className: "head-lead", children: t("projectsSection.lead") })] }), _jsx("div", { className: "projects-filters", children: FILTER_IDS.map((id) => (_jsxs("button", { type: "button", className: filter === id ? "active" : "", onClick: () => setFilter(id), disabled: isLoading, children: [t(`projectsSection.filters.${id}`), " \u00B7 ", counts[id]] }, id))) }), isError && (_jsx("p", { className: "head-lead", style: { color: "var(--red)" }, children: t("projectsSection.loadError") })), isLoading ? (_jsx("div", { className: "project-grid", "aria-busy": "true", children: [0, 1, 2].map((i) => (_jsxs("div", { className: "project-card", style: { opacity: 0.55 }, children: [_jsx("div", { className: "photo", style: { aspectRatio: "4 / 3", borderRadius: 0 } }), _jsxs("div", { className: "body", children: [_jsx("div", { className: "meta", children: _jsx("span", { children: t("projectsSection.loading") }) }), _jsx("h3", { children: "\u00A0" }), _jsx("p", { className: "summary", children: "\u00A0" })] })] }, i))) })) : (_jsx("div", { className: "project-grid", children: filtered.map((p) => (_jsx(ProjectCard, { project: p }, p.id))) })), _jsxs("div", { className: "beforeafter-wrap", children: [_jsxs("div", { className: "spread", style: { marginBottom: 20 }, children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow blue", children: t("projectsSection.beforeAfter.eyebrow") }), _jsx("h3", { style: {
                                                fontFamily: "var(--font-display)",
                                                fontSize: 36,
                                                marginTop: 14,
                                                letterSpacing: "-0.025em",
                                            }, children: t("projectsSection.beforeAfter.title") })] }), _jsxs("span", { className: "chip", style: { background: "#fff" }, children: [_jsx("span", { className: "dot" }), t("projectsSection.beforeAfter.dragHint")] })] }), _jsx(BeforeAfter, {})] })] }) }));
}
