import Link from "next/link";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryService } from "@/services/category-service";

export default async function AdminCategoriasPage() {
  const categories = await categoryService.list();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
          <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Categorias</h1>
        </div>
        <Link href="/admin/categorias/novo" className="rounded-2xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white">
          Nova categoria
        </Link>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="Nenhuma categoria cadastrada." description="Crie a primeira categoria para organizar o catálogo." />
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{category.name}</h2>
                <p className="text-sm text-stone-500">
                  /{category.slug} • {category.productCount} produto(s)
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/categorias/${category.id}`} className="rounded-2xl bg-stone-100 px-4 py-2 text-sm font-semibold">
                  Editar
                </Link>
                <DeleteCategoryButton categoryId={category.id} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
