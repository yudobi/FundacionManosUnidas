import { Link } from "react-router-dom";
import { useState } from "react";
import { useAdminProjects, useDeleteProject } from "../../hooks/adminQueries";
import { formatMXN } from "../../lib/formatMXN";

const STATUS_COLOR: Record<string, { bg: string; fg: string; label: string }> = {
  "en-curso": { bg: "var(--green-soft)", fg: "var(--green-dark)", label: "En curso" },
  realizado: { bg: "var(--blue-soft)", fg: "var(--blue)", label: "Realizado" },
  emergencia: { bg: "var(--red-soft)", fg: "var(--red-dark)", label: "Emergencia" },
};

export default function AdminProjects() {
  const { data: projects = [], isLoading, isError } = useAdminProjects();
  const del = useDeleteProject();
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  function askDelete(slug: string) {
    setConfirmSlug(slug);
  }

  function confirmDelete() {
    if (!confirmSlug) return;
    del.mutate(confirmSlug, {
      onSettled: () => setConfirmSlug(null),
    });
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="eyebrow blue">Proyectos</span>
          <h1
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "12px 0 0",
            }}
          >
            Gestión de proyectos
          </h1>
        </div>
        <Link to="/admin/proyectos/nuevo" className="btn btn-red">
          + Nuevo proyecto
        </Link>
      </div>

      {isError && (
        <p
          style={{
            padding: "12px 14px",
            background: "var(--red-soft)",
            color: "var(--red-dark)",
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          No pudimos cargar los proyectos. Verifica que el servidor Django esté
          corriendo en :8000.
        </p>
      )}

      {isLoading ? (
        <p style={{ color: "var(--muted)" }}>Cargando…</p>
      ) : projects.length === 0 ? (
        <div
          style={{
            padding: 32,
            border: "1px dashed var(--line)",
            borderRadius: "var(--radius-lg)",
            background: "#fff",
            textAlign: "center",
            color: "var(--muted)",
          }}
        >
          No hay proyectos todavía. Crea el primero con{" "}
          <Link to="/admin/proyectos/nuevo" style={{ color: "var(--red)" }}>
            + Nuevo proyecto
          </Link>
          .
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-soft)" }}>
                {[
                  "Foto",
                  "Slug",
                  "Título",
                  "Estado",
                  "Progreso",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const st = STATUS_COLOR[p.status] ?? {
                  bg: "var(--bg-soft)",
                  fg: "var(--muted)",
                  label: p.status,
                };
                return (
                  <tr
                    key={p.slug}
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <td style={{ padding: 12, width: 88 }}>
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt=""
                          loading="lazy"
                          style={{
                            width: 64,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid var(--line)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 64,
                            height: 48,
                            borderRadius: 6,
                            background: "var(--bg-soft)",
                            border: "1px dashed var(--line)",
                            display: "grid",
                            placeItems: "center",
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--muted)",
                          }}
                        >
                          —
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--ink-soft)",
                      }}
                    >
                      {p.slug}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--ink)",
                      }}
                    >
                      {p.title || (
                        <em style={{ color: "var(--muted)" }}>(sin título)</em>
                      )}
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          fontWeight: 400,
                          marginTop: 2,
                        }}
                      >
                        {p.location}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        className="chip"
                        style={{
                          background: st.bg,
                          color: st.fg,
                          border: "none",
                        }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: 12,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--ink-soft)",
                      }}
                    >
                      <div>{p.percent}%</div>
                      <div style={{ color: "var(--muted)" }}>
                        {formatMXN(p.raised)} / {formatMXN(p.goal)}
                      </div>
                    </td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <Link
                        to={`/admin/proyectos/${p.slug}`}
                        className="btn btn-ghost"
                        style={{ padding: "6px 12px", fontSize: 12 }}
                      >
                        Editar
                      </Link>{" "}
                      <button
                        type="button"
                        className="btn"
                        onClick={() => askDelete(p.slug)}
                        style={{
                          padding: "6px 12px",
                          fontSize: 12,
                          background: "transparent",
                          color: "var(--red)",
                          border: "1px solid var(--red-soft)",
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmSlug && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmSlug(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,15,31,0.55)",
            display: "grid",
            placeItems: "center",
            padding: 20,
            zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: 28,
              maxWidth: 440,
              width: "100%",
            }}
          >
            <h3 style={{ margin: 0 }}>Eliminar proyecto</h3>
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "var(--ink-soft)",
              }}
            >
              Vas a eliminar permanentemente{" "}
              <code
                style={{
                  background: "var(--bg-soft)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {confirmSlug}
              </code>{" "}
              y todas sus imágenes. Esta acción no se puede deshacer.
            </p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setConfirmSlug(null)}
                disabled={del.isPending}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-red"
                onClick={confirmDelete}
                disabled={del.isPending}
              >
                {del.isPending ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
