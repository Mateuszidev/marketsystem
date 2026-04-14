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
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)]">Finalizar pedido</h1>
          <p className="mt-2 text-sm text-stone-600">Carregando os itens salvos no carrinho para montar o resumo do pedido.</p>
        </Card>

        <Card className="h-fit">
          <p className="text-sm text-stone-500">Resumo estimado</p>
          <p className="mt-4 text-sm text-stone-600">Sincronizando carrinho...</p>
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
        <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)]">Finalizar pedido</h1>
        <p className="mt-2 text-sm text-stone-600">Preencha os dados e o sistema vai gerar o pedido no banco antes do redirecionamento.</p>

        <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
          <div>
            <span className="mb-2 block text-sm font-medium">Modalidade</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`rounded-2xl border px-4 py-3 text-sm ${settings.acceptsDelivery ? "border-black/10" : "cursor-not-allowed border-black/5 opacity-50"}`}>
                <input type="radio" value="delivery" className="mr-2" disabled={!settings.acceptsDelivery} {...form.register("fulfillmentType")} />
                Entrega
              </label>
              <label className={`rounded-2xl border px-4 py-3 text-sm ${settings.acceptsPickup ? "border-black/10" : "cursor-not-allowed border-black/5 opacity-50"}`}>
                <input type="radio" value="pickup" className="mr-2" disabled={!settings.acceptsPickup} {...form.register("fulfillmentType")} />
                Retirada
              </label>
            </div>
            <p className="mt-1 text-sm text-rose-600">{form.formState.errors.fulfillmentType?.message}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Nome</label>
            <Input {...form.register("customerName")} />
            <p className="mt-1 text-sm text-rose-600">{form.formState.errors.customerName?.message}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Telefone</label>
            <Input {...form.register("customerPhone")} />
            <p className="mt-1 text-sm text-rose-600">{form.formState.errors.customerPhone?.message}</p>
          </div>

          {isPickup ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-stone-50 px-4 py-3 text-sm text-stone-600">
              Pedido para retirada não exige endereço. Se quiser, use a observação para combinar detalhes com a loja.
            </div>
          ) : (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">Endereço</label>
                <Input {...form.register("customerAddress")} />
                <p className="mt-1 text-sm text-rose-600">{form.formState.errors.customerAddress?.message}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Bairro</label>
                  <Input {...form.register("customerNeighborhood")} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Referência</label>
                  <Input {...form.register("customerReference")} />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">Observação</label>
            <Textarea {...form.register("notes")} />
          </div>

          {!hasAvailableMethod ? <p className="text-sm text-rose-600">A loja está com pedidos temporariamente indisponíveis.</p> : null}
          {form.formState.errors.items?.message ? (
            <p className="text-sm text-rose-600">{form.formState.errors.items.message}</p>
          ) : null}
          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

          <Button type="submit" className="mt-2" disabled={form.formState.isSubmitting || !hasAvailableMethod}>
            {form.formState.isSubmitting ? "Gerando pedido..." : "Gerar pedido e abrir WhatsApp"}
          </Button>
        </form>
      </Card>

      <Card className="h-fit">
        <p className="text-sm text-stone-500">Resumo estimado</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd>{formatCurrencyBRL(estimatedSubtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>{isPickup ? "Retirada" : "Entrega"}</dt>
            <dd>{formatCurrencyBRL(estimatedDeliveryFee)}</dd>
          </div>
          <div className="flex items-center justify-between font-semibold text-[var(--color-text)]">
            <dt>Total estimado</dt>
            <dd>{formatCurrencyBRL(estimatedTotal)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-stone-500">Pedido mínimo: {formatCurrencyBRL(settings.minimumOrderValue)}</p>
      </Card>
    </div>
  );
}
