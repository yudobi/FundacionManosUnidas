import {
  apiFetch,
  clearTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./client";

export type Role =
  | "ADMIN"
  | "DONANTE"
  | "VOLUNTARIO"
  | "BENEFICIARIO"
  | "ALIADO";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: Role;
  phone: string | null;
  country: string;
  city: string;
  address: string;
  is_volunteer: boolean;
  is_donor: boolean;
  is_beneficiary: boolean;
  is_partner: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  points: number;
  level: number;
  date_joined: string;
  avatar?: string | null;
}

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "ADMIN" || user.is_superuser;
}

interface TokenResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

interface RegisterResponse {
  message: string;
  access: string;
  refresh: string;
  user: AuthUser;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const data = await apiFetch<TokenResponse>("/api/users/login/", {
    method: "POST",
    body: { email, password },
  });
  setAccessToken(data.access);
  setRefreshToken(data.refresh);
  return data.user;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: Role;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const data = await apiFetch<RegisterResponse>("/api/users/register/", {
    method: "POST",
    body: payload,
  });
  setAccessToken(data.access);
  setRefreshToken(data.refresh);
  return data.user;
}

export async function logout(): Promise<void> {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await apiFetch("/api/users/logout/", {
        method: "POST",
        body: { refresh },
      });
    }
  } finally {
    clearTokens();
  }
}

export async function fetchMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/users/profile/");
}

/**
 * Intenta restablecer la sesión leyendo el refresh token de localStorage.
 * Devuelve el usuario si tiene éxito, null si no hay sesión válida.
 */
export async function restoreSession(): Promise<AuthUser | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const r = await fetch("/api/users/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!r.ok) {
      clearTokens();
      return null;
    }
    const data: { access?: string; refresh?: string } = await r.json();
    if (!data.access) return null;
    setAccessToken(data.access);
    if (data.refresh) setRefreshToken(data.refresh);
    return await fetchMe();
  } catch {
    return null;
  }
}
