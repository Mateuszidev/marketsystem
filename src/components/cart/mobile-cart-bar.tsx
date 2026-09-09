"use client";

import Link from "next/link";
import { formatCurrencyBRL } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";

export function MobileCartBar() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const itemCount = useCartStore((state) => state.totalItems());
  const subtotal = useCartStore((state) => state.subtotal());

  if (!hasHydrated || itemCount === 0) {
    return null;
  }

  return (
    <Link href="/carrinho" className="bp-mobile-cart-bar" aria-label="Abrir carrinho">
      <span className="bp-mobile-cart-bar-info">
        <span className="bp-mobile-cart-bar-label">
          Carrinho
          <span className="bp-mobile-cart-bar-count">{itemCount}</span>
        </span>
        <span className="bp-mobile-cart-bar-total">{formatCurrencyBRL(subtotal)}</span>
      </span>
      <span className="bp-mobile-cart-bar-action">Ver pedido</span>
    </Link>
  );
}
