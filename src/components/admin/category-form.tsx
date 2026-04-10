"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/errors";
import { createCategorySchema, type CreateCategoryInput } from "@/lib/validations";
import type { CategoryListItem } from "@/types/category";

export function CategoryForm({ category }: { category?: CategoryListItem }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");

    const response = await fetch(category ? `/api/categories/${category.id}` : "/api/categories", {
      method: category ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setSubmitError(await getErrorMessage(response));
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  });

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium">Nome</label>
          <Input {...form.register("name")} />
          <p className="mt-1 text-sm text-rose-600">{form.formState.errors.name?.message}</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Slug</label>
          <Input {...form.register("slug")} placeholder="Opcional. Se vazio, será gerado automaticamente." />
        </div>
        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar categoria"}
        </Button>
      </form>
    </Card>
  );
}
