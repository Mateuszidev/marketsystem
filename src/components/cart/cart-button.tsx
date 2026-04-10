"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export function CartButton() {
  const count = useCartStore((state) => state.totalItems());

  return (
    <Link
      href="/carrinho"
      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white"
    >
      Carrinho
      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span>
    </Link>
  );
}
