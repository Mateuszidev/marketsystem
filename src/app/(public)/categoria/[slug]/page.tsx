import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";

type CategoriaPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const { slug } = await params;
  const category = await categoryService.getBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await productService.listPublic({ categorySlug: slug });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Categoria</p>
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">{category.name}</h1>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Nenhum produto disponível nesta categoria."
          description="Cadastre itens nesta categoria para exibi-los aqui."
        />
      ) : (
        <div className="bp-product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
