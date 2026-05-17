/**
 * Cliente admin de proyectos.
 *
 * Tras el merge con la app `proyectos` del otro programador, el backend expone
 * DOS modelos distintos (`ProyectoRealizado` y `ProyectoEnProgreso`) con muchos
 * más campos que el modelo `Project` original. Para no romper el UI admin
 * existente, esta capa:
 *
 *  - Expone un tipo `AdminProject` con los campos comunes que el UI ya usa.
 *  - Recibe/escribe en los nuevos endpoints `/api/proyectos/en-progreso/` y
 *    `/api/proyectos/realizados/` mapeando ida y vuelta.
 *  - Usa el campo `slug` como identificador estable (ambos modelos lo tienen).
 *  - Ignora silenciosamente los campos que el backend no soporta (tag, tint,
 *    summary, status_label, photo_label) — son metadatos locales que el UI
 *    seguirá manteniendo en memoria pero no se persisten.
 *
 * NOTA: Las nuevas capacidades (categorías, imágenes antes/después,
 * necesidades, actualizaciones) NO están expuestas aquí. Se recomienda
 * construir nuevas pantallas admin específicas para esos recursos.
 */
import { apiFetch } from "../client";

export type AdminProjectKind = "en-progreso" | "realizado";

export interface AdminProjectImage {
  id: number;
  image: string;
  sort_order: number;
  is_cover: boolean;
  alt: string;
}

export interface AdminProject {
  slug: string;
  kind: AdminProjectKind;
  /** Tag visual (01, 02, ...). Solo existe en frontend. */
  tag: string;
  status: "en-curso" | "realizado" | "emergencia";
  tint: "red" | "blue" | "none";
  goal: number;
  raised: number;
  percent: number;
  year: string;
  title: string;
  summary: string;
  location: string;
  status_label: string;
  photo_label: string;
  sort_order: number;
  images: AdminProjectImage[];
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProjectInput {
  slug: string;
  tag?: string;
  status: AdminProject["status"];
  tint?: AdminProject["tint"];
  goal: number;
  raised: number;
  percent: number;
  year?: string;
  title?: string;
  summary?: string;
  location?: string;
  status_label?: string;
  photo_label?: string;
  sort_order?: number;
}

interface BackendEnProgreso {
  id: number;
  slug: string;
  title: string;
  description: string;
  estado?: string;
  urgencia?: string;
  meta_donacion?: string | number;
  recaudado?: string | number;
  porcentaje_recaudado?: number;
  start_date?: string | null;
  estimated_end_date?: string | null;
  location?: string;
  cover_image?: string | null;
  galeria?: AdminProjectImage[];
  created_at?: string;
  updated_at?: string;
}

interface BackendRealizado {
  id: number;
  slug: string;
  title: string;
  description: string;
  inversion_total?: string | number;
  end_date?: string | null;
  start_date?: string | null;
  location?: string;
  impacto_nivel?: string;
  cover_image?: string | null;
  galeria?: AdminProjectImage[];
  created_at?: string;
  updated_at?: string;
}

interface PaginatedResponse<T> {
  results: T[];
}

function unwrapList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

function toNumber(v: string | number | undefined | null, fb = 0): number {
  if (v === undefined || v === null) return fb;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? Math.round(n) : fb;
}

function enProgresoToAdmin(p: BackendEnProgreso): AdminProject {
  const urgencia = (p.urgencia ?? "").toUpperCase();
  const status: AdminProject["status"] =
    urgencia === "CRITICA" || urgencia === "ALTA" ? "emergencia" : "en-curso";
  return {
    slug: p.slug,
    kind: "en-progreso",
    tag: "",
    status,
    tint: status === "emergencia" ? "blue" : "red",
    goal: toNumber(p.meta_donacion),
    raised: toNumber(p.recaudado),
    percent: toNumber(p.porcentaje_recaudado, 0),
    year: p.start_date ? p.start_date.slice(0, 4) : "",
    title: p.title,
    summary: p.description,
    location: p.location ?? "",
    status_label: status,
    photo_label: "",
    sort_order: 0,
    images: p.galeria ?? [],
    cover_image: p.cover_image ?? null,
    created_at: p.created_at ?? "",
    updated_at: p.updated_at ?? "",
  };
}

function realizadoToAdmin(p: BackendRealizado): AdminProject {
  const goal = toNumber(p.inversion_total);
  return {
    slug: p.slug,
    kind: "realizado",
    tag: "",
    status: "realizado",
    tint: "none",
    goal,
    raised: goal,
    percent: 100,
    year: p.end_date ? p.end_date.slice(0, 4) : "",
    title: p.title,
    summary: p.description,
    location: p.location ?? "",
    status_label: "realizado",
    photo_label: "",
    sort_order: 0,
    images: p.galeria ?? [],
    cover_image: p.cover_image ?? null,
    created_at: p.created_at ?? "",
    updated_at: p.updated_at ?? "",
  };
}

function adminInputToEnProgreso(
  data: Partial<AdminProjectInput>,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.slug) body.slug = data.slug;
  if (data.title !== undefined) body.title = data.title;
  if (data.summary !== undefined) body.description = data.summary;
  if (data.location !== undefined) body.location = data.location;
  if (data.goal !== undefined) body.meta_donacion = data.goal;
  if (data.raised !== undefined) body.recaudado = data.raised;
  if (data.year) body.start_date = `${data.year}-01-01`;
  if (data.status === "emergencia") body.urgencia = "ALTA";
  return body;
}

