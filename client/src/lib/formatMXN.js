export function formatMXN(n) {
    const num = Number(n) || 0;
    return "$" + num.toLocaleString("es-MX");
}
