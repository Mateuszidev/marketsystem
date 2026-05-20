import { HighlightForm } from "@/components/admin/highlight-form";
import { highlightService } from "@/services/highlight-service";

export default async function NovoDestaquePage() {
  const existing = await highlightService.listAdmin();
  const nextOrder = existing.length === 0 ? 0 : Math.max(...existing.map((h) => h.order)) + 1;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Novo destaque</h1>
        <p className="mt-1 text-sm text-stone-500">
          Adicione um banner ao carrossel da home.
        </p>
      </div>
      <HighlightForm defaultOrder={nextOrder} />
    </div>
  );
}
