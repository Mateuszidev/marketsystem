import { CategoryForm } from "@/components/admin/category-form";

export default function NovaCategoriaPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Nova categoria</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
