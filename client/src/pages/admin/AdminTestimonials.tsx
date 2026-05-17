import { useState } from "react";
import {
  useAdminTestimonials,
  useApproveTestimonial,
  useDeleteTestimonial,
  useRejectTestimonial,
} from "../../hooks/adminQueries";
import type { TestimonialStatus } from "../../api/admin/testimonials";

const TABS: { id: TestimonialStatus; label: string }[] = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobados" },
  { id: "rejected", label: "Rechazados" },
];

const ACCENT_BG: Record<string, string> = {
  red: "var(--red-soft)",
  blue: "var(--blue-soft)",
};
const ACCENT_FG: Record<string, string> = {
  red: "var(--red-dark)",
  blue: "var(--blue)",
};

export default function AdminTestimonials() {
  const [tab, setTab] = useState<TestimonialStatus>("pending");
  const { data: testimonials = [], isLoading, isError } =
    useAdminTestimonials(tab);

  const approve = useApproveTestimonial();
  const reject = useRejectTestimonial();
  const del = useDeleteTestimonial();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function confirmDelete() {
    if (!confirmId) return;
    del.mutate(confirmId, { onSettled: () => setConfirmId(null) });
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <span className="eyebrow blue">Testimonios</span>
      <h1
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "12px 0 24px",
        }}
      >
        Cola de moderación
      </h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          borderBottom: "1px solid var(--line)",
          paddingBottom: 0,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 500,
              color: tab === t.id ? "var(--ink)" : "var(--muted)",
              borderBottom:
                tab === t.id ? "2px solid var(--red)" : "2px solid transparent",
              marginBottom: -1,
              background: "transparent",
              transition: "color 160ms ease, border-color 160ms ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isError && (
        <p
          style={{
            padding: "12px 14px",
            background: "var(--red-soft)",
            color: "var(--red-dark)",
            borderRadius: 8,
          }}
        >
          No pudimos cargar los testimonios.
        </p>
      )}

      {isLoading ? (
        <p style={{ color: "var(--muted)" }}>Cargando…</p>
      ) : testimonials.length === 0 ? (
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
          {tab === "pending"
            ? "No hay testimonios pendientes de moderación."
            : tab === "approved"
              ? "Aún no hay testimonios aprobados visibles en el sitio."
              : "No hay testimonios rechazados."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {testimonials.map((t) => (
            <article
              key={t.id}
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-lg)",
                padding: 22,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 18,
                alignItems: "start",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  {t.photo ? (
                    <img
                      src={t.photo}
                      alt={t.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border:
                          t.accent === "red"
                            ? "2px solid var(--red)"
                            : "2px solid var(--blue)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          t.accent === "red" ? "var(--red)" : "var(--blue)",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                      }}
                    >
                      {t.initials || "—"}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    {(t.role || t.submitter_email) && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.06em",
                          marginTop: 2,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {t.role}
                        {t.role && t.submitter_email && " · "}
                        {t.submitter_email}
                      </div>
                    )}
                  </div>
                  <span
                    className="chip"
                    style={{
                      marginLeft: "auto",
                      background: ACCENT_BG[t.accent],
                      color: ACCENT_FG[t.accent],
                      border: "none",
                    }}
                  >
                    Acento {t.accent}
                  </span>
                </div>
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    lineHeight: 1.35,
                    letterSpacing: "-0.01em",
                    color: "var(--ink)",
                  }}
                >
                  “{t.quote}”
                </blockquote>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Recibido {new Date(t.created_at).toLocaleString("es-MX")}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minWidth: 160,
                }}
              >
                {tab !== "approved" && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => approve.mutate(t.id)}
                    disabled={approve.isPending}
                    style={{
                      background: "var(--green)",
                      color: "#fff",
                      justifyContent: "center",
                    }}
                  >
                    ✓ Aprobar
                  </button>
                )}
                {tab !== "rejected" && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => reject.mutate(t.id)}
                    disabled={reject.isPending}
                    style={{ justifyContent: "center" }}
                  >
                    Rechazar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmId(t.id)}
                  style={{
                    fontSize: 12,
                    padding: "8px 14px",
                    color: "var(--red)",
                    background: "transparent",
                    border: "1px solid var(--red-soft)",
                    borderRadius: 999,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {confirmId && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmId(null)}
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
            <h3 style={{ margin: 0 }}>Eliminar testimonio</h3>
            <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-soft)" }}>
              Vas a borrar el testimonio definitivamente. Si solo quieres
              ocultarlo, usa &ldquo;Rechazar&rdquo;.
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
                onClick={() => setConfirmId(null)}
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
