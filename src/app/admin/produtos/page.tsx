import Link from "next/link";
import { DeactivateProductButton } from "@/components/admin/deactivate-product-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrencyBRL } from "@/lib/currency";
import { productService } from "@/services/product-service";

export default async function AdminProdutosPage() {
  const products = await productService.listAdmin({ includeInactive: true });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
          <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Produtos</h1>
        </div>
        <Link href="/admin/produtos/novo" className="rounded-2xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white">
          Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState title="Nenhum produto cadastrado." description="Cadastre o primeiro item do catálogo." />
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  {!product.active ? <Badge className="bg-rose-100 text-rose-700">Inativo</Badge> : null}
                </div>
                <p className="text-sm text-stone-500">
                  {product.categoryName} • {formatCurrencyBRL(product.price)} • Estoque {product.inventoryQuantity}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/produtos/${product.id}`} className="rounded-2xl bg-stone-100 px-4 py-2 text-sm font-semibold">
                  Editar
                </Link>
                {product.active ? <DeactivateProductButton productId={product.id} /> : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
