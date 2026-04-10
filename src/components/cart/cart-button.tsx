"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export function CartButton() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const count = useCartStore((state) => state.totalItems());
  const displayCount = hasHydrated ? count : 0;

  return (
    <Link href="/carrinho" className="bp-cart-button">
      Carrinho
      <span className="bp-cart-count">{displayCount}</span>
    </Link>
  );
}
