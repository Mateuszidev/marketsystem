import type { PublicProductListItem } from "@/types/product";

export async function fetchCartProducts(ids: number[], signal?: AbortSignal) {
  const uniqueIds = [...new Set(ids)];
  const products: PublicProductListItem[] = [];
  for (let offset = 0; offset < uniqueIds.length; offset += 100) {
    const response = await fetch(`/api/products?ids=${uniqueIds.slice(offset, offset + 100).join(",")}&limit=100`, { cache: "no-store", signal });
    if (!response.ok) throw new Error("Nao foi possivel atualizar os precos. Tente novamente.");
    const result = await response.json();
    products.push(...result.data);
  }
  return products;
}
