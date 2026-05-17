export function formatMXN(n: number | string): string {
  const num = Number(n) || 0;
  return "$" + num.toLocaleString("es-MX");
}
