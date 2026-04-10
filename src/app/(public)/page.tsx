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
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden bg-[linear-gradient(135deg,#17352d_0%,#0d8a63_60%,#9fd9bc_100%)] text-white">
          <Badge className="bg-white/15 text-white">Mercado bonPrix</Badge>
          <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">{settings.storeName}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
            Encarte de produtos! faça o seu pedido e finalize no WhatsApp. 
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/produtos" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#17352d]">
              Ver catálogo
            </Link>
            <Link href="/admin" className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white">
              Abrir admin
            </Link>
          </div>
        </Card>

        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Categorias</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-black tracking-tight">{products.length}</p>
              <p className="text-sm text-stone-500">Produtos ativos</p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight">{categories.length}</p>
              <p className="text-sm text-stone-500">Categorias</p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight">WhatsApp</p>
              <p className="text-sm text-stone-500">Finalização fora do site</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Catálogo</p>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text)]">Produtos em destaque</h2>
          </div>
          <Link href="/produtos" className="text-sm font-semibold text-[var(--color-brand)]">
            Ver todos
          </Link>
        </div>
        {products.length === 0 ? (
          <EmptyState
            title="Nenhum produto ativo cadastrado."
            description="Cadastre produtos na área administrativa para liberar o catálogo."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
