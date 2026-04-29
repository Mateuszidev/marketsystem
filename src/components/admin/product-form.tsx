"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { createProductSchema, type CreateProductInput } from "@/lib/validations";
import type { CategoryListItem } from "@/types/category";
import type { AdminProductListItem } from "@/types/product";

type ProductFormProps = {
  product?: AdminProductListItem;
  categories: CategoryListItem[];
};

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      imageUrl: product?.imageUrl || "",
      sku: product?.sku || "",
      active: product?.active ?? true,
      categoryId: product?.categoryId || categories[0]?.id || 0,
      quantity: product?.inventoryQuantity || 0,
      minQuantity: product?.minQuantity || 0,
      flavors: product?.flavors || [],
    },
  });
  const flavorFields = useFieldArray({
    control: form.control,
    name: "flavors",
    keyName: "fieldKey",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");

    const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setSubmitError(await getErrorMessage(response));
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  });

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Nome</label>
            <Input {...form.register("name")} />
            <p className="mt-1 text-sm text-rose-600">{form.formState.errors.name?.message}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SKU</label>
            <Input {...form.register("sku")} />
            <p className="mt-1 text-sm text-rose-600">{form.formState.errors.sku?.message}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Slug</label>
            <Input {...form.register("slug")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Categoria</label>
            <Select {...form.register("categoryId", { valueAsNumber: true })}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Descrição</label>
          <Textarea {...form.register("description")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">URL da imagem</label>
          <Input {...form.register("imageUrl")} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Preço</label>
            <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Estoque atual</label>
            <Input type="number" {...form.register("quantity", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Estoque mínimo</label>
            <Input type="number" {...form.register("minQuantity", { valueAsNumber: true })} />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...form.register("active")} />
          Produto ativo no catálogo
        </label>
        <div className="rounded-2xl border border-black/10 bg-stone-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Sabores</h2>
              <p className="text-sm text-stone-600">Adicione variacoes que o cliente deve escolher antes de comprar.</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => flavorFields.append({ name: "", active: true })}
            >
              Adicionar sabor
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {flavorFields.fields.length === 0 ? (
              <p className="text-sm text-stone-600">Sem sabores cadastrados. O produto podera ser adicionado diretamente.</p>
            ) : null}
            {flavorFields.fields.map((field, index) => (
              <div key={field.fieldKey} className="grid gap-3 rounded-2xl border border-black/10 bg-white p-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-start">
                {field.id ? <input type="hidden" {...form.register(`flavors.${index}.id` as const, { valueAsNumber: true })} /> : null}
                <div>
                  <label className="mb-2 block text-sm font-medium">Nome do sabor</label>
                  <Input {...form.register(`flavors.${index}.name` as const)} />
                  <p className="mt-1 text-sm text-rose-600">{form.formState.errors.flavors?.[index]?.name?.message}</p>
                </div>
                <label className="inline-flex items-center gap-2 pt-0 text-sm font-medium md:pt-10">
                  <input type="checkbox" {...form.register(`flavors.${index}.active` as const)} />
                  Ativo
                </label>
                <Button type="button" variant="ghost" className="md:mt-8" onClick={() => flavorFields.remove(index)}>
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </div>
        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar produto"}
        </Button>
      </form>
    </Card>
  );
}
