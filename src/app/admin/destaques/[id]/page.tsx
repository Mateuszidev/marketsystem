import { HighlightForm } from "@/components/admin/highlight-form";
import { highlightService } from "@/services/highlight-service";

type EditHighlightPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditHighlightPage({ params }: EditHighlightPageProps) {
  const { id } = await params;
  const highlight = await highlightService.getById(Number(id));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Editar destaque</h1>
      </div>
      <HighlightForm highlight={highlight} />
    </div>
  );
}
