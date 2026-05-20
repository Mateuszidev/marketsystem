"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/currency";
import { getCartItemKey, useCartStore } from "@/store/cart-store";

export function CartItems() {
  const { items, subtotal, increaseItem, decreaseItem, removeItem, hasHydrated } = useCartStore();
  const total = subtotal();

  if (!hasHydrated) {
    return (
      <Card className="flex flex-col items-center py-12 text-center">
        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-surface-alt)] border-t-[var(--color-brand)]" />
        <h2 className="text-lg font-bold text-[var(--color-text)]">Carregando carrinho...</h2>
        <p className="mt-1 text-sm text-[var(--color-soft-text)]">Sincronizando os itens salvos neste navegador.</p>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--color-muted)]">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[var(--color-text)]">Seu carrinho está vazio</h2>
        <p className="mt-1 text-sm text-[var(--color-soft-text)]">Adicione produtos no catálogo para continuar.</p>
        <Link
          href="/produtos"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_-4px_rgba(249,115,22,0.5)] transition hover:-translate-y-px hover:bg-[var(--color-accent-dark)]"
        >
          Ver produtos
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        {items.map((item) => {
          const itemKey = getCartItemKey(item);

          return (
          <Card key={itemKey} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="bp-cart-product-name text-base font-bold">{item.name}</h3>
              {item.flavorName ? <p className="mt-0.5 text-xs font-medium text-[var(--color-soft-text)]">Sabor: {item.flavorName}</p> : null}
              <p className="bp-cart-product-price mt-1 text-sm">{formatCurrencyBRL(item.price)} /un</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="h-9 w-9 p-0 text-base" onClick={() => decreaseItem(itemKey)}>
                −
              </Button>
              <span className="w-8 text-center text-sm font-bold text-[var(--color-text)]">{item.quantity}</span>
              <Button variant="secondary" className="h-9 w-9 p-0 text-base" onClick={() => increaseItem(itemKey)}>
                +
              </Button>
              <Button variant="ghost" className="ml-2 text-xs text-red-500 hover:bg-red-50" onClick={() => removeItem(itemKey)}>
                Remover
              </Button>
            </div>
          </Card>
          );
        })}
      </div>

      <Card className="h-fit sticky top-24">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-soft-text)]">Resumo</p>
        <p className="bp-cart-total mt-3 text-3xl font-black tracking-tight">{formatCurrencyBRL(total)}</p>
        <p className="mt-2 text-xs text-[var(--color-soft-text)]">O valor final será recalculado antes de gerar o pedido.</p>
        <Link
          href="/finalizar"
          className="bp-cart-checkout-link mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-bold"
        >
          Finalizar pedido
        </Link>
      </Card>
    </div>
  );
}
