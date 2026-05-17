import { projects as seed } from "../data/projects";
function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
export async function fetchProjects() {
    // TODO: reemplazar por fetch('/api/projects').then(r => r.json())
    await delay(150);
    return seed;
}
export async function fetchProject(id) {
    // TODO: fetch(`/api/projects/${id}`)
    await delay(150);
    return seed.find((p) => p.id === id) ?? null;
}
