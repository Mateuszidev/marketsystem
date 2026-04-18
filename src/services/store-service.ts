import { prisma } from "@/lib/prisma";
import { decimalToNumber, toDecimal } from "@/lib/currency";
import type { UpdateStoreSettingsInput } from "@/lib/validations";
import type { AdminStoreSettingsDTO, StoreSettingsDTO } from "@/types/order";

const mapAdminStoreSettings = (settings: {
  id: number;
  storeName: string;
  whatsappNumber: string;
  deliveryFee: unknown;
  minimumOrderValue: unknown;
  acceptsPickup: boolean;
  acceptsDelivery: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminStoreSettingsDTO => ({
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

const toPublicStoreSettings = (settings: AdminStoreSettingsDTO): StoreSettingsDTO => ({
  id: settings.id,
  storeName: settings.storeName,
  deliveryFee: settings.deliveryFee,
  minimumOrderValue: settings.minimumOrderValue,
  acceptsPickup: settings.acceptsPickup,
  acceptsDelivery: settings.acceptsDelivery,
  createdAt: settings.createdAt,
  updatedAt: settings.updatedAt,
});

const defaultAdminSettings: AdminStoreSettingsDTO = {
  id: 1,
  storeName: "CatÃ¡logo de Mercado",
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
  async getPublic() {
    try {
      const settings = await loadStoreSettings();
      const adminSettings = settings ? mapAdminStoreSettings(settings) : defaultAdminSettings;
      return toPublicStoreSettings(adminSettings);
    } catch (error) {
      console.error("Failed to load store settings, using defaults instead.", error);
      return toPublicStoreSettings(defaultAdminSettings);
    }
  },

  async getAdmin() {
    try {
      const settings = await loadStoreSettings();
      return settings ? mapAdminStoreSettings(settings) : defaultAdminSettings;
    } catch (error) {
      console.error("Failed to load admin store settings, using defaults instead.", error);
      return defaultAdminSettings;
    }
  },

  async getOrderSettings() {
    const settings = await loadStoreSettings();
    return settings ? mapAdminStoreSettings(settings) : defaultAdminSettings;
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

    return mapAdminStoreSettings(settings);
  },
};
