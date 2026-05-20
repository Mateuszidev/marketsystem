import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { HighlightCarousel } from "@/components/highlight/highlight-carousel";
import { ProductCard } from "@/components/product/product-card";
import { categoryService } from "@/services/category-service";
import { highlightService } from "@/services/highlight-service";
import { productService } from "@/services/product-service";
import { storeService } from "@/services/store-service";

const featuredCategoryOrder = [
  "Pods Descartaveis",
  "Ignite",
  "Elf Bar",
  "Juice",
  "Recarregaveis",
  "Snus",
  "Coils",
  "Pods / Sistemas",
];

const normalizeCategoryName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const featuredCategoryOrderIndex = new Map(
  featuredCategoryOrder.map((name, index) => [normalizeCategoryName(name), index]),
);

export default async function HomePage() {
  const [categories, products, settings, highlights] = await Promise.all([
    categoryService.list(),
    productService.listPublic(),
    storeService.getPublic(),
    highlightService.listPublic(),
  ]);
  const storeName = settings.storeName.trim() || "MarketSystem";
  const featuredCategories = [...categories].sort((a, b) => {
    const aIndex = featuredCategoryOrderIndex.get(normalizeCategoryName(a.name)) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = featuredCategoryOrderIndex.get(normalizeCategoryName(b.name)) ?? Number.MAX_SAFE_INTEGER;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    return a.name.localeCompare(b.name, "pt-BR");
  });

  return (
    <div className="space-y-10">
      <section className="bp-hero">
        <div className="bp-hero-card">
          <h1 className="bp-hero-title">
            <span>{storeName}</span>
          </h1>
          <p className="bp-hero-desc">
            As melhores ofertas de Pods & Vapes em um só lugar. Variedade premium, atendimento rápido e entrega garantida.
          </p>
          <div className="bp-hero-actions">
            <Link href="/produtos" className="btn btn--primary">
              Ver catálogo completo
            </Link>
          </div>
        </div>

        <Card className="bp-cat-card">
          <p className="bp-section-label">Categorias</p>
          <h3 className="text-lg font-bold text-[var(--color-text)]">Navegue por categoria</h3>
          <div className="bp-cat-pills">
            {featuredCategories.map((category) => (
              <Link key={category.id} href={`/categoria/${category.slug}`} className="bp-cat-pill">
                {category.name}
              </Link>
            ))}
          </div>
        </Card>
      </section>

      {highlights.length > 0 ? <HighlightCarousel highlights={highlights} /> : null}

      <section className="space-y-4">
        <div className="bp-section-header">
          <div>
            <p className="bp-section-label">Catálogo</p>
            <h2 className="bp-section-title">Produtos em destaque</h2>
          </div>
          <Link href="/produtos" className="bp-view-all">
            Ver todos
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 7h12M8 2l5 5-5 5" />
            </svg>
          </Link>
        </div>
        {products.length === 0 ? (
          <EmptyState
            title="Nenhum produto ativo cadastrado."
            description="Cadastre produtos na área administrativa para liberar o catálogo."
          />
        ) : (
          <div className="bp-product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
