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
          className="bp-cart-checkout-link mt-6 inline-flex rounded-2xl px-4 py-2 text-sm font-semibold"
        >
          Ver produtos
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        {items.map((item) => {
          const itemKey = getCartItemKey(item);

          return (
          <Card key={itemKey} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="bp-cart-product-name text-lg font-semibold">{item.name}</h3>
              {item.flavorName ? <p className="text-sm font-medium text-stone-600">Sabor: {item.flavorName}</p> : null}
              <p className="bp-cart-product-price text-sm">{formatCurrencyBRL(item.price)} por unidade</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => decreaseItem(itemKey)}>
                -
              </Button>
              <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
              <Button variant="secondary" onClick={() => increaseItem(itemKey)}>
                +
              </Button>
              <Button variant="ghost" onClick={() => removeItem(itemKey)}>
                Remover
              </Button>
            </div>
          </Card>
          );
        })}
      </div>
      <Card className="h-fit">
        <p className="text-sm text-stone-500">Subtotal estimado</p>
        <p className="bp-cart-total mt-2 text-3xl font-black tracking-tight">{formatCurrencyBRL(total)}</p>
        <p className="mt-3 text-sm text-stone-500">O valor final será recalculado no backend antes de gerar o pedido.</p>
        <Link
          href="/finalizar"
          className="bp-cart-checkout-link mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold"
        >
          Ir para finalização
        </Link>
      </Card>
    </div>
  );
}
