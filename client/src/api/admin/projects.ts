/**
 * Cliente admin de proyectos.
 *
 * El backend expone DOS modelos (`ProyectoRealizado` y `ProyectoEnProgreso`)
 * con campos obligatorios (cover_image, start_date, end_date/necesidades).
 * Esta capa:
 *  - Expone `AdminProject` con los campos que el UI admin usa.
 *  - Envía `FormData` (multipart) cuando hay archivo de portada; JSON si no.
 *  - Usa `slug` como identificador estable.
 *  - Gestiona la galería vía las rutas anidadas por slug
 *    `/api/proyectos/{kind}/{slug}/galeria/`.
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
  /** Requeridos por el backend nuevo. */
  start_date?: string;
  end_date?: string;
  /** Solo proyectos en progreso. */
  necesidades?: string;
  /** Archivo de portada (obligatorio al crear). */
  cover_image?: File | null;
}

interface BackendGaleria {
  id: number;
  image?: string | null;
  image_url?: string | null;
  title?: string;
  description?: string;
  order?: number;
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
  necesidades?: string;
  location?: string;
  cover_image?: string | null;
  cover_image_url?: string | null;
  galeria?: BackendGaleria[];
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
  cover_image_url?: string | null;
  galeria?: BackendGaleria[];
  created_at?: string;
  updated_at?: string;
}

interface PaginatedResponse<T> {
  results: T[];
}

function unwrapList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

/** Segmento de URL del backend para cada tipo de proyecto. */
function kindPath(kind: AdminProjectKind): string {
  return kind === "realizado" ? "realizados" : "en-progreso";
}

function toNumber(v: string | number | undefined | null, fb = 0): number {
  if (v === undefined || v === null) return fb;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? Math.round(n) : fb;
}

function toAdminImage(
  g: BackendGaleria,
  coverUrl: string | null,
): AdminProjectImage {
  const url = g.image_url ?? g.image ?? "";
  return {
    id: g.id,
    image: url,
    sort_order: g.order ?? 0,
    is_cover: Boolean(coverUrl) && url === coverUrl,
    alt: g.title ?? "",
  };
}

function buildBody(obj: Record<string, unknown>): Record<string, unknown> | FormData {
  const hasFile = Object.values(obj).some(
    (v) => typeof File !== "undefined" && v instanceof File,
  );
  if (!hasFile) return obj;
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (v instanceof File) fd.append(k, v);
    else fd.append(k, String(v));
  }
  return fd;
}

function enProgresoToAdmin(p: BackendEnProgreso): AdminProject {
  const urgencia = (p.urgencia ?? "").toUpperCase();
  const status: AdminProject["status"] =
    urgencia === "CRITICA" || urgencia === "ALTA" ? "emergencia" : "en-curso";
  const cover = p.cover_image_url ?? p.cover_image ?? null;
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
    images: (p.galeria ?? []).map((g) => toAdminImage(g, cover)),
    cover_image: cover,
    created_at: p.created_at ?? "",
    updated_at: p.updated_at ?? "",
  };
}

function realizadoToAdmin(p: BackendRealizado): AdminProject {
  const goal = toNumber(p.inversion_total);
  const cover = p.cover_image_url ?? p.cover_image ?? null;
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
    images: (p.galeria ?? []).map((g) => toAdminImage(g, cover)),
    cover_image: cover,
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
  if (data.necesidades) body.necesidades = data.necesidades;
  if (data.start_date) body.start_date = data.start_date;
  else if (data.year) body.start_date = `${data.year}-01-01`;
  if (data.end_date) body.estimated_end_date = data.end_date;
  if (data.status === "emergencia") body.urgencia = "ALTA";
  if (data.cover_image instanceof File) body.cover_image = data.cover_image;
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
  if (data.start_date) body.start_date = data.start_date;
  else if (data.year) body.start_date = `${data.year}-01-01`;
  if (data.end_date) body.end_date = data.end_date;
  else if (data.year) body.end_date = `${data.year}-12-31`;
  if (data.cover_image instanceof File) body.cover_image = data.cover_image;
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
      body: buildBody(adminInputToRealizado(data)),
    });
    return realizadoToAdmin(p);
  }
  const p = await apiFetch<BackendEnProgreso>("/api/proyectos/en-progreso/", {
    method: "POST",
    body: buildBody(adminInputToEnProgreso(data)),
  });
  return enProgresoToAdmin(p);
}

