export type PublicProductListItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categoryId: number;
  categoryName: string;
  available: boolean;
};

export type AdminProductListItem = PublicProductListItem & {
  sku: string;
  active: boolean;
  inventoryQuantity: number;
  minQuantity: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  includeInactive?: boolean;
};
