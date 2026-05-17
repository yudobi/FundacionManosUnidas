/**
 * Cliente admin de testimonios.
 *
 * Tras el merge con la app `testimonios` del otro programador, el modelo
 * tiene muchos más campos: author_type, status (PENDING/APPROVED/REJECTED/
 * FEATURED), moderation_notes, etc. Esta capa mapea hacia el shape que el
 * UI admin ya espera y traduce las acciones approve/reject al endpoint
 * `moderate/` del backend.
 */
import { apiFetch } from "../client";

export type TestimonialStatus = "pending" | "approved" | "rejected" | "featured";

export interface AdminTestimonial {
  id: number;
  slug: string;
  quote: string;
  name: string;
  initials: string;
  role: string;
  accent: "red" | "blue";
  photo: string | null;
  status: TestimonialStatus;
  submitter_email: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface BackendTestimonio {
  id: number;
  author_name: string;
  author_email?: string;
  author_type: string;
  author_photo?: string | null;
  author_photo_url?: string | null;
  title?: string;
  content: string;
  status: string;
  featured_order?: number;
  created_at?: string;
  updated_at?: string;
}

interface PaginatedResponse<T> {
  results: T[];
}

function unwrapList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "??";
}

const STATUS_MAP: Record<string, TestimonialStatus> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  FEATURED: "featured",
};

const REVERSE_STATUS: Record<TestimonialStatus, string> = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
  featured: "FEATURED",
};

const ACCENT_BY_TYPE: Record<string, "red" | "blue"> = {
  DONANTE: "red",
  VOLUNTARIO: "blue",
  BENEFICIARIO: "red",
  ALIADO: "blue",
  PARTICIPANTE: "red",
};

function toAdmin(t: BackendTestimonio): AdminTestimonial {
  const type = (t.author_type || "").toUpperCase();
  return {
    id: t.id,
    slug: String(t.id),
    quote: t.content,
    name: t.author_name,
    initials: initialsFromName(t.author_name),
    role: type,
    accent: ACCENT_BY_TYPE[type] ?? "red",
    photo: t.author_photo_url ?? t.author_photo ?? null,
    status: STATUS_MAP[(t.status || "").toUpperCase()] ?? "pending",
    submitter_email: t.author_email ?? "",
    sort_order: t.featured_order ?? 0,
    created_at: t.created_at ?? "",
    updated_at: t.updated_at ?? "",
  };
}

export async function listAdminTestimonials(
  status?: TestimonialStatus,
): Promise<AdminTestimonial[]> {
  const qs = status ? `?status=${REVERSE_STATUS[status]}` : "";
  const data = await apiFetch<
    BackendTestimonio[] | PaginatedResponse<BackendTestimonio>
  >(`/api/testimonios/testimonios/${qs}`);
  return unwrapList(data).map(toAdmin);
}

export async function approveTestimonial(id: number): Promise<AdminTestimonial> {
  const t = await apiFetch<BackendTestimonio>(
    `/api/testimonios/testimonios/${id}/moderate/`,
    { method: "POST", body: { action: "approve" } },
  );
  return toAdmin(t);
}

export async function rejectTestimonial(
  id: number,
  reason = "",
): Promise<AdminTestimonial> {
  const t = await apiFetch<BackendTestimonio>(
    `/api/testimonios/testimonios/${id}/moderate/`,
    { method: "POST", body: { action: "reject", rejection_reason: reason } },
  );
  return toAdmin(t);
}

export async function deleteTestimonial(id: number): Promise<void> {
  await apiFetch(`/api/testimonios/testimonios/${id}/`, { method: "DELETE" });
}

export async function updateTestimonial(
  id: number,
  data: Partial<Omit<AdminTestimonial, "id" | "created_at" | "updated_at">>,
): Promise<AdminTestimonial> {
  const body: Record<string, unknown> = {};
  if (data.quote !== undefined) body.content = data.quote;
  if (data.name !== undefined) body.author_name = data.name;
  if (data.role !== undefined) body.author_type = data.role;
  if (data.submitter_email !== undefined) body.author_email = data.submitter_email;
  if (data.status !== undefined) body.status = REVERSE_STATUS[data.status];
  if (data.sort_order !== undefined) body.featured_order = data.sort_order;
  const t = await apiFetch<BackendTestimonio>(
    `/api/testimonios/testimonios/${id}/`,
    { method: "PATCH", body },
  );
  return toAdmin(t);
}
