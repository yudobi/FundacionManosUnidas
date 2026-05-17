function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
export async function submitDonation(payload) {
    // TODO: POST /api/donations (Django + Stripe)
    await delay(600);
    return { ok: true, id: `don_${Date.now()}`, ...payload };
}
export async function submitRegistration(payload) {
    // TODO: POST /api/users/register
    await delay(600);
    return { ok: true, id: `usr_${Date.now()}`, ...payload };
}
export async function submitContact(payload) {
    // TODO: POST /api/contact
    await delay(600);
    return { ok: true, id: `msg_${Date.now()}`, ...payload };
}
