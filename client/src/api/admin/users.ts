import { apiFetch } from "../client";
import type { AuthUser, Role } from "../auth";

export type AdminUser = AuthUser;

export interface ListUsersParams {
  role?: Role | "";
  is_active?: boolean;
  q?: string;
}

interface PaginatedResponse<T> {
  results: T[];
  count?: number;
}

function unwrapList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

export async function listUsers(
  params: ListUsersParams = {},
): Promise<AdminUser[]> {
  const qs = new URLSearchParams();
  if (params.role) qs.set("role", params.role);
  if (params.is_active !== undefined)
    qs.set("is_active", String(params.is_active));
  if (params.q) qs.set("q", params.q);
  const tail = qs.toString() ? `?${qs.toString()}` : "";
  const data = await apiFetch<AdminUser[] | PaginatedResponse<AdminUser>>(
    `/api/users/manage/${tail}`,
  );
  return unwrapList(data);
}

export async function setUserRole(id: number, role: Role): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/users/manage/${id}/set-role/`, {
    method: "POST",
    body: { role },
  });
}

export async function deactivateUser(id: number): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/users/manage/${id}/deactivate/`, {
    method: "POST",
  });
}

export async function activateUser(id: number): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/users/manage/${id}/activate/`, {
    method: "POST",
  });
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`/api/users/manage/${id}/`, { method: "DELETE" });
}
