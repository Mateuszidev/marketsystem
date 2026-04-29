"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductFlavorDTO, PublicProductListItem } from "@/types/product";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  available: boolean;
  flavorId?: number | null;
  flavorName?: string | null;
};

export const getCartItemKey = (item: Pick<CartItem, "productId" | "flavorId" | "flavorName">) =>
  `${item.productId}:${item.flavorId ?? item.flavorName ?? "sem-sabor"}`;

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (product: PublicProductListItem, flavor?: ProductFlavorDTO | null) => void;
  increaseItem: (itemKey: string) => void;
  decreaseItem: (itemKey: string) => void;
  removeItem: (itemKey: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addItem: (product, flavor = null) =>
        set((state) => {
          const nextItemKey = getCartItemKey({
            productId: product.id,
            flavorId: flavor?.id ?? null,
            flavorName: flavor?.name ?? null,
          });
          const existing = state.items.find((item) => getCartItemKey(item) === nextItemKey);

          if (existing) {
            return {
              items: state.items.map((item) =>
                getCartItemKey(item) === nextItemKey ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1,
                available: product.available,
                flavorId: flavor?.id ?? null,
                flavorName: flavor?.name ?? null,
              },
            ],
          };
        }),
      increaseItem: (itemKey) =>
        set((state) => ({
          items: state.items.map((item) =>
            getCartItemKey(item) === itemKey ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),
      decreaseItem: (itemKey) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              getCartItemKey(item) === itemKey ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      removeItem: (itemKey) =>
        set((state) => ({
          items: state.items.filter((item) => getCartItemKey(item) !== itemKey),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "market-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
