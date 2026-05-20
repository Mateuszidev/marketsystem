"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { createHighlightSchema, type CreateHighlightInput } from "@/lib/validations";
import type { HighlightDTO } from "@/types/highlight";

type HighlightFormProps = {
  highlight?: HighlightDTO;
  defaultOrder?: number;
};

export function HighlightForm({ highlight, defaultOrder = 0 }: HighlightFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<CreateHighlightInput>({
    resolver: zodResolver(createHighlightSchema),
    defaultValues: {
      title: highlight?.title || "",
      description: highlight?.description || "",
      imageUrl: highlight?.imageUrl || "",
      buttonText: highlight?.buttonText || "",
      buttonLink: highlight?.buttonLink || "",
      active: highlight?.active ?? true,
      order: highlight?.order ?? defaultOrder,
    },
  });
  const imageUrl = form.watch("imageUrl");

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");

    const response = await fetch(
      highlight ? `/api/highlights/${highlight.id}` : "/api/highlights",
      {
        method: highlight ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );

    if (!response.ok) {
      setSubmitError(await getErrorMessage(response));
      return;
    }

    router.push("/admin/destaques");
    router.refresh();
  });

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Título</label>
          <Input placeholder="Ex.: Pods em promoção" {...form.register("title")} />
          {form.formState.errors.title?.message ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.title.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Descrição</label>
          <Textarea
            placeholder="Resumo curto exibido abaixo do título"
            {...form.register("description")}
          />
          {form.formState.errors.description?.message ? (
            <p className="mt-1 text-xs text-rose-600">
              {form.formState.errors.description.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">URL da imagem</label>
          <Input placeholder="https://..." {...form.register("imageUrl")} />
          {form.formState.errors.imageUrl?.message ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.imageUrl.message}</p>
          ) : null}
          {imageUrl ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Pré-visualização do destaque"
                className="h-40 w-full object-cover"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Texto do botão
            </label>
            <Input placeholder="Ex.: Comprar agora" {...form.register("buttonText")} />
            <p className="mt-1 text-xs text-stone-500">
              Opcional. Só aparece se houver link também.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Link do botão
            </label>
            <Input placeholder="/produtos ou https://..." {...form.register("buttonLink")} />
            <p className="mt-1 text-xs text-stone-500">
              Caminho interno (/produtos) ou URL completa.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Ordem de exibição
            </label>
            <Input
              type="number"
              min={0}
              {...form.register("order", { valueAsNumber: true })}
            />
            <p className="mt-1 text-xs text-stone-500">
              Menor número aparece primeiro.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 self-end pb-2 text-sm font-medium text-stone-700">
            <input type="checkbox" className="accent-blue-600" {...form.register("active")} />
            Destaque ativo no carrossel
          </label>
        </div>

        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Salvando..." : highlight ? "Salvar alterações" : "Criar destaque"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/destaques")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
