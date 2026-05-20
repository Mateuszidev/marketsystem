import Link from "next/link";
import { HighlightActions } from "@/components/admin/highlight-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { highlightService } from "@/services/highlight-service";

export default async function AdminDestaquesPage() {
  const highlights = await highlightService.listAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Destaques</h1>
          <p className="mt-1 text-sm text-stone-500">
            Carrossel da home. Apenas destaques ativos aparecem para os clientes.
          </p>
        </div>
        <Link
          href="/admin/destaques/novo"
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Novo destaque
        </Link>
      </div>

      {highlights.length === 0 ? (
        <EmptyState
          title="Nenhum destaque cadastrado."
          description="Crie o primeiro destaque para exibir no carrossel da home."
        />
      ) : (
        <div className="space-y-3">
          {highlights.map((highlight) => (
            <Card
              key={highlight.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={highlight.imageUrl}
                    alt={highlight.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-bold text-stone-900">
                      {highlight.title}
                    </h2>
                    {highlight.active ? (
                      <Badge className="bg-emerald-50 text-emerald-700">Ativo</Badge>
                    ) : (
                      <Badge className="bg-stone-100 text-stone-600">Inativo</Badge>
                    )}
                    <span className="text-xs font-medium text-stone-400">
                      Ordem #{highlight.order}
                    </span>
                  </div>
                  {highlight.description ? (
                    <p className="mt-0.5 line-clamp-1 text-sm text-stone-500">
                      {highlight.description}
                    </p>
                  ) : null}
                  {highlight.buttonText && highlight.buttonLink ? (
                    <p className="mt-1 truncate text-xs text-stone-500">
                      Botão: <span className="font-medium text-stone-700">{highlight.buttonText}</span> →{" "}
                      <span className="text-stone-500">{highlight.buttonLink}</span>
                    </p>
                  ) : null}
                </div>
              </div>
              <HighlightActions
                highlightId={highlight.id}
                active={highlight.active}
                order={highlight.order}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
