import { CategoryForm } from "@/components/admin/category-form";

export default function NovaCategoriaPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Nova categoria</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
