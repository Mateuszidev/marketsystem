export function discountPercentage(price: number, originalPrice: number | null | undefined) {
  if (!originalPrice || price <= 0 || price >= originalPrice) return null;
  const originalCents = Math.round(originalPrice * 100);
  const priceCents = Math.round(price * 100);
  return Math.floor(((originalCents - priceCents) * 100) / originalCents);
}
