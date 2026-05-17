import { testimonials as seed } from "../data/testimonials";
function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
export async function fetchTestimonials() {
    // TODO: reemplazar por fetch('/api/testimonials').then(r => r.json())
    await delay(150);
    return seed;
}
