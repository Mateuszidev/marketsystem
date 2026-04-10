import { prisma } from "@/lib/prisma";
import { decimalToNumber, toDecimal } from "@/lib/currency";
import type { UpdateStoreSettingsInput } from "@/lib/validations";
import type { StoreSettingsDTO } from "@/types/order";

const mapStoreSettings = (settings: {
  id: number;
  storeName: string;
  whatsappNumber: string;
  deliveryFee: unknown;
  minimumOrderValue: unknown;
  acceptsPickup: boolean;
  acceptsDelivery: boolean;
  createdAt: Date;
  updatedAt: Date;
}): StoreSettingsDTO => ({
  id: settings.id,
  storeName: settings.storeName,
  whatsappNumber: settings.whatsappNumber,
  deliveryFee: decimalToNumber(settings.deliveryFee as never),
  minimumOrderValue: decimalToNumber(settings.minimumOrderValue as never),
  acceptsPickup: settings.acceptsPickup,
  acceptsDelivery: settings.acceptsDelivery,
  createdAt: settings.createdAt.toISOString(),
  updatedAt: settings.updatedAt.toISOString(),
});

const defaultSettings: StoreSettingsDTO = {
  id: 1,
  storeName: "Catálogo de Mercado",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK_NUMBER || "",
  deliveryFee: 0,
  minimumOrderValue: 0,
  acceptsPickup: false,
  acceptsDelivery: true,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

const loadStoreSettings = async () => {
  return prisma.storeSettings.findUnique({ where: { id: 1 } });
};

export const storeService = {
  async get() {
    try {
      const settings = await loadStoreSettings();
      return settings ? mapStoreSettings(settings) : defaultSettings;
    } catch (error) {
      console.error("Failed to load store settings, using defaults instead.", error);
      return defaultSettings;
    }
  },

  async getRequired() {
    const settings = await loadStoreSettings();
    return settings ? mapStoreSettings(settings) : defaultSettings;
  },

  async update(input: UpdateStoreSettingsInput) {
    const settings = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: {
        storeName: input.storeName.trim(),
        whatsappNumber: input.whatsappNumber.trim(),
        deliveryFee: toDecimal(input.deliveryFee),
        minimumOrderValue: toDecimal(input.minimumOrderValue),
        acceptsPickup: input.acceptsPickup,
        acceptsDelivery: input.acceptsDelivery,
      },
      create: {
        id: 1,
        storeName: input.storeName.trim(),
        whatsappNumber: input.whatsappNumber.trim(),
        deliveryFee: toDecimal(input.deliveryFee),
        minimumOrderValue: toDecimal(input.minimumOrderValue),
        acceptsPickup: input.acceptsPickup,
        acceptsDelivery: input.acceptsDelivery,
      },
    });

    return mapStoreSettings(settings);
  },
};
