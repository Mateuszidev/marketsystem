import { FulfillmentType, OrderStatus, Prisma } from "@prisma/client";
import { ApiError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, toDecimal } from "@/lib/currency";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import type { CreateOrderInput, UpdateOrderStatusInput } from "@/lib/validations";
import type { OrderDetail, OrderItemSnapshotForMessage, OrderSummary } from "@/types/order";
import { storeService } from "@/services/store-service";

const mapOrderSummary = (order: {
  id: number;
  fulfillmentType: FulfillmentType;
  customerName: string;
  customerPhone: string;
  subtotal: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  total: Prisma.Decimal;
  status: OrderStatus;
  createdAt: Date;
  items: Array<{ quantity: number }>;
}): OrderSummary => ({
  id: order.id,
  fulfillmentType: order.fulfillmentType,
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  subtotal: order.subtotal.toNumber(),
  deliveryFee: order.deliveryFee.toNumber(),
  total: order.total.toNumber(),
  status: order.status,
  createdAt: order.createdAt.toISOString(),
  itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
});

const mapOrderDetail = (order: {
  id: number;
  fulfillmentType: FulfillmentType;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  customerNeighborhood: string | null;
  customerReference: string | null;
  notes: string | null;
  subtotal: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  total: Prisma.Decimal;
  status: OrderStatus;
  whatsappMessage: string;
  createdAt: Date;
  items: Array<{
    productId: number;
    productNameSnapshot: string;
    unitPriceSnapshot: Prisma.Decimal;
    quantity: number;
    subtotal: Prisma.Decimal;
  }>;
}): OrderDetail => ({
  id: order.id,
  fulfillmentType: order.fulfillmentType,
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  customerAddress: order.customerAddress,
  customerNeighborhood: order.customerNeighborhood,
  customerReference: order.customerReference,
  notes: order.notes,
  subtotal: order.subtotal.toNumber(),
  deliveryFee: order.deliveryFee.toNumber(),
  total: order.total.toNumber(),
  status: order.status,
  whatsappMessage: order.whatsappMessage,
  createdAt: order.createdAt.toISOString(),
  itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  items: order.items.map((item) => ({
    productId: item.productId,
    productName: item.productNameSnapshot,
    unitPrice: item.unitPriceSnapshot.toNumber(),
    quantity: item.quantity,
    subtotal: item.subtotal.toNumber(),
  })),
});

const normalizePhone = (value: string) => value.replace(/\D/g, "");

