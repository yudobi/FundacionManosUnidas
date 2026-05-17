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
  const { id } = useParams<{ id: string }>();
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

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="section">
          <div className="container">
            <div style={{ marginBottom: 24 }}>
              <Link to="/" className="eyebrow">
                {t("projectDetail.back")}
              </Link>
            </div>

            {isLoading && (
              <p className="head-lead">{t("projectDetail.loading")}</p>
            )}

            {isError && (
              <p className="head-lead" style={{ color: "var(--red)" }}>
                {t("projectDetail.loadError")}
              </p>
            )}

            {!isLoading && !isError && !project && (
              <>
                <h2
                  style={{
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(40px,5vw,72px)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {t("projectDetail.notFoundTitle")}
                </h2>
                <p
                  className="head-lead"
                  style={{ marginTop: 16, maxWidth: 540 }}
                  dangerouslySetInnerHTML={{
                    __html: `${t("projectDetail.notFoundDesc", { id })} <a href="/#proyectos" style="color: var(--blue); text-decoration: underline">${t("projectDetail.viewAll")}</a>.`,
                  }}
                />
              </>
            )}

            {project && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 1fr",
                    gap: 56,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <PhotoPlaceholder
                      src={project.images[activeImg]}
                      alt={photoLabel}
                      tint={
                        project.tint && project.tint !== "none"
                          ? project.tint
                          : "none"
                      }
                      tag={project.tag}
                      label={photoLabel}
                      style={{
                        aspectRatio: "4 / 3",
                        borderRadius: "var(--radius-lg)",
                      }}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${project.images.length}, 1fr)`,
                        gap: 8,
                        marginTop: 12,
                      }}
                    >
                      {project.images.map((src, i) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setActiveImg(i)}
                          style={{
                            padding: 0,
                            aspectRatio: "1 / 1",
                            borderRadius: 8,
                            overflow: "hidden",
                            border:
                              activeImg === i
                                ? "2px solid var(--red)"
                                : "1px solid var(--line)",
                            background: "transparent",
                          }}
                          aria-label={t("projectDetail.thumbAria", {
                            index: i + 1,
                          })}
                        >
                          <img
                            src={src}
                            alt=""
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="eyebrow red">
                      {statusLabel} · {location}
                    </span>
                    <h1
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontWeight: 600,
                        fontSize: "clamp(40px,5vw,72px)",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        marginTop: 18,
                        textWrap: "balance",
                      }}
                    >
                      {title}
                    </h1>
                    <p
                      className="head-lead"
                      style={{ marginTop: 20, maxWidth: 540 }}
                    >
                      {summary}
                    </p>

                    <div
                      style={{
                        marginTop: 32,
                        padding: 24,
                        border: "1px solid var(--line)",
                        borderRadius: "var(--radius-lg)",
                        background: "#fff",
                      }}
                    >
                      <div className="divider-mono">
                        {t("projectDetail.progress")}
                      </div>
                      <div className="progress" style={{ marginTop: 8 }}>
                        <span
                          style={{
                            width: `${Math.min(project.percent, 100)}%`,
                            background:
                              project.status === "realizado"
                                ? "var(--blue)"
                                : "var(--red)",
                          }}
                        />
                      </div>
                      <div className="progress-line" style={{ marginTop: 10 }}>
                        {project.status === "realizado" ? (
                          <>
                            <span>
                              {t("projectDetail.applied")}{" "}
                              {formatMXN(project.raised)}
                            </span>
                            <span className="vals">
                              {t("projectDetail.deliveredPct", {
                                pct: project.percent,
                              })}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              {t("projectDetail.goal")}{" "}
                              {formatMXN(project.goal)}
                            </span>
                            <span className="vals">
                              {formatMXN(project.raised)} · {project.percent} %
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 28,
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <Link to="/#donar" className="btn btn-red btn-lg">
                        {t("projectDetail.donateCta")}
                      </Link>
                      <Link to="/#proyectos" className="btn btn-ghost btn-lg">
                        {t("projectDetail.viewAll")}
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
