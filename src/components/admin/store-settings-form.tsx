"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/errors";
import { updateStoreSettingsSchema, type UpdateStoreSettingsInput } from "@/lib/validations";
import type { AdminStoreSettingsDTO } from "@/types/order";

export function StoreSettingsForm({ settings }: { settings: AdminStoreSettingsDTO }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<UpdateStoreSettingsInput>({
    resolver: zodResolver(updateStoreSettingsSchema),
    defaultValues: {
      storeName: settings.storeName,
      whatsappNumber: settings.whatsappNumber,
      deliveryFee: settings.deliveryFee,
      minimumOrderValue: settings.minimumOrderValue,
      acceptsPickup: settings.acceptsPickup,
      acceptsDelivery: settings.acceptsDelivery,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");

    const response = await fetch("/api/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setSubmitError(await getErrorMessage(response));
      return;
    }

    router.refresh();
  });

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Nome da loja</label>
            <Input {...form.register("storeName")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">WhatsApp</label>
            <Input {...form.register("whatsappNumber")} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Taxa de entrega</label>
            <Input type="number" step="0.01" {...form.register("deliveryFee", { valueAsNumber: true })} />
            <p className="mt-1 text-xs text-stone-500">Aplicada apenas quando o cliente escolher entrega.</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Pedido mínimo</label>
            <Input type="number" step="0.01" {...form.register("minimumOrderValue", { valueAsNumber: true })} />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...form.register("acceptsPickup")} />
          Aceita retirada
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...form.register("acceptsDelivery")} />
          Aceita entrega
        </label>
        <p className="text-sm text-rose-600">{form.formState.errors.acceptsDelivery?.message}</p>
        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar configurações"}
        </Button>
      </form>
    </Card>
  );
}
