import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAdminProject,
  useCreateProject,
  useDeleteProjectImage,
  useSetProjectCover,
  useUpdateProject,
  useUploadProjectImage,
} from "../../hooks/adminQueries";
import type { AdminProjectInput } from "../../api/admin/projects";

const STATUS_OPTIONS: { value: AdminProjectInput["status"]; label: string }[] = [
  { value: "en-curso", label: "En curso" },
  { value: "realizado", label: "Realizado" },
  { value: "emergencia", label: "Emergencia" },
];

const TINT_OPTIONS: { value: AdminProjectInput["tint"]; label: string }[] = [
  { value: "none", label: "Sin tinte" },
  { value: "red", label: "Rojo" },
  { value: "blue", label: "Azul" },
];

const EMPTY_FORM: AdminProjectInput = {
  slug: "",
  tag: "",
  status: "en-curso",
  tint: "none",
  goal: 0,
  raised: 0,
  percent: 0,
  year: "",
  title: "",
  summary: "",
  location: "",
  status_label: "",
  photo_label: "",
  sort_order: 0,
  start_date: "",
  end_date: "",
  necesidades: "",
  cover_image: null,
};

function fieldGroup(children: React.ReactNode) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        marginBottom: 24,
      }}
    >
      {children}
    </div>
  );
}

