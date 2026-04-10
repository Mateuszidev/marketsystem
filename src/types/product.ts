export type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sku: string;
  active: boolean;
  categoryId: number;
  categoryName: string;
  inventoryQuantity: number;
  minQuantity: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  includeInactive?: boolean;
};
