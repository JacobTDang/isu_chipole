export function newBagItemId(): string {
  return crypto.randomUUID();
}

export function newOrderId(): string {
  return `PP-${Math.floor(Math.random() * 10_000).toString().padStart(4, "0")}`;
}
