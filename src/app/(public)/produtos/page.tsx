import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";

type ProdutosPageProps = {
  searchParams: Promise<{
    busca?: string;
    categoria?: string;
  }>;
};

export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const filters = await searchParams;
  const [categories, products] = await Promise.all([
    categoryService.list(),
    productService.listPublic({
      search: filters.busca || "",
      categorySlug: filters.categoria || "",
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Produtos</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Catálogo completo</h1>
      </div>

      <form className="bp-filter-form grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <input
          name="busca"
          defaultValue={filters.busca || ""}
          placeholder="Buscar por nome"
          className="bp-filter-control"
        />
        <select
          name="categoria"
          defaultValue={filters.categoria || ""}
          className="bp-filter-control"
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="rounded-2xl bg-[var(--orange)] px-5 py-3 text-sm font-semibold text-white">Filtrar</button>
      </form>

      {products.length === 0 ? (
        <EmptyState title="Nenhum produto encontrado." description="Ajuste os filtros ou cadastre novos produtos no painel." />
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
