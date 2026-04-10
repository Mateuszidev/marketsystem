"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/errors";
import { updateInventorySchema, type UpdateInventoryInput } from "@/lib/validations";

type InventoryFormProps = {
  productId: number;
  quantity: number;
  minQuantity: number;
};

export function InventoryForm({ productId, quantity, minQuantity }: InventoryFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<UpdateInventoryInput>({
    resolver: zodResolver(updateInventorySchema),
    defaultValues: {
      quantity,
      minQuantity,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");

    const response = await fetch(`/api/inventory/${productId}`, {
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
      <h2 className="text-lg font-semibold text-[var(--color-text)]">Ajuste rápido de estoque</h2>
      <form className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={onSubmit}>
        <Input type="number" {...form.register("quantity", { valueAsNumber: true })} />
        <Input type="number" {...form.register("minQuantity", { valueAsNumber: true })} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Atualizar
        </Button>
      </form>
      {submitError ? <p className="mt-3 text-sm text-rose-600">{submitError}</p> : null}
    </Card>
  );
}
