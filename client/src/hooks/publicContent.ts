import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

interface SiteText {
  key: string;
  label: string;
  value: Record<string, unknown>;
  updated_at: string;
}

/**
 * Lee una clave de contenido editable del backend (siteinfo).
 * Cachea 60s; los cambios del admin se reflejan tras invalidación o ese plazo.
 *
 * Las secciones públicas usan este hook con `defaultValue` fallback a i18n
 * para que la UI siga funcionando aunque el backend esté frío o caído.
 */
export function useSiteKey<T = Record<string, unknown>>(key: string) {
  return useQuery({
    queryKey: ["site-content", key],
    queryFn: () => apiFetch<SiteText>(`/api/siteinfo/content/${key}/`),
    staleTime: 1000 * 60,
    retry: false,
    select: (d): T => d.value as T,
  });
}

/**
 * Devuelve un getter `pick(field, fallback)` que prefiere el valor del backend
 * cuando existe y no es vacío. Útil para wiring incremental sobre i18n.
 */
export function useSiteContent<T>(key: string) {
  const { data } = useSiteKey<T>(key);
  function pick(field: keyof T & string, fallback: string): string {
    const v = (data as Record<string, unknown> | undefined)?.[field];
    if (typeof v === "string" && v.trim().length > 0) return v;
    return fallback;
  }
  function pickList(field: keyof T & string, fallback: string[]): string[] {
    const v = (data as Record<string, unknown> | undefined)?.[field];
    if (Array.isArray(v) && v.length > 0) return v as string[];
    return fallback;
  }
  return { data, pick, pickList };
}
