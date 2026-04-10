import { ProductForm } from "@/components/admin/product-form";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryService } from "@/services/category-service";

export default async function NovoProdutoPage() {
  const categories = await categoryService.list();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Novo produto</h1>
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
