// Generates human-readable, sortable order numbers like BGS-260824-7F3K
export function generateOrderNumber(): string {
  const date = new Date();
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BGS-${y}${m}${d}-${rand}`;
}
