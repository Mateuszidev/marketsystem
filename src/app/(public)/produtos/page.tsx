import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";
import type { CategoryListItem } from "@/types/category";
import type { PublicProductListItem } from "@/types/product";

type ProdutosPageProps = {
  searchParams: Promise<{
    busca?: string;
    categoria?: string;
  }>;
};

type ProductCategoryGroup = {
  key: string;
  name: string;
  categoryId: number | null;
  products: PublicProductListItem[];
};

const getProductCategoryGroups = (
  products: PublicProductListItem[],
  categories: CategoryListItem[],
) => {
  const groups = new Map<string, ProductCategoryGroup>();
  const categoryOrder = new Map(categories.map((category, index) => [category.id, index]));

  for (const product of products) {
    const categoryName = product.categoryName?.trim() || "Sem categoria";
    const key = product.categoryId ? `category-${product.categoryId}` : "sem-categoria";
    const group = groups.get(key);

    if (group) {
      group.products.push(product);
      continue;
    }

    groups.set(key, {
      key,
      name: categoryName,
      categoryId: product.categoryId || null,
      products: [product],
    });
  }

  return [...groups.values()].sort((a, b) => {
    const aOrder = a.categoryId ? categoryOrder.get(a.categoryId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    const bOrder = b.categoryId ? categoryOrder.get(b.categoryId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.name.localeCompare(b.name, "pt-BR");
  });
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
  const productGroups = getProductCategoryGroups(products, categories);

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
        <div className="space-y-10">
          {productGroups.map((group) => (
            <section key={group.key} className="space-y-4">
              <div className="flex flex-col gap-1 border-b border-[var(--color-border)] pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-brand-dark)]">Categoria</p>
                  <h2 className="text-2xl font-black tracking-tight text-[var(--color-text)]">{group.name}</h2>
                </div>
                <p className="text-sm font-semibold text-[var(--muted)]">
                  {group.products.length} {group.products.length === 1 ? "produto" : "produtos"}
                </p>
              </div>
              <div className="bp-product-grid">
                {group.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
