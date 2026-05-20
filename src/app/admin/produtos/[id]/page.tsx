import { InventoryForm } from "@/components/admin/inventory-form";
import { ProductForm } from "@/components/admin/product-form";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    categoryService.list(),
    productService.getAdminById(Number(id)),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Editar produto</h1>
      </div>
      <ProductForm categories={categories} product={product} />
      <InventoryForm productId={product.id} quantity={product.inventoryQuantity} minQuantity={product.minQuantity} />
    </div>
  );
}
