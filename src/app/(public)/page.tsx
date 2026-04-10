import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";
import { storeService } from "@/services/store-service";

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    storeService.get(),
    categoryService.list(),
    productService.list(),
  ]);

  return (
    <div className="space-y-10">
      <section className="bp-hero">
        <div className="bp-hero-card">
          <Badge className="badge">pedido rapido no whatsapp</Badge>
          <h1 className="bp-hero-title">
            Ofertas fresquinhas da <span>{settings.storeName}</span>
          </h1>
          <p className="bp-hero-desc">
            Monte seu carrinho como num encarte moderno, acompanhe os destaques da loja e finalize o pedido em poucos toques.
          </p>
          <div className="bp-hero-actions">
            <Link href="/produtos" className="btn btn--primary">
              Ver catalogo
            </Link>
            <Link href="/admin" className="btn btn--outline">
              Abrir admin
            </Link>
          </div>
        </div>

        <Card className="bp-cat-card">
          <p className="bp-section-label">Categorias em destaque</p>
          <div className="bp-cat-pills">
            {categories.map((category) => (
              <Link key={category.id} href={`/categoria/${category.slug}`} className="bp-cat-pill">
                {category.name}
              </Link>
            ))}
          </div>
          <div className="bp-stats">
            <div>
              <p className="bp-stat-num">{products.length}</p>
              <p className="bp-stat-lbl">Produtos ativos</p>
            </div>
            <div>
              <p className="bp-stat-num">{categories.length}</p>
              <p className="bp-stat-lbl">Categorias</p>
            </div>
            <div>
              <p className="bp-stat-num">Zap</p>
              <p className="bp-stat-lbl">Checkout conversacional</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="bp-promo-banner">
          <div>
            <p className="bp-promo-title">Comprou, clicou, pediu.</p>
            <p className="bp-promo-sub">Experiencia pensada para celular, com visual de tabloide premium.</p>
          </div>
          <Link href="/produtos" className="btn btn--ghost">
            Explorar
          </Link>
        </div>

        <div className="bp-section-header">
          <div>
            <p className="bp-section-label">Catalogo</p>
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
