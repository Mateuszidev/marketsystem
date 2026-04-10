import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors";
import type { UpdateInventoryInput } from "@/lib/validations";

export const inventoryService = {
  async getByProductId(productId: number) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new ApiError("Estoque não encontrado para este produto.", 404);
    }

    return inventory;
  },

  async update(productId: number, input: UpdateInventoryInput) {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new ApiError("Produto não encontrado.", 404);
    }

    return prisma.inventory.upsert({
      where: { productId },
      update: {
        quantity: input.quantity,
        minQuantity: input.minQuantity,
      },
      create: {
        productId,
        quantity: input.quantity,
        minQuantity: input.minQuantity,
      },
    });
  },
};
