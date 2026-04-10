import { CategoryForm } from "@/components/admin/category-form";
import { categoryService } from "@/services/category-service";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await categoryService.getById(Number(id));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Editar categoria</h1>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
