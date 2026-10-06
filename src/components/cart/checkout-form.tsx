"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrencyBRL } from "@/lib/currency";
import { getErrorMessage } from "@/lib/errors";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations";
import { useCartStore } from "@/store/cart-store";
import { fetchCartProducts } from "@/lib/cart-prices";
import type { FulfillmentType, StoreSettingsDTO } from "@/types/order";

export function CheckoutForm({ settings }: { settings: StoreSettingsDTO }) {
  const { items, subtotal, clearCart, hasHydrated } = useCartStore();
  const [submitError, setSubmitError] = useState("");
  const hasAvailableMethod = settings.acceptsDelivery || settings.acceptsPickup;
  const defaultFulfillmentType: FulfillmentType = settings.acceptsDelivery ? "delivery" : "pickup";
  const estimatedSubtotal = subtotal();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      fulfillmentType: defaultFulfillmentType,
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      customerNeighborhood: "",
      customerReference: "",
      notes: "",
      items: [],
    },
  });

  const fulfillmentType = useWatch({
    control: form.control,
    name: "fulfillmentType",
  });
  const isPickup = fulfillmentType === "pickup";
  const estimatedDeliveryFee = isPickup ? 0 : settings.deliveryFee;
  const estimatedTotal = estimatedSubtotal + estimatedDeliveryFee;

  useEffect(() => {
    form.setValue(
      "items",
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        flavorId: item.flavorId ?? null,
        flavorName: item.flavorName ?? null,
      })),
      {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      },
    );
  }, [form, items]);

  if (!hasHydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">Finalizar pedido</h1>
          <p className="mt-2 text-sm text-[var(--color-soft-text)]">Carregando itens do carrinho...</p>
        </Card>
        <Card className="h-fit">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-soft-text)]">Resumo</p>
          <p className="mt-4 text-sm text-[var(--color-soft-text)]">Sincronizando...</p>
        </Card>
      </div>
    );
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (items.length === 0) {
      setSubmitError("Seu carrinho está vazio.");
      return;
    }

    if (!hasAvailableMethod) {
      setSubmitError("A loja não está aceitando pedidos no momento.");
      return;
    }

    setSubmitError("");

    try {
      const products = await fetchCartProducts(items.map((item) => item.productId));
      const changed = items.some((item) => products.find((product) => product.id === item.productId)?.price !== item.price);
      useCartStore.getState().syncProducts(products);
      if (products.length < new Set(items.map((item) => item.productId)).size || products.some((product) => !product.available)) {
        setSubmitError("Um produto ficou indisponivel. Revise seu carrinho.");
        return;
      }
      if (changed) {
        setSubmitError("Os precos foram atualizados. Confira o novo total e confirme o pedido novamente.");
        return;
      }
    } catch {
      setSubmitError("Nao foi possivel conferir os precos. Tente novamente.");
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          flavorId: item.flavorId ?? null,
          flavorName: item.flavorName ?? null,
        })),
      }),
    });

    if (!response.ok) {
      setSubmitError(await getErrorMessage(response));
      return;
    }

    const payload = (await response.json()) as {
      data: { whatsappUrl: string };
    };

    clearCart();
    window.location.assign(payload.data.whatsappUrl);
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card>
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">Finalizar pedido</h1>
        <p className="mt-1 text-sm text-[var(--color-soft-text)]">Preencha seus dados para gerar o pedido via WhatsApp.</p>

        <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
          <fieldset className="grid gap-4">
            <legend className="mb-3 text-sm font-bold text-[var(--color-text)]">Modalidade de entrega</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                fulfillmentType === "delivery" ? "border-[var(--color-brand)] bg-[rgba(37,99,235,0.04)] text-[var(--color-text)]" : "border-black/6 text-[var(--color-soft-text)]"
              } ${!settings.acceptsDelivery ? "cursor-not-allowed opacity-40" : ""}`}>
                <input type="radio" value="delivery" className="accent-[var(--color-brand)]" disabled={!settings.acceptsDelivery} {...form.register("fulfillmentType")} />
                Entrega
              </label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                fulfillmentType === "pickup" ? "border-[var(--color-brand)] bg-[rgba(37,99,235,0.04)] text-[var(--color-text)]" : "border-black/6 text-[var(--color-soft-text)]"
              } ${!settings.acceptsPickup ? "cursor-not-allowed opacity-40" : ""}`}>
                <input type="radio" value="pickup" className="accent-[var(--color-brand)]" disabled={!settings.acceptsPickup} {...form.register("fulfillmentType")} />
                Retirada
              </label>
            </div>
            {form.formState.errors.fulfillmentType?.message ? (
              <p className="text-sm text-rose-600">{form.formState.errors.fulfillmentType.message}</p>
            ) : null}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Nome</label>
              <Input placeholder="Seu nome completo" {...form.register("customerName")} />
              {form.formState.errors.customerName?.message ? (
                <p className="mt-1 text-xs text-rose-600">{form.formState.errors.customerName.message}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Telefone</label>
              <Input placeholder="(00) 00000-0000" {...form.register("customerPhone")} />
              {form.formState.errors.customerPhone?.message ? (
                <p className="mt-1 text-xs text-rose-600">{form.formState.errors.customerPhone.message}</p>
              ) : null}
            </div>
          </div>

          {isPickup ? (
            <div className="rounded-xl border border-dashed border-[var(--color-brand)]/20 bg-[rgba(37,99,235,0.03)] px-4 py-3 text-sm text-[var(--color-soft-text)]">
              Pedido para retirada não exige endereço. Use a observação para combinar detalhes.
            </div>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Endereço</label>
                <Input placeholder="Rua, número" {...form.register("customerAddress")} />
                {form.formState.errors.customerAddress?.message ? (
                  <p className="mt-1 text-xs text-rose-600">{form.formState.errors.customerAddress.message}</p>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Bairro</label>
                  <Input placeholder="Bairro" {...form.register("customerNeighborhood")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Referência</label>
                  <Input placeholder="Ponto de referência" {...form.register("customerReference")} />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Observação</label>
            <Textarea placeholder="Alguma observação sobre o pedido?" {...form.register("notes")} />
          </div>

          {!hasAvailableMethod ? <p className="text-sm text-rose-600">A loja está com pedidos temporariamente indisponíveis.</p> : null}
          {form.formState.errors.items?.message ? (
            <p className="text-sm text-rose-600">{form.formState.errors.items.message}</p>
          ) : null}
          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

          <Button type="submit" className="mt-1 w-full" disabled={form.formState.isSubmitting || !hasAvailableMethod}>
            {form.formState.isSubmitting ? "Gerando pedido..." : "Gerar pedido e abrir WhatsApp"}
          </Button>
        </form>
      </Card>

      <Card className="h-fit sticky top-24">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-soft-text)]">Resumo do pedido</p>
        <dl className="mt-4 space-y-3 text-sm">
          {items.length > 0 ? (
            <div className="space-y-2 border-b border-black/5 pb-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.flavorId ?? item.flavorName ?? "sem-sabor"}`}>
                  <p className="font-medium text-[var(--color-text)]">
                    {item.quantity}× {item.name}
                  </p>
                  {item.flavorName ? <p className="text-xs text-[var(--color-soft-text)]">Sabor: {item.flavorName}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex items-center justify-between text-[var(--color-soft-text)]">
            <dt>Subtotal</dt>
            <dd className="font-medium">{formatCurrencyBRL(estimatedSubtotal)}</dd>
          </div>
          <div className="flex items-center justify-between text-[var(--color-soft-text)]">
            <dt>{isPickup ? "Retirada" : "Entrega"}</dt>
            <dd className="font-medium">{formatCurrencyBRL(estimatedDeliveryFee)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-black/5 pt-3 text-base font-bold text-[var(--color-text)]">
            <dt>Total</dt>
            <dd>{formatCurrencyBRL(estimatedTotal)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-[var(--color-soft-text)]">Pedido mínimo: {formatCurrencyBRL(settings.minimumOrderValue)}</p>
      </Card>
    </div>
  );
}
