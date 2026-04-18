import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { ApiError } from "@/lib/errors";
import { decimalToNumber, toDecimal } from "@/lib/currency";
import type { CreateProductInput, UpdateProductInput } from "@/lib/validations";
import type { AdminProductListItem, ProductFilters, PublicProductListItem } from "@/types/product";

const publicProductSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  imageUrl: true,
  categoryId: true,
  category: {
    select: {
      name: true,
    },
  },
  inventory: {
    select: {
      quantity: true,
    },
  },
} as const;

const adminProductInclude = {
  category: true,
  inventory: true,
} as const;

const mapPublicProduct = (product: {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: unknown;
  imageUrl: string | null;
  categoryId: number;
  category: { name: string };
  inventory: { quantity: number } | null;
}): PublicProductListItem => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: decimalToNumber(product.price as never),
  imageUrl: product.imageUrl,
  categoryId: product.categoryId,
  categoryName: product.category.name,
  available: (product.inventory?.quantity ?? 0) > 0,
});

const mapAdminProduct = (product: {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: unknown;
  imageUrl: string | null;
  sku: string;
  active: boolean;
  categoryId: number;
  category: { name: string };
  inventory: { quantity: number; minQuantity: number } | null;
  createdAt: Date;
  updatedAt: Date;
}): AdminProductListItem => ({
  ...mapPublicProduct(product),
  sku: product.sku,
  active: product.active,
  inventoryQuantity: product.inventory?.quantity ?? 0,
  minQuantity: product.inventory?.minQuantity ?? 0,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

const buildWhere = (filters: ProductFilters) => ({
  active: filters.includeInactive ? undefined : true,
  name: filters.search
    ? {
        contains: filters.search,
        mode: "insensitive" as const,
      }
    : undefined,
  category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
});

const ensureUniqueFields = async (slug: string, sku: string, excludeId?: number) => {
  const [bySlug, bySku] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.product.findUnique({ where: { sku } }),
  ]);

  if (bySlug && bySlug.id !== excludeId) {
    throw new ApiError("JÃ¡ existe um produto com este slug.", 409);
  }

  if (bySku && bySku.id !== excludeId) {
    throw new ApiError("JÃ¡ existe um produto com este SKU.", 409);
  }
};

export const productService = {
  async listPublic(filters: ProductFilters = {}) {
    const products = await prisma.product.findMany({
      where: buildWhere(filters),
      select: publicProductSelect,
      orderBy: { name: "asc" },
    });

    return products.map(mapPublicProduct);
  },

  async listAdmin(filters: ProductFilters = {}) {
    const products = await prisma.product.findMany({
      where: buildWhere(filters),
      include: adminProductInclude,
      orderBy: [{ active: "desc" }, { name: "asc" }],
    });

    return products.map(mapAdminProduct);
  },

  async getAdminById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: adminProductInclude,
    });

    if (!product) {
      throw new ApiError("Produto nÃ£o encontrado.", 404);
    }

    return mapAdminProduct(product);
  },

  async create(input: CreateProductInput) {
    const slug = slugify(input.slug?.trim() || input.name);
    await ensureUniqueFields(slug, input.sku.trim());

    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });

    if (!category) {
      throw new ApiError("Categoria nÃ£o encontrada.", 404);
    }

    const product = await prisma.product.create({
      data: {
        name: input.name.trim(),
        slug,
        description: input.description?.trim() || null,
        price: toDecimal(input.price),
        imageUrl: input.imageUrl?.trim() || null,
        sku: input.sku.trim(),
        active: input.active,
        categoryId: input.categoryId,
        inventory: {
          create: {
            quantity: input.quantity,
            minQuantity: input.minQuantity,
          },
        },
      },
      include: adminProductInclude,
    });

    return mapAdminProduct(product);
  },

  async update(id: number, input: UpdateProductInput) {
    await this.getAdminById(id);
    const slug = slugify(input.slug?.trim() || input.name);
    await ensureUniqueFields(slug, input.sku.trim(), id);

    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });

    if (!category) {
      throw new ApiError("Categoria nÃ£o encontrada.", 404);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: input.name.trim(),
        slug,
        description: input.description?.trim() || null,
        price: toDecimal(input.price),
        imageUrl: input.imageUrl?.trim() || null,
        sku: input.sku.trim(),
        active: input.active,
        categoryId: input.categoryId,
        inventory: {
          upsert: {
            update: {
              quantity: input.quantity,
              minQuantity: input.minQuantity,
            },
            create: {
              quantity: input.quantity,
              minQuantity: input.minQuantity,
            },
          },
        },
      },
      include: adminProductInclude,
    });

    return mapAdminProduct(product);
  },

  async deactivate(id: number) {
    await this.getAdminById(id);

    const product = await prisma.product.update({
      where: { id },
      data: { active: false },
      include: adminProductInclude,
    });

    return mapAdminProduct(product);
  },
};