const groupOrderItems = (items: CreateOrderInput["items"]) => {
  const groupedItems = new Map<number, number>();

  for (const item of items) {
    groupedItems.set(item.productId, (groupedItems.get(item.productId) ?? 0) + item.quantity);
  }

  return [...groupedItems.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

export const orderService = {
  async list(status?: OrderStatus) {
    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: {
          select: { quantity: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map(mapOrderSummary);
  },

  async getById(id: number) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      throw new ApiError("Pedido nÃ£o encontrado.", 404);
    }

    return mapOrderDetail(order);
  },

  async create(input: CreateOrderInput) {
    const groupedItems = groupOrderItems(input.items);
    const uniqueIds = groupedItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: uniqueIds } },
      include: {
        inventory: true,
      },
    });

    if (products.length !== uniqueIds.length) {
      throw new ApiError("Um ou mais produtos nÃ£o existem.", 404);
    }

    const productsById = new Map(products.map((product) => [product.id, product]));

    const normalizedItems: OrderItemSnapshotForMessage[] = groupedItems.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new ApiError("Produto invÃ¡lido no pedido.", 404);
      }

      if (!product.active) {
        throw new ApiError(`O produto "${product.name}" nÃ£o estÃ¡ disponÃ­vel no momento.`, 409);
      }

      const quantity = product.inventory?.quantity ?? 0;

      if (quantity < item.quantity) {
        throw new ApiError(`Estoque insuficiente para "${product.name}".`, 409);
      }

      const unitPrice = decimalToNumber(product.price);

      return {
        productId: product.id,
        productName: product.name,
        unitPrice,
        quantity: item.quantity,
        subtotal: unitPrice * item.quantity,
      };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const settings = await storeService.getOrderSettings();

    if (input.fulfillmentType === "delivery" && !settings.acceptsDelivery) {
      throw new ApiError("A loja nÃ£o estÃ¡ recebendo pedidos para entrega no momento.", 409);
    }

    if (input.fulfillmentType === "pickup" && !settings.acceptsPickup) {
      throw new ApiError("A loja nÃ£o estÃ¡ aceitando pedidos para retirada no momento.", 409);
    }

    if (subtotal < settings.minimumOrderValue) {
      throw new ApiError(
        `O pedido mÃ­nimo Ã© ${Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(settings.minimumOrderValue)}.`,
        409,
      );
    }

    const deliveryFee = input.fulfillmentType === "pickup" ? 0 : settings.deliveryFee;
    const total = subtotal + deliveryFee;
    const customer = {
      fulfillmentType: input.fulfillmentType,
      customerName: input.customerName.trim(),
      customerPhone: normalizePhone(input.customerPhone),
      customerAddress: input.customerAddress?.trim() || "",
      customerNeighborhood: input.customerNeighborhood?.trim() || "",
      customerReference: input.customerReference?.trim() || "",
      notes: input.notes?.trim() || "",
    };

    if (input.fulfillmentType === "delivery" && customer.customerAddress.length < 5) {
      throw new ApiError("Informe um endereÃ§o vÃ¡lido para entrega.", 409);
    }

    const message = buildWhatsappMessage({
      customer,
      items: normalizedItems,
      subtotal,
      deliveryFee,
      total,
    });

    const whatsappNumber =
      settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK_NUMBER || "";

    if (!whatsappNumber) {
      throw new ApiError("O nÃºmero de WhatsApp da loja ainda nÃ£o foi configurado.", 409);
    }

    const order = await prisma.$transaction(async (tx) => {
      for (const item of normalizedItems) {
        const reservedInventory = await tx.inventory.updateMany({
          where: {
            productId: item.productId,
            quantity: {
              gte: item.quantity,
            },
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        if (reservedInventory.count !== 1) {
          throw new ApiError(`Estoque insuficiente para "${item.productName}".`, 409);
        }
      }

      return tx.order.create({
        data: {
          fulfillmentType: customer.fulfillmentType,
          customerName: customer.customerName,
          customerPhone: customer.customerPhone,
          customerAddress: customer.fulfillmentType === "pickup" ? null : customer.customerAddress,
          customerNeighborhood:
            customer.fulfillmentType === "pickup" ? null : customer.customerNeighborhood || null,
          customerReference:
            customer.fulfillmentType === "pickup" ? null : customer.customerReference || null,
          notes: customer.notes || null,
          subtotal: toDecimal(subtotal.toFixed(2)),
          deliveryFee: toDecimal(deliveryFee.toFixed(2)),
          total: toDecimal(total.toFixed(2)),
          status: "pending",
          whatsappMessage: message,
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.productId,
              productNameSnapshot: item.productName,
              unitPriceSnapshot: toDecimal(item.unitPrice.toFixed(2)),
              quantity: item.quantity,
              subtotal: toDecimal(item.subtotal.toFixed(2)),
            })),
          },
        },
      });
    });

    return {
      orderId: order.id,
      total,
      message,
      whatsappUrl: buildWhatsappUrl(whatsappNumber, message),
    };
  },

  async updateStatus(id: number, input: UpdateOrderStatusInput) {
    await this.getById(id);

    const order = await prisma.order.update({
      where: { id },
      data: { status: input.status },
      include: {
        items: {
          select: { quantity: true },
        },
      },
    });

    return mapOrderSummary(order);
  },

  async getDashboardStats() {
    try {
      const [totalOrders, pendingOrders, activeProducts, lowStockProducts] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "pending" } }),
        prisma.product.count({ where: { active: true } }),
        prisma.product.count({
          where: {
            active: true,
            inventory: {
              is: {
                quantity: {
                  lte: 5,
                },
              },
            },
          },
        }),
      ]);

      return {
        totalOrders,
        pendingOrders,
        activeProducts,
        lowStockProducts,
      };
    } catch (error) {
      console.error("Failed to load admin dashboard stats, using safe fallback values instead.", error);

      return {
        totalOrders: 0,
        pendingOrders: 0,
        activeProducts: 0,
        lowStockProducts: 0,
      };
    }
  },
};
