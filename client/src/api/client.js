/**
 * Cliente fetch con manejo automático de refresh del access token JWT.
 *
 * Estrategia (acordada con el usuario):
 *  - Access token guardado SOLO en memoria (variable de módulo).
 *  - Refresh token en cookie httpOnly que el navegador adjunta automáticamente
 *    a /api/auth/*.
 *  - Si una llamada devuelve 401, intentamos un POST /api/auth/refresh/.
 *    Si refresca, reintentamos la llamada original una vez.
 *  - Si refresh falla, limpiamos sesión y propagamos error.
 */
let accessToken = null;
let onUnauthorized = null;
export function setAccessToken(token) {
    accessToken = token;
}
export function getAccessToken() {
    return accessToken;
}
export function onAuthFailure(cb) {
    onUnauthorized = cb;
}
async function refreshAccess() {
    const res = await fetch("/api/auth/refresh/", {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok)
        return null;
    const data = await res.json();
    if (typeof data?.access === "string") {
        accessToken = data.access;
        return accessToken;
    }
    return null;
}
export async function apiFetch(path, init = {}) {
    const { body, headers, ...rest } = init;
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const finalHeaders = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
    };
    if (accessToken) {
        finalHeaders.Authorization = `Bearer ${accessToken}`;
    }
    const finalBody = body === undefined
        ? undefined
        : isFormData
            ? body
            : JSON.stringify(body);
    let res = await fetch(path, {
        ...rest,
        headers: finalHeaders,
        body: finalBody,
        credentials: "include",
    });
    // Si 401, intentar refresh una vez (excepto si ya estamos en /auth/*)
    if (res.status === 401 && !path.startsWith("/api/auth/")) {
        const newAccess = await refreshAccess();
        if (newAccess) {
            finalHeaders.Authorization = `Bearer ${newAccess}`;
            res = await fetch(path, {
                ...rest,
                headers: finalHeaders,
                body: finalBody,
                credentials: "include",
            });
        }
        else if (onUnauthorized) {
            onUnauthorized();
        }
    }
    if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
            const data = await res.json();
            if (data?.detail)
                detail = data.detail;
            else if (typeof data === "object")
                detail = JSON.stringify(data);
        }
        catch {
            /* ignore */
        }
        throw new ApiError(detail, res.status);
    }
    if (res.status === 204)
        return undefined;
    return (await res.json());
}
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}
