import { type Testimonial } from "../data/testimonials";
import { apiFetch } from "./client";

/**
 * Shape de Testimonio que devuelve el backend (`app testimonios`).
 * El UI sigue usando un tipo más pequeño (`Testimonial` con id/initials/accent),
 * así que mapeamos lo necesario.
 */
interface BackendTestimonio {
  id: number;
  author_name: string;
  author_type: string; // DONANTE | VOLUNTARIO | BENEFICIARIO | ALIADO | PARTICIPANTE
  author_photo?: string | null;
  author_photo_url?: string | null;
  title?: string;
  content: string;
  content_preview?: string;
  proyecto_nombre?: string;
  rating?: number | null;
  status?: string;
  featured_until?: string | null;
  likes?: number;
  views?: number;
}

interface PaginatedResponse<T> {
  results: T[];
  count?: number;
}

function unwrapList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const inits = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return inits || "??";
}

const ACCENT_BY_TYPE: Record<string, "red" | "blue"> = {
  DONANTE: "red",
  VOLUNTARIO: "blue",
  BENEFICIARIO: "red",
  ALIADO: "blue",
  PARTICIPANTE: "red",
};

function toFrontend(t: BackendTestimonio): Testimonial {
  const type = (t.author_type || "").toUpperCase();
  return {
    id: String(t.id),
    initials: initialsFromName(t.author_name),
    accent: ACCENT_BY_TYPE[type] ?? "red",
  };
}

export interface TestimonialSubmission {
  /** Texto del testimonio (entre 20 y 2000 caracteres). */
  quote: string;
  /** Nombre completo de quien envía. */
  name: string;
  /** Tipo del autor: DONANTE/VOLUNTARIO/BENEFICIARIO/ALIADO/PARTICIPANTE. */
  authorType?:
    | "DONANTE"
    | "VOLUNTARIO"
    | "BENEFICIARIO"
    | "ALIADO"
    | "PARTICIPANTE";
  submitter_email?: string;
  photo?: File | null;
  title?: string;
  rating?: number;
}

interface SubmitResponse {
  id: number;
  status: string;
  detail?: string;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const data = await apiFetch<
    BackendTestimonio[] | PaginatedResponse<BackendTestimonio>
  >("/api/testimonios/testimonios/");
  return unwrapList(data).map(toFrontend);
}

/**
 * Envía un testimonio público. El backend lo crea con `status=PENDING`
 * hasta que un admin lo modere desde `/api/testimonios/testimonios/{id}/moderate/`.
 */
export async function submitTestimonial(
  payload: TestimonialSubmission,
): Promise<SubmitResponse> {
  const authorType = payload.authorType ?? "PARTICIPANTE";

  if (payload.photo) {
    const fd = new FormData();
    fd.append("author_name", payload.name);
    fd.append("author_type", authorType);
    fd.append("content", payload.quote);
    if (payload.title) fd.append("title", payload.title);
    if (payload.rating !== undefined)
      fd.append("rating", String(payload.rating));
    if (payload.submitter_email)
      fd.append("author_email", payload.submitter_email);
    fd.append("author_photo", payload.photo);
    return apiFetch<SubmitResponse>("/api/testimonios/testimonios/", {
      method: "POST",
      body: fd,
    });
  }

  const body: Record<string, unknown> = {
    author_name: payload.name,
    author_type: authorType,
    content: payload.quote,
  };
  if (payload.title) body.title = payload.title;
  if (payload.rating !== undefined) body.rating = payload.rating;
  if (payload.submitter_email) body.author_email = payload.submitter_email;

  return apiFetch<SubmitResponse>("/api/testimonios/testimonios/", {
    method: "POST",
    body,
  });
}
