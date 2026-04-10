import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import type { CategoryListItem } from "@/types/category";

const mapCategory = (category: {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
}): CategoryListItem => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  productCount: category._count?.products ?? 0,
  createdAt: category.createdAt.toISOString(),
  updatedAt: category.updatedAt.toISOString(),
});

const ensureUniqueSlug = async (slug: string, excludeId?: number) => {
  const existing = await prisma.category.findUnique({ where: { slug } });

  if (existing && existing.id !== excludeId) {
    throw new ApiError("Já existe uma categoria com este slug.", 409);
  }
};

export const categoryService = {
  async list() {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });

    return categories.map(mapCategory);
  },

  async getById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new ApiError("Categoria não encontrada.", 404);
    }

    return mapCategory(category);
  },

  async getBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },

  async create(input: CreateCategoryInput) {
    const slug = slugify(input.slug?.trim() || input.name);
    await ensureUniqueSlug(slug);

    const category = await prisma.category.create({
      data: {
        name: input.name.trim(),
        slug,
      },
      include: { _count: { select: { products: true } } },
    });

    return mapCategory(category);
  },

  async update(id: number, input: UpdateCategoryInput) {
    await this.getById(id);
    const slug = slugify(input.slug?.trim() || input.name);
    await ensureUniqueSlug(slug, id);

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: input.name.trim(),
        slug,
      },
      include: { _count: { select: { products: true } } },
    });

    return mapCategory(category);
  },

  async remove(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new ApiError("Categoria não encontrada.", 404);
    }

    if (category._count.products > 0) {
      throw new ApiError("Não é possível remover a categoria porque há produtos vinculados.", 409);
    }

    await prisma.category.delete({ where: { id } });
  },
};
