import { apiFetch } from "../client";

export interface SiteText {
  key: string;
  label: string;
  value: Record<string, unknown>;
  updated_at: string;
}

interface PaginatedResponse<T> {
  results: T[];
}

function unwrapList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

export async function listSiteContent(): Promise<SiteText[]> {
  const data = await apiFetch<SiteText[] | PaginatedResponse<SiteText>>(
    "/api/siteinfo/content/",
  );
  return unwrapList(data);
}

export async function getSiteContent(key: string): Promise<SiteText> {
  return apiFetch<SiteText>(`/api/siteinfo/content/${key}/`);
}

export async function updateSiteContent(
  key: string,
  value: Record<string, unknown>,
  label?: string,
): Promise<SiteText> {
  const body: Partial<SiteText> = { value };
  if (label !== undefined) body.label = label;
  return apiFetch<SiteText>(`/api/siteinfo/content/${key}/`, {
    method: "PATCH",
    body,
  });
}
