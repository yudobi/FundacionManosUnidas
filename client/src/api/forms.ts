import { createPaymentIntent } from "./payments";
import { apiFetch } from "./client";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface DonationPayload {
  amount: number;
  frequency: "Una vez" | "Mensual" | "Anual";
  destino: string;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  /** Acepta IDs legacy (donante/voluntario/familia/aliado) o el nuevo formato del backend (DONANTE/VOLUNTARIO/BENEFICIARIO/ALIADO). */
  role: string;
}

const LEGACY_ROLE_MAP: Record<string, string> = {
  donante: "DONANTE",
  voluntario: "VOLUNTARIO",
  familia: "BENEFICIARIO",
  beneficiario: "BENEFICIARIO",
  aliado: "ALIADO",
  admin: "ADMIN",
};

function normalizeRole(role: string): string {
  const key = (role || "").trim().toLowerCase();
  return LEGACY_ROLE_MAP[key] ?? role.toUpperCase();
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitDonation(payload: DonationPayload) {
  // Llama al backend que crea PaymentIntent (modo demo si STRIPE_SECRET_KEY vacío).
  const result = await createPaymentIntent({
    amount: payload.amount,
    frequency: payload.frequency,
    destination: payload.destino,
  });
  return {
    ok: true,
    id: `don_${result.donation_id}`,
    mode: result.mode,
    client_secret: result.client_secret,
    publishable_key: result.publishable_key,
    detail: result.detail,
    ...payload,
  };
}

export async function submitRegistration(payload: RegistrationPayload) {
  // Registro real de usuario público (no admin). Apunta a la app `users`.
  const [first_name, ...rest] = payload.name.trim().split(/\s+/);
  const last_name = rest.join(" ");
  // El backend requiere password + password2 (con validador de coincidencia).
  const password = `auto-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    const user = await apiFetch<{ user: { id: number } }>(
      "/api/users/register/",
      {
        method: "POST",
        body: {
          email: payload.email,
          username: payload.email.split("@")[0] || payload.email,
          first_name: first_name || payload.name,
          last_name,
          password,
          password2: password,
          role: normalizeRole(payload.role),
        },
      },
    );
    return { ok: true, id: `usr_${user.user?.id ?? Date.now()}`, ...payload };
  } catch {
    // Fallback demo si el backend no está disponible
    await delay(400);
    return { ok: true, id: `usr_demo_${Date.now()}`, ...payload };
  }
}

export async function submitContact(payload: ContactPayload) {
  // TODO: backend endpoint /api/contact (Entrega futura)
  await delay(600);
  return { ok: true, id: `msg_${Date.now()}`, ...payload };
}
