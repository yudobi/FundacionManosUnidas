/**
 * Cliente fetch con manejo automático de refresh del access token JWT.
 *
 * Estrategia (acordada con el usuario, post-merge con app `users` del remoto):
 *  - Tokens recibidos como JSON en /api/users/login/ y /api/users/register/.
 *  - Access token en memoria (módulo) + sessionStorage para persistir entre
 *    recargas de la pestaña.
 *  - Refresh token en localStorage (sobrevive a cierres del navegador). El
 *    backend rota el refresh en cada uso y blackliste el anterior.
 *  - Si una llamada devuelve 401, intentamos POST /api/users/token/refresh/
 *    con el refresh almacenado; si éxito, reintentamos la llamada original.
 */

const ACCESS_KEY = "mu_access";
const REFRESH_KEY = "mu_refresh";

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

function readSession(key: string, storage: Storage): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  accessToken = readSession(ACCESS_KEY, window.sessionStorage);
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window === "undefined") return;
  try {
    if (token) window.sessionStorage.setItem(ACCESS_KEY, token);
    else window.sessionStorage.removeItem(ACCESS_KEY);
  } catch {
    /* storage no disponible */
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(REFRESH_KEY, token);
    else window.localStorage.removeItem(REFRESH_KEY);
  } catch {
    /* storage no disponible */
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return readSession(REFRESH_KEY, window.localStorage);
}

export function clearTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}

export function onAuthFailure(cb: () => void) {
  onUnauthorized = cb;
}

interface RequestInitJSON extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function refreshAccess(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch("/api/users/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (typeof data?.access === "string") {
    setAccessToken(data.access);
    if (typeof data?.refresh === "string") setRefreshToken(data.refresh);
    return data.access;
  }
  return null;
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInitJSON = {},
): Promise<T> {
  const { body, headers, ...rest } = init;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers as Record<string, string> | undefined),
  };
  if (accessToken) {
    finalHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const finalBody =
    body === undefined
      ? undefined
      : isFormData
        ? (body as FormData)
        : JSON.stringify(body);

  let res = await fetch(path, {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  // Si 401, intentar refresh una vez (excepto si ya estamos en /users/login|register|token/refresh).
  const isAuthEndpoint =
    path.startsWith("/api/users/login") ||
    path.startsWith("/api/users/register") ||
    path.startsWith("/api/users/token/refresh");
  if (res.status === 401 && !isAuthEndpoint) {
    const newAccess = await refreshAccess();
    if (newAccess) {
      finalHeaders.Authorization = `Bearer ${newAccess}`;
      res = await fetch(path, {
        ...rest,
        headers: finalHeaders,
        body: finalBody,
      });
    } else if (onUnauthorized) {
      onUnauthorized();
    }
  }

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.detail) detail = data.detail;
      else if (data?.error) detail = data.error;
      else if (typeof data === "object") detail = JSON.stringify(data);
    } catch {
      /* ignore */
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
