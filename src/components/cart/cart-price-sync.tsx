"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { fetchCartProducts } from "@/lib/cart-prices";

export function CartPriceSync() {
  const pathname = usePathname();
  const hydrated = useCartStore((state) => state.hasHydrated);
  const ids = useCartStore((state) => [...new Set(state.items.map((item) => item.productId))].sort((a, b) => a - b).join(","));
  useEffect(() => {
    if (!hydrated || !ids) return;
    const controller = new AbortController();
    const sync = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const products = await fetchCartProducts(ids.split(",").map(Number), controller.signal);
        if (!controller.signal.aborted) useCartStore.getState().syncProducts(products);
      } catch {
        // Keep saved prices on connection failure; the server validates the final order.
      }
    };
    void sync();
    const interval = window.setInterval(sync, 60_000);
    window.addEventListener("focus", sync);
    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", sync);
    };
  }, [hydrated, ids, pathname]);
  return null;
}
