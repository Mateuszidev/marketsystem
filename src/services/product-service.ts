import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { ApiError } from "@/lib/errors";
import { decimalToNumber, toDecimal } from "@/lib/currency";
import type { CreateProductInput, UpdateProductInput } from "@/lib/validations";
import type { ProductFilters, ProductListItem } from "@/types/product";

const productInclude = {
  category: true,
  inventory: true,
} as const;

const mapProduct = (product: {
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
}): ProductListItem => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: decimalToNumber(product.price as never),
  imageUrl: product.imageUrl,
  sku: product.sku,
  active: product.active,
  categoryId: product.categoryId,
  categoryName: product.category.name,
  inventoryQuantity: product.inventory?.quantity ?? 0,
  minQuantity: product.inventory?.minQuantity ?? 0,
  available: (product.inventory?.quantity ?? 0) > 0,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

const ensureUniqueFields = async (slug: string, sku: string, excludeId?: number) => {
  const [bySlug, bySku] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.product.findUnique({ where: { sku } }),
  ]);

  if (bySlug && bySlug.id !== excludeId) {
    throw new ApiError("Já existe um produto com este slug.", 409);
  }

  if (bySku && bySku.id !== excludeId) {
    throw new ApiError("Já existe um produto com este SKU.", 409);
  }
};

export const productService = {
  async list(filters: ProductFilters = {}) {
    const products = await prisma.product.findMany({
      where: {
        active: filters.includeInactive ? undefined : true,
        name: filters.search
          ? {
              contains: filters.search,
              mode: "insensitive",
            }
          : undefined,
        category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
      },
      include: productInclude,
      orderBy: [{ active: "desc" }, { name: "asc" }],
    });

    return products.map(mapProduct);
  },

  async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new ApiError("Produto não encontrado.", 404);
    }

    return mapProduct(product);
  },

  async create(input: CreateProductInput) {
    const slug = slugify(input.slug?.trim() || input.name);
    await ensureUniqueFields(slug, input.sku.trim());

    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });

    if (!category) {
      throw new ApiError("Categoria não encontrada.", 404);
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
      include: productInclude,
    });

    return mapProduct(product);
  },

  async update(id: number, input: UpdateProductInput) {
    await this.getById(id);
    const slug = slugify(input.slug?.trim() || input.name);
    await ensureUniqueFields(slug, input.sku.trim(), id);

    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });

    if (!category) {
      throw new ApiError("Categoria não encontrada.", 404);
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
      include: productInclude,
    });

    return mapProduct(product);
  },

  async deactivate(id: number) {
    await this.getById(id);

    const product = await prisma.product.update({
      where: { id },
      data: { active: false },
      include: productInclude,
    });

    return mapProduct(product);
  },
};
