export function formatNumber(value) {
  if (Math.abs(value) < 1e-10) return '0';
  return Number.isInteger(value) ? String(value) : Number(value.toFixed(4)).toString();
}
