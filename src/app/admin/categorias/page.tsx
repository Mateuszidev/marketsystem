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
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Categorias</h1>
        </div>
        <Link href="/admin/categorias/novo" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
          Nova categoria
        </Link>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="Nenhuma categoria cadastrada." description="Crie a primeira categoria para organizar o catálogo." />
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <Card key={category.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">{category.name}</h2>
                <p className="mt-0.5 text-sm text-stone-500">
                  /{category.slug} • {category.productCount} produto(s)
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/categorias/${category.id}`} className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200">
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
