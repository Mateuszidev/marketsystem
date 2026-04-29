import { z } from "zod";

const trimmedString = (label: string, min = 2) =>
  z
    .string()
    .trim()
    .min(min, `${label} e obrigatorio.`)
    .max(255, `${label} e muito longo.`);

const decimalNumber = (label: string) =>
  z.number({ error: `${label} e obrigatorio.` }).min(0, `${label} nao pode ser negativo.`);

const productFlavorSchema = z.object({
  id: z.number().int().positive().optional(),
  name: trimmedString("Sabor", 1),
  active: z.boolean(),
});

export const createCategorySchema = z.object({
  name: trimmedString("Nome"),
  slug: z.string().trim().optional(),
});

export const updateCategorySchema = createCategorySchema;

export const createProductSchema = z
  .object({
    name: trimmedString("Nome"),
    slug: z.string().trim().optional(),
    description: z.string().trim().max(1000, "Descricao muito longa.").optional().or(z.literal("")),
    price: decimalNumber("Preco"),
    imageUrl: z.string().trim().url("Informe uma URL valida para a imagem.").optional().or(z.literal("")),
    sku: trimmedString("SKU", 1),
    active: z.boolean(),
    categoryId: z.number().int().positive("Categoria e obrigatoria."),
    quantity: z.number().int().min(0, "Estoque nao pode ser negativo."),
    minQuantity: z.number().int().min(0, "Estoque minimo nao pode ser negativo."),
    flavors: z.array(productFlavorSchema),
  })
  .superRefine((values, context) => {
    const flavorNames = new Set<string>();

    values.flavors.forEach((flavor, index) => {
      const normalized = flavor.name.trim().toLowerCase();

      if (flavorNames.has(normalized)) {
        context.addIssue({
          code: "custom",
          path: ["flavors", index, "name"],
          message: "Este sabor ja foi cadastrado para o produto.",
        });
      }

      flavorNames.add(normalized);
    });
  });

export const updateProductSchema = createProductSchema;

export const updateInventorySchema = z.object({
  quantity: z.number().int().min(0, "Estoque nao pode ser negativo."),
  minQuantity: z.number().int().min(0, "Estoque minimo nao pode ser negativo."),
});

export const createOrderSchema = z
  .object({
    fulfillmentType: z.enum(["delivery", "pickup"], {
      error: "Tipo de pedido invalido.",
    }),
    customerName: trimmedString("Nome"),
    customerPhone: trimmedString("Telefone", 8),
    customerAddress: z.string().trim().max(255).optional().or(z.literal("")),
    customerNeighborhood: z.string().trim().max(120).optional().or(z.literal("")),
    customerReference: z.string().trim().max(255).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
    items: z
      .array(
        z.object({
          productId: z.number().int().positive("Produto invalido."),
          flavorId: z.number().int().positive("Sabor invalido.").optional().nullable(),
          flavorName: z.string().trim().max(255, "Sabor muito longo.").optional().nullable(),
          quantity: z.number().int().min(1, "Quantidade minima por item e 1."),
        }),
      )
      .min(1, "Adicione ao menos um item ao carrinho."),
  })
  .superRefine((values, context) => {
    if (values.fulfillmentType === "delivery" && (values.customerAddress?.length ?? 0) < 5) {
      context.addIssue({
        code: "custom",
        path: ["customerAddress"],
        message: "Endereco e obrigatorio para entrega.",
      });
    }
  });

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "delivered"], {
    error: "Status invalido.",
  }),
});

export const updateStoreSettingsSchema = z
  .object({
    storeName: trimmedString("Nome da loja"),
    whatsappNumber: trimmedString("WhatsApp", 10),
    deliveryFee: decimalNumber("Taxa de entrega"),
    minimumOrderValue: decimalNumber("Pedido minimo"),
    acceptsPickup: z.boolean(),
    acceptsDelivery: z.boolean(),
  })
  .refine((values) => values.acceptsPickup || values.acceptsDelivery, {
    message: "Selecione ao menos uma modalidade de atendimento.",
    path: ["acceptsDelivery"],
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;