export default function AdminProjectEdit() {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const isNew = !slugParam || slugParam === "nuevo";
  const navigate = useNavigate();

  const { data: project, isLoading, isError } = useAdminProject(
    isNew ? undefined : slugParam,
  );

  const kind = project?.kind ?? "en-progreso";
  const projSlug = project?.slug ?? slugParam ?? "";
  const create = useCreateProject();
  const update = useUpdateProject(slugParam ?? "");
  const upload = useUploadProjectImage(kind, projSlug);
  const delImage = useDeleteProjectImage(kind, projSlug);
  const setCover = useSetProjectCover(kind, projSlug);

  const [form, setForm] = useState<AdminProjectInput>(EMPTY_FORM);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setForm({
        slug: project.slug,
        tag: project.tag,
        status: project.status,
        tint: project.tint,
        goal: project.goal,
        raised: project.raised,
        percent: project.percent,
        year: project.year ?? "",
        title: project.title ?? "",
        summary: project.summary ?? "",
        location: project.location ?? "",
        status_label: project.status_label ?? "",
        photo_label: project.photo_label ?? "",
        sort_order: project.sort_order ?? 0,
      });
    }
  }, [project]);

  const pending = create.isPending || update.isPending;

  const sortedImages = useMemo(() => {
    if (!project) return [];
    return [...project.images].sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return a.sort_order - b.sort_order;
    });
  }, [project]);

  function setField<K extends keyof AdminProjectInput>(
    key: K,
    value: AdminProjectInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSavedMsg(null);
    setErrMsg(null);
    try {
      if (isNew) {
        const created = await create.mutateAsync(form);
        navigate(`/admin/proyectos/${created.slug}`, { replace: true });
        setSavedMsg("Proyecto creado.");
      } else {
        await update.mutateAsync(form);
        setSavedMsg("Cambios guardados.");
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Error al guardar.");
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !project) return;
    try {
      await upload.mutateAsync({ file, sort_order: project.images.length });
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Error al subir imagen.");
    }
  }

  if (!isNew && isLoading) {
    return <p style={{ color: "var(--muted)" }}>Cargando proyecto…</p>;
  }
  if (!isNew && isError) {
    return (
      <p style={{ color: "var(--red-dark)" }}>
        No pudimos cargar este proyecto.{" "}
        <Link to="/admin/proyectos">← Volver</Link>
      </p>
    );
  }

  return (
    <div style={{ maxWidth: 920 }}>
      <Link to="/admin/proyectos" className="eyebrow" style={{ marginBottom: 16 }}>
        ← Todos los proyectos
      </Link>
      <h1
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(28px, 3.5vw, 42px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "12px 0 28px",
        }}
      >
        {isNew ? "Nuevo proyecto" : `Editar · ${project?.title || project?.slug}`}
      </h1>

      <form onSubmit={handleSubmit}>
        {fieldGroup(
          <>
            <div className="divider-mono">Identificación</div>
            <div className="field-row">
              <div className="field">
                <label>Slug · URL (único)</label>
                <input
                  type="text"
                  required
                  pattern="[a-z0-9\-]+"
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  disabled={!isNew}
                  placeholder="techo-hernandez"
                />
              </div>
              <div className="field">
                <label>Tag (número visible)</label>
                <input
                  type="text"
                  required
                  value={form.tag}
                  onChange={(e) => setField("tag", e.target.value)}
                  placeholder="01"
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setField("status", e.target.value as AdminProjectInput["status"])
                  }
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Tinte (placeholder antes de subir foto)</label>
                <select
                  value={form.tint}
                  onChange={(e) =>
                    setField("tint", e.target.value as AdminProjectInput["tint"])
                  }
                >
                  {TINT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>,
        )}

        {fieldGroup(
          <>
            <div className="divider-mono">Contenido (español)</div>
            <div className="field">
              <label>Título</label>
              <input
                type="text"
                required={isNew}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Techo digno para la familia Hernández"
              />
            </div>
            <div className="field">
              <label>Resumen / descripción</label>
              <textarea
                rows={3}
                required={isNew}
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                placeholder="Una línea o dos describiendo el proyecto…"
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Ubicación</label>
                <input
                  type="text"
                  required={isNew}
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="San Andrés Cholula"
                />
              </div>
              <div className="field">
                <label>Año (solo realizado)</label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setField("year", e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Etiqueta de status (chip)</label>
                <input
                  type="text"
                  value={form.status_label}
                  onChange={(e) => setField("status_label", e.target.value)}
                  placeholder="En curso"
                />
              </div>
              <div className="field">
                <label>Etiqueta de foto (caption)</label>
                <input
                  type="text"
                  value={form.photo_label}
                  onChange={(e) => setField("photo_label", e.target.value)}
                  placeholder="Familia Hernández — fachada actual"
                />
              </div>
            </div>
          </>,
        )}

        {fieldGroup(
          <>
            <div className="divider-mono">Avance y métricas</div>
            <div className="field-row three">
              <div className="field">
                <label>Meta (MXN)</label>
                <input
                  type="number"
                  min={0}
                  value={form.goal}
                  onChange={(e) => setField("goal", Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label>Recaudado (MXN)</label>
                <input
                  type="number"
                  min={0}
                  value={form.raised}
                  onChange={(e) =>
                    setField("raised", Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="field">
                <label>% Progreso</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.percent}
                  onChange={(e) =>
                    setField("percent", Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <div className="field" style={{ maxWidth: 200 }}>
              <label>Orden de listado</label>
              <input
                type="number"
                min={0}
                value={form.sort_order ?? 0}
                onChange={(e) =>
                  setField("sort_order", Number(e.target.value) || 0)
                }
              />
            </div>
          </>,
        )}

        {fieldGroup(
          <>
            <div className="divider-mono">
              Portada y fechas (requerido por el servidor)
            </div>
            <div className="field-row">
              <div className="field">
                <label>Fecha de inicio</label>
                <input
                  type="date"
                  required={isNew}
                  value={form.start_date ?? ""}
                  onChange={(e) => setField("start_date", e.target.value)}
                />
              </div>
              <div className="field">
                <label>
                  {form.status === "realizado"
                    ? "Fecha de finalización"
                    : "Fecha estimada de fin (opcional)"}
                </label>
                <input
                  type="date"
                  required={isNew && form.status === "realizado"}
                  value={form.end_date ?? ""}
                  onChange={(e) => setField("end_date", e.target.value)}
                />
              </div>
            </div>
            {form.status !== "realizado" && (
              <div className="field">
                <label>Necesidades del proyecto</label>
                <textarea
                  rows={3}
                  required={isNew}
                  value={form.necesidades ?? ""}
                  onChange={(e) => setField("necesidades", e.target.value)}
                  placeholder="Materiales, fondos, voluntarios necesarios…"
                />
              </div>
            )}
            <div className="field">
              <label>
                Imagen de portada{" "}
                {isNew ? "(obligatoria)" : "(dejar vacío para conservar)"}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={isNew}
                onChange={(e) =>
                  setField("cover_image", e.target.files?.[0] ?? null)
                }
              />
              {!isNew && project?.cover_image && (
                <img
                  src={project.cover_image}
                  alt="Portada actual"
                  style={{
                    marginTop: 10,
                    width: 200,
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid var(--line)",
                  }}
                />
              )}
            </div>
          </>,
        )}

        {savedMsg && (
          <p
            style={{
              padding: "10px 14px",
              background: "var(--green-soft)",
              color: "var(--green-dark)",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
            role="status"
          >
            ✓ {savedMsg}
          </p>
        )}
        {errMsg && (
          <p
            style={{
              padding: "10px 14px",
              background: "var(--red-soft)",
              color: "var(--red-dark)",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
            role="alert"
          >
            {errMsg}
          </p>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            className="btn btn-red btn-lg"
            disabled={pending}
          >
            {pending
              ? "Guardando…"
              : isNew
                ? "Crear proyecto →"
                : "Guardar cambios →"}
          </button>
          <Link to="/admin/proyectos" className="btn btn-ghost btn-lg">
            Cancelar
          </Link>
        </div>
      </form>

      {/* Galería: solo visible una vez guardado */}
      {!isNew && project && (
        <div style={{ marginTop: 56 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Galería ({project.images.length})
          </h2>

          <div
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
              marginBottom: 20,
            }}
          >
            <label
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Subir nueva imagen
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={upload.isPending}
            />
            {upload.isPending && (
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                Subiendo…
              </span>
            )}
          </div>

          {sortedImages.length === 0 ? (
            <p
              style={{
                color: "var(--muted)",
                padding: 24,
                background: "var(--bg-soft)",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
              }}
            >
              Aún no hay imágenes en este proyecto.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              {sortedImages.map((img) => (
                <div
                  key={img.id}
                  style={{
                    background: "#fff",
                    border: img.is_cover
                      ? "2px solid var(--red)"
                      : "1px solid var(--line)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img.image}
                    alt={img.alt}
                    loading="lazy"
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      padding: "8px 10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {img.is_cover ? (
                      <span
                        className="chip"
                        style={{
                          background: "var(--red-soft)",
                          color: "var(--red-dark)",
                          border: "none",
                          alignSelf: "flex-start",
                        }}
                      >
                        Portada
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: "4px 10px" }}
                        onClick={() => setCover.mutate(img.image)}
                        disabled={setCover.isPending}
                      >
                        Marcar portada
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => delImage.mutate(img.id)}
                      disabled={delImage.isPending}
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        background: "transparent",
                        color: "var(--red)",
                        border: "1px solid var(--red-soft)",
                        borderRadius: 999,
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
