"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
    },
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
        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar produto"}
        </Button>
      </form>
    </Card>
  );
}
