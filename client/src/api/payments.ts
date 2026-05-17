import { apiFetch } from "./client";

export interface DonationPayload {
  amount: number;
  frequency: "Una vez" | "Mensual" | "Anual";
  destination?: string;
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  donor_rfc?: string;
}

export interface PaymentIntentResponse {
  mode: "live" | "demo";
  donation_id: number;
  client_secret: string;
  publishable_key: string;
  detail?: string;
}

export async function createPaymentIntent(
  payload: DonationPayload,
): Promise<PaymentIntentResponse> {
  return apiFetch<PaymentIntentResponse>("/api/payments/create-intent/", {
    method: "POST",
    body: payload,
  });
}
