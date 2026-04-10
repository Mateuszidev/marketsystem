"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";

export function CartItems() {
  const { items, subtotal, increaseItem, decreaseItem, removeItem, hasHydrated } = useCartStore();
  const total = subtotal();

  if (!hasHydrated) {
    return (
      <Card className="text-center">
        <h2 className="text-xl font-semibold">Carregando carrinho...</h2>
        <p className="mt-2 text-sm text-stone-600">Estamos sincronizando os itens salvos neste navegador.</p>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <h2 className="text-xl font-semibold">Seu carrinho está vazio.</h2>
        <p className="mt-2 text-sm text-stone-600">Adicione produtos no catálogo para continuar.</p>
        <Link
          href="/produtos"
          className="mt-6 inline-flex rounded-2xl bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white"
        >
          Ver produtos
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.productId} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{item.name}</h3>
              <p className="text-sm text-stone-500">{formatCurrencyBRL(item.price)} por unidade</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => decreaseItem(item.productId)}>
                -
              </Button>
              <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
              <Button variant="secondary" onClick={() => increaseItem(item.productId)}>
                +
              </Button>
              <Button variant="ghost" onClick={() => removeItem(item.productId)}>
                Remover
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit">
        <p className="text-sm text-stone-500">Subtotal estimado</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text)]">{formatCurrencyBRL(total)}</p>
        <p className="mt-3 text-sm text-stone-500">O valor final será recalculado no backend antes de gerar o pedido.</p>
        <Link
          href="/finalizar"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white"
        >
          Ir para finalização
        </Link>
      </Card>
    </div>
  );
}
