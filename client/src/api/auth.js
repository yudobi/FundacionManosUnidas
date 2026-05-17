import { apiFetch, setAccessToken } from "./client";
export async function login(email, password) {
    const data = await apiFetch("/api/auth/login/", {
        method: "POST",
        body: { email, password },
    });
    setAccessToken(data.access);
    return data.user;
}
export async function logout() {
    await apiFetch("/api/auth/logout/", { method: "POST" });
    setAccessToken(null);
}
export async function fetchMe() {
    return apiFetch("/api/auth/me/");
}
/**
 * Intenta restablecer la sesión usando la cookie de refresh.
 * Devuelve el usuario si tiene éxito, null si no hay sesión válida.
 */
export async function restoreSession() {
    try {
        const r = await fetch("/api/auth/refresh/", {
            method: "POST",
            credentials: "include",
        });
        if (!r.ok)
            return null;
        const data = await r.json();
        if (!data.access)
            return null;
        setAccessToken(data.access);
        return await fetchMe();
    }
    catch {
        return null;
    }
}