function adminInputToRealizado(
  data: Partial<AdminProjectInput>,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.slug) body.slug = data.slug;
  if (data.title !== undefined) body.title = data.title;
  if (data.summary !== undefined) body.description = data.summary;
  if (data.location !== undefined) body.location = data.location;
  if (data.goal !== undefined) body.inversion_total = data.goal;
  if (data.year) body.end_date = `${data.year}-12-31`;
  return body;
}

export async function listAdminProjects(): Promise<AdminProject[]> {
  const [progreso, realizados] = await Promise.all([
    apiFetch<BackendEnProgreso[] | PaginatedResponse<BackendEnProgreso>>(
      "/api/proyectos/en-progreso/",
    ),
    apiFetch<BackendRealizado[] | PaginatedResponse<BackendRealizado>>(
      "/api/proyectos/realizados/",
    ),
  ]);
  return [
    ...unwrapList(progreso).map(enProgresoToAdmin),
    ...unwrapList(realizados).map(realizadoToAdmin),
  ];
}

export async function getAdminProject(slug: string): Promise<AdminProject> {
  try {
    const p = await apiFetch<BackendEnProgreso>(
      `/api/proyectos/en-progreso/${slug}/`,
    );
    return enProgresoToAdmin(p);
  } catch {
    const p = await apiFetch<BackendRealizado>(
      `/api/proyectos/realizados/${slug}/`,
    );
    return realizadoToAdmin(p);
  }
}

export async function createProject(
  data: AdminProjectInput,
): Promise<AdminProject> {
  if (data.status === "realizado") {
    const p = await apiFetch<BackendRealizado>("/api/proyectos/realizados/", {
      method: "POST",
      body: adminInputToRealizado(data),
    });
    return realizadoToAdmin(p);
  }
  const p = await apiFetch<BackendEnProgreso>("/api/proyectos/en-progreso/", {
    method: "POST",
    body: adminInputToEnProgreso(data),
  });
  return enProgresoToAdmin(p);
}

export async function updateProject(
  slug: string,
  data: Partial<AdminProjectInput>,
): Promise<AdminProject> {
  // Decidir el kind por el status si viene, si no consultar.
  if (data.status === "realizado") {
    const p = await apiFetch<BackendRealizado>(
      `/api/proyectos/realizados/${slug}/`,
      { method: "PATCH", body: adminInputToRealizado(data) },
    );
    return realizadoToAdmin(p);
  }
  if (data.status) {
    const p = await apiFetch<BackendEnProgreso>(
      `/api/proyectos/en-progreso/${slug}/`,
      { method: "PATCH", body: adminInputToEnProgreso(data) },
    );
    return enProgresoToAdmin(p);
  }
  const current = await getAdminProject(slug);
  if (current.kind === "realizado") {
    const p = await apiFetch<BackendRealizado>(
      `/api/proyectos/realizados/${slug}/`,
      { method: "PATCH", body: adminInputToRealizado(data) },
    );
    return realizadoToAdmin(p);
  }
  const p = await apiFetch<BackendEnProgreso>(
    `/api/proyectos/en-progreso/${slug}/`,
    { method: "PATCH", body: adminInputToEnProgreso(data) },
  );
  return enProgresoToAdmin(p);
}

export async function deleteProject(slug: string): Promise<void> {
  // Tratar de borrar en ambos endpoints; uno de los dos responderá 404.
  try {
    await apiFetch(`/api/proyectos/en-progreso/${slug}/`, { method: "DELETE" });
    return;
  } catch {
    /* fallthrough */
  }
  await apiFetch(`/api/proyectos/realizados/${slug}/`, { method: "DELETE" });
}

export async function uploadProjectImage(
  slug: string,
  file: File,
  meta: { alt?: string; sort_order?: number; is_cover?: boolean } = {},
): Promise<AdminProjectImage> {
  // Subir a la galería del proyecto en progreso (más común). Para realizados
  // usa imagenes-antes-despues vía endpoints específicos del backend nuevo.
  const fd = new FormData();
  fd.append("image", file);
  if (meta.alt) fd.append("title", meta.alt);
  if (meta.sort_order !== undefined)
    fd.append("order", String(meta.sort_order));
  return apiFetch<AdminProjectImage>(
    `/api/proyectos/en-progreso/${slug}/galeria/`,
    { method: "POST", body: fd },
  );
}

export async function deleteProjectImage(
  slug: string,
  imageId: number,
): Promise<void> {
  await apiFetch(`/api/proyectos/en-progreso/${slug}/galeria/${imageId}/`, {
    method: "DELETE",
  });
}

export async function setProjectCover(
  _slug: string,
  _imageId: number,
): Promise<AdminProjectImage> {
  // El backend nuevo NO tiene un endpoint específico para marcar cover; el
  // cover_image se administra como campo del proyecto. Esta función queda
  // como no-op pero retorna una respuesta consistente.
  throw new Error(
    "Marcar imagen como portada no está implementado en el backend nuevo. " +
      "Edita el campo cover_image del proyecto directamente.",
  );
}