export async function updateProject(
  slug: string,
  data: Partial<AdminProjectInput>,
): Promise<AdminProject> {
  if (data.status === "realizado") {
    const p = await apiFetch<BackendRealizado>(
      `/api/proyectos/realizados/${slug}/`,
      { method: "PATCH", body: buildBody(adminInputToRealizado(data)) },
    );
    return realizadoToAdmin(p);
  }
  if (data.status) {
    const p = await apiFetch<BackendEnProgreso>(
      `/api/proyectos/en-progreso/${slug}/`,
      { method: "PATCH", body: buildBody(adminInputToEnProgreso(data)) },
    );
    return enProgresoToAdmin(p);
  }
  const current = await getAdminProject(slug);
  if (current.kind === "realizado") {
    const p = await apiFetch<BackendRealizado>(
      `/api/proyectos/realizados/${slug}/`,
      { method: "PATCH", body: buildBody(adminInputToRealizado(data)) },
    );
    return realizadoToAdmin(p);
  }
  const p = await apiFetch<BackendEnProgreso>(
    `/api/proyectos/en-progreso/${slug}/`,
    { method: "PATCH", body: buildBody(adminInputToEnProgreso(data)) },
  );
  return enProgresoToAdmin(p);
}

export async function deleteProject(slug: string): Promise<void> {
  try {
    await apiFetch(`/api/proyectos/en-progreso/${slug}/`, { method: "DELETE" });
    return;
  } catch {
    /* fallthrough */
  }
  await apiFetch(`/api/proyectos/realizados/${slug}/`, { method: "DELETE" });
}

export async function uploadProjectImage(
  kind: AdminProjectKind,
  slug: string,
  file: File,
  meta: { alt?: string; sort_order?: number } = {},
): Promise<AdminProjectImage> {
  const fd = new FormData();
  fd.append("image", file);
  if (meta.alt) fd.append("title", meta.alt);
  if (meta.sort_order !== undefined)
    fd.append("order", String(meta.sort_order));
  const g = await apiFetch<BackendGaleria>(
    `/api/proyectos/${kindPath(kind)}/${slug}/galeria/`,
    { method: "POST", body: fd },
  );
  return toAdminImage(g, null);
}

export async function deleteProjectImage(
  kind: AdminProjectKind,
  slug: string,
  imageId: number,
): Promise<void> {
  await apiFetch(
    `/api/proyectos/${kindPath(kind)}/${slug}/galeria/${imageId}/`,
    { method: "DELETE" },
  );
}

/**
 * "Marcar portada": el backend no tiene un flag is_cover en galería; la
 * portada es el campo `cover_image` del proyecto. Descargamos la imagen de
 * galería y la subimos como cover_image del proyecto vía PATCH multipart.
 */
export async function setProjectCover(
  kind: AdminProjectKind,
  slug: string,
  imageUrl: string,
): Promise<AdminProject> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error("No se pudo leer la imagen de galería.");
  const blob = await res.blob();
  const name = imageUrl.split("/").pop() || "portada.jpg";
  const file = new File([blob], name, {
    type: blob.type || "image/jpeg",
  });
  const fd = new FormData();
  fd.append("cover_image", file);
  if (kind === "realizado") {
    const p = await apiFetch<BackendRealizado>(
      `/api/proyectos/realizados/${slug}/`,
      { method: "PATCH", body: fd },
    );
    return realizadoToAdmin(p);
  }
  const p = await apiFetch<BackendEnProgreso>(
    `/api/proyectos/en-progreso/${slug}/`,
    { method: "PATCH", body: fd },
  );
  return enProgresoToAdmin(p);
}
