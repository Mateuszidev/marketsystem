import { ProductForm } from "@/components/admin/product-form";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryService } from "@/services/category-service";

export default async function NovoProdutoPage() {
  const categories = await categoryService.list();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Novo produto</h1>
      </div>
      {categories.length === 0 ? (
        <EmptyState
          title="Cadastre ao menos uma categoria antes de criar produtos."
          description="O produto precisa estar vinculado a uma categoria existente."
        />
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
