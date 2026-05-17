import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Project } from "../data/projects";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { formatMXN } from "../lib/formatMXN";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const { t } = useTranslation();
  const isDone = project.status === "realizado";
  const dotClass =
    project.status === "emergencia"
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

  return (
    <Link
      to={`/proyectos/${project.id}`}
      className={`project-card${isDone ? " done" : ""}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <PhotoPlaceholder
        src={cover}
        alt={photoLabel}
        tint={project.tint && project.tint !== "none" ? project.tint : "none"}
        tag={project.tag}
        label={photoLabel}
      />
      <div className="body">
        <div className="meta">
          <span>
            <span className="chip">
              <span className={`dot ${dotClass}`.trim()} />
              {statusLabel}
            </span>
          </span>
          <span>{location}</span>
        </div>
        <h3>{title}</h3>
        <p className="summary">{summary}</p>
        <div className="progress" style={{ marginTop: 8 }}>
          <span
            style={{
              width: `${Math.min(project.percent, 100)}%`,
              background:
                project.status === "emergencia"
                  ? "var(--red)"
                  : project.status === "en-curso"
                    ? "var(--green)"
                    : undefined,
            }}
          />
        </div>
        <div className="progress-line">
          {isDone ? (
            <>
              <span>
                {t("projectsSection.card.applied")} {formatMXN(project.raised)}
              </span>
              <span className="vals">
                {project.percent >= 100
                  ? `${project.percent} ${t("projectsSection.card.delivered")}`
                  : `${project.percent} %`}
              </span>
            </>
          ) : (
            <>
              <span>
                {t("projectsSection.card.goal")} {formatMXN(project.goal)}
              </span>
              <span className="vals">
                {formatMXN(project.raised)} · {project.percent} %
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
