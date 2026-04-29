import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [graos, bebidas, limpeza] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "graos-e-massas" },
      update: { name: "Grãos e Massas" },
      create: { name: "Grãos e Massas", slug: "graos-e-massas" },
    }),
    prisma.category.upsert({
      where: { slug: "bebidas" },
      update: { name: "Bebidas" },
      create: { name: "Bebidas", slug: "bebidas" },
    }),
    prisma.category.upsert({
      where: { slug: "limpeza" },
      update: { name: "Limpeza" },
      create: { name: "Limpeza", slug: "limpeza" },
    }),
  ]);

  const products = [
    {
      name: "Arroz Tipo 1 5kg",
      slug: "arroz-tipo-1-5kg",
      description: "Pacote de arroz branco tipo 1.",
      price: "24.90",
      imageUrl:
        "https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=900&q=80",
      sku: "ARROZ-5KG",
      categoryId: graos.id,
      quantity: 18,
      minQuantity: 5,
      flavors: [],
    },
    {
      name: "Feijão Carioca 1kg",
      slug: "feijao-carioca-1kg",
      description: "Feijão carioca selecionado.",
      price: "8.50",
      imageUrl:
        "https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=900&q=80",
      sku: "FEIJAO-1KG",
      categoryId: graos.id,
      quantity: 24,
      minQuantity: 8,
      flavors: [],
    },
    {
      name: "Refrigerante Cola 2L",
      slug: "refrigerante-cola-2l",
      description: "Bebida gaseificada 2 litros.",
      price: "9.99",
      imageUrl:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
      sku: "COLA-2L",
      categoryId: bebidas.id,
      quantity: 12,
      minQuantity: 4,
      flavors: ["Cola", "Guarana", "Laranja"],
    },
    {
      name: "Detergente Neutro 500ml",
      slug: "detergente-neutro-500ml",
      description: "Detergente líquido multiuso.",
      price: "3.75",
      imageUrl:
        "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=900&q=80",
      sku: "DETERGENTE-500",
      categoryId: limpeza.id,
      quantity: 7,
      minQuantity: 10,
      flavors: ["Neutro", "Limao"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        active: true,
        inventory: {
          upsert: {
            update: {
              quantity: product.quantity,
              minQuantity: product.minQuantity,
            },
            create: {
              quantity: product.quantity,
              minQuantity: product.minQuantity,
            },
          },
        },
        flavors: product.flavors
          ? {
              deleteMany: {},
              create: product.flavors.map((name) => ({
                name,
                active: true,
              })),
            }
          : undefined,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        sku: product.sku,
        categoryId: product.categoryId,
        active: true,
        inventory: {
          create: {
            quantity: product.quantity,
            minQuantity: product.minQuantity,
          },
        },
        flavors: product.flavors
          ? {
              create: product.flavors.map((name) => ({
                name,
                active: true,
              })),
            }
          : undefined,
      },
    });
  }

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      storeName: "Mercado Fácil",
      whatsappNumber: "5511999999999",
      deliveryFee: "5.00",
      minimumOrderValue: "20.00",
      acceptsPickup: true,
      acceptsDelivery: true,
    },
    create: {
      id: 1,
      storeName: "Mercado Fácil",
      whatsappNumber: "5511999999999",
      deliveryFee: "5.00",
      minimumOrderValue: "20.00",
      acceptsPickup: true,
      acceptsDelivery: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
