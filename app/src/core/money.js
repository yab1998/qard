// All money is integer cents. No floats ever reach the ledger.
export const isCents = (n) => Number.isInteger(n);
export const sum = (xs) => xs.reduce((a, b) => a + b, 0);
export function fmt(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100).toLocaleString('en-US');
  const c = String(abs % 100).padStart(2, '0');
  return `${sign}$${dollars}.${c}`;
}
