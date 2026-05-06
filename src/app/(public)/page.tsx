import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";
import { MARKET_DISPLAY_NAME } from "@/lib/brand";

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
  const [categories, products] = await Promise.all([
    categoryService.list(),
    productService.listPublic(),
  ]);
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
            <span>{MARKET_DISPLAY_NAME}</span>
          </h1>
          <p className="bp-hero-desc">
            As melhores ofertas de Pods & Vapes em um só lugar! Variedade premium, atendimento rápido e entrega garantida
          </p>
          <div className="bp-hero-actions">
            <Link href="/produtos" className="btn btn--primary">
              Ver catálogo
            </Link>
          </div>
        </div>

        <Card className="bp-cat-card">
          <p className="bp-section-label">Categorias em destaque</p>
          <div className="bp-cat-pills">
            {featuredCategories.map((category) => (
              <Link key={category.id} href={`/categoria/${category.slug}`} className="bp-cat-pill">
                {category.name}
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="bp-section-header">
          <div>
            <p className="bp-section-label">Catálogo</p>
            <h2 className="bp-section-title">Produtos em destaque</h2>
          </div>
          <Link href="/produtos" className="bp-view-all">
            Ver todos -&gt;
          </Link>
        </div>
        {products.length === 0 ? (
          <EmptyState
            title="Nenhum produto ativo cadastrado."
            description="Cadastre produtos na area administrativa para liberar o catalogo."
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
