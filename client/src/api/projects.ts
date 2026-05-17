import { projects as seed, type Project } from "../data/projects";
import { apiFetch } from "./client";

/**
 * Shapes que devuelve la API después del merge con la app `proyectos`
 * del otro programador. Se mapean al tipo `Project` que ya usa el UI.
 */

interface BackendImagen {
  id: number;
  image?: string | null;
  image_url?: string | null;
  sort_order?: number;
  order?: number;
  is_cover?: boolean;
  alt?: string;
}

interface BackendImagenAntesDespues {
  id: number;
  image_before?: string | null;
  image_after?: string | null;
  image_before_url?: string | null;
  image_after_url?: string | null;
  title?: string;
  is_featured?: boolean;
  order?: number;
}

interface BackendProyectoRealizado {
  id: number;
  title: string;
  slug: string;
  description: string;
  categoria?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  location?: string;
  impacto_nivel?: string;
  beneficiarios?: number;
  voluntarios?: number;
  inversion_total?: string | number;
  cover_image?: string | null;
  cover_image_url?: string | null;
  video_url?: string | null;
  is_published?: boolean;
  imagenes_antes_despues?: BackendImagenAntesDespues[];
  galeria?: BackendImagen[];
}

interface BackendProyectoEnProgreso {
  id: number;
  title: string;
  slug: string;
  description: string;
  estado?: string;
  urgencia?: string;
  categoria?: number | null;
  start_date?: string | null;
  estimated_end_date?: string | null;
  meta_donacion?: string | number;
  recaudado?: string | number;
  porcentaje_recaudado?: number;
  avance_porcentaje?: number;
  voluntarios_necesarios?: number;
  voluntarios_actuales?: number;
  cover_image?: string | null;
  cover_image_url?: string | null;
  video_url?: string | null;
  galeria?: BackendImagen[];
}

interface PaginatedResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

function unwrapList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

function toNumber(v: string | number | undefined | null, fallback = 0): number {
  if (v === undefined || v === null) return fallback;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function imagesFromGaleria(galeria: BackendImagen[] | undefined): string[] {
  if (!galeria || galeria.length === 0) return [];
  const sorted = [...galeria].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return (a.sort_order ?? a.order ?? 0) - (b.sort_order ?? b.order ?? 0);
  });
  return sorted
    .map((g) => g.image_url ?? g.image ?? "")
    .filter((u): u is string => Boolean(u));
}

function fallbackImages(slug: string): string[] {
  return seed.find((s) => s.id === slug)?.images ?? [];
}

function fromEnProgreso(
  p: BackendProyectoEnProgreso,
  index: number,
): Project {
  const galleryUrls = imagesFromGaleria(p.galeria);
  const cover = p.cover_image_url ?? p.cover_image ?? null;
  const images = [
    ...(cover ? [cover] : []),
    ...galleryUrls,
  ];
  const finalImages = images.length > 0 ? images : fallbackImages(p.slug);

  const urgencia = (p.urgencia ?? "").toUpperCase();
  const isEmergency = urgencia === "CRITICA" || urgencia === "ALTA";

  return {
    id: p.slug,
    tag: String(index + 1).padStart(2, "0"),
    status: isEmergency ? "emergencia" : "en-curso",
    goal: toNumber(p.meta_donacion),
    raised: toNumber(p.recaudado),
    percent: toNumber(p.porcentaje_recaudado ?? p.avance_porcentaje, 0),
    tint: isEmergency ? "blue" : "red",
    images: finalImages,
  };
}

function fromRealizado(
  p: BackendProyectoRealizado,
  index: number,
): Project {
  const galleryUrls = imagesFromGaleria(p.galeria);
  const cover = p.cover_image_url ?? p.cover_image ?? null;
  const images = [
    ...(cover ? [cover] : []),
    ...galleryUrls,
  ];
  const finalImages = images.length > 0 ? images : fallbackImages(p.slug);
  const year = p.end_date ? p.end_date.slice(0, 4) : undefined;
  const goal = toNumber(p.inversion_total);

  return {
    id: p.slug,
    tag: String(index + 1).padStart(2, "0"),
    status: "realizado",
    goal,
    raised: goal,
    percent: 100,
    tint: "none",
    year,
    images: finalImages,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const [enProgreso, realizados] = await Promise.all([
    apiFetch<BackendProyectoEnProgreso[] | PaginatedResponse<BackendProyectoEnProgreso>>(
      "/api/proyectos/en-progreso/",
    ),
    apiFetch<BackendProyectoRealizado[] | PaginatedResponse<BackendProyectoRealizado>>(
      "/api/proyectos/realizados/",
    ),
  ]);
  const enProgresoList = unwrapList(enProgreso).map(fromEnProgreso);
  const realizadosList = unwrapList(realizados).map((p, i) =>
    fromRealizado(p, enProgresoList.length + i),
  );
  return [...enProgresoList, ...realizadosList];
}

export async function fetchProject(id: string): Promise<Project | null> {
  // Intentar primero como proyecto en progreso, después como realizado.
  try {
    const p = await apiFetch<BackendProyectoEnProgreso>(
      `/api/proyectos/en-progreso/${id}/`,
    );
    return fromEnProgreso(p, 0);
  } catch {
    /* fallthrough */
  }
  try {
    const p = await apiFetch<BackendProyectoRealizado>(
      `/api/proyectos/realizados/${id}/`,
    );
    return fromRealizado(p, 0);
  } catch {
    return null;
  }
}
