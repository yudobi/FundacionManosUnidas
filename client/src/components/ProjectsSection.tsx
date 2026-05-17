import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "../hooks/queries";
import type { ProjectStatus } from "../data/projects";
import ProjectCard from "./ProjectCard";
import BeforeAfter from "./BeforeAfter";

type Filter = "todos" | ProjectStatus;

const FILTER_IDS: Filter[] = ["todos", "en-curso", "realizado", "emergencia"];

export default function ProjectsSection() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("todos");
  const { data: projects = [], isLoading, isError } = useProjects();

  const counts = useMemo(() => {
    return {
      todos: projects.length,
      "en-curso": projects.filter((p) => p.status === "en-curso").length,
      realizado: projects.filter((p) => p.status === "realizado").length,
      emergencia: projects.filter((p) => p.status === "emergencia").length,
    } as Record<Filter, number>;
  }, [projects]);

  const filtered =
    filter === "todos"
      ? projects
      : projects.filter((p) => p.status === filter);

  return (
    <section className="section section-divider" id="proyectos">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow red">{t("projectsSection.eyebrow")}</span>
            <h2 style={{ marginTop: 20 }}>
              {t("projectsSection.titleLine1")}{" "}
              <em>{t("projectsSection.titleConstruyendo")}</em>,
              <br />
              {t("projectsSection.titleLine2")}{" "}
              <span className="blue-word">
                {t("projectsSection.titleConstruimos")}
              </span>
              .
            </h2>
          </div>
          <p className="head-lead">{t("projectsSection.lead")}</p>
        </div>

        <div className="projects-filters">
          {FILTER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={filter === id ? "active" : ""}
              onClick={() => setFilter(id)}
              disabled={isLoading}
            >
              {t(`projectsSection.filters.${id}`)} · {counts[id]}
            </button>
          ))}
        </div>

        {isError && (
          <p className="head-lead" style={{ color: "var(--red)" }}>
            {t("projectsSection.loadError")}
          </p>
        )}

        {isLoading ? (
          <div className="project-grid" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="project-card"
                style={{ opacity: 0.55 }}
              >
                <div
                  className="photo"
                  style={{ aspectRatio: "4 / 3", borderRadius: 0 }}
                />
                <div className="body">
                  <div className="meta">
                    <span>{t("projectsSection.loading")}</span>
                  </div>
                  <h3>&nbsp;</h3>
                  <p className="summary">&nbsp;</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="project-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        <div className="beforeafter-wrap">
          <div className="spread" style={{ marginBottom: 20 }}>
            <div>
              <span className="eyebrow blue">
                {t("projectsSection.beforeAfter.eyebrow")}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  marginTop: 14,
                  letterSpacing: "-0.025em",
                }}
              >
                {t("projectsSection.beforeAfter.title")}
              </h3>
            </div>
            <span className="chip" style={{ background: "#fff" }}>
              <span className="dot" />
              {t("projectsSection.beforeAfter.dragHint")}
            </span>
          </div>

          <BeforeAfter />
        </div>
      </div>
    </section>
  );
}
