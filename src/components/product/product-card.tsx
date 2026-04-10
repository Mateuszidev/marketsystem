import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/currency";
import type { ProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="relative h-52 bg-stone-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">Sem imagem</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-stone-500">{product.categoryName}</p>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">{product.name}</h3>
          </div>
          {!product.available ? <Badge className="bg-amber-100 text-amber-700">Sem estoque</Badge> : null}
        </div>
        {product.description ? <p className="text-sm leading-6 text-stone-600">{product.description}</p> : null}
        <div className="mt-auto space-y-4">
          <p className="text-2xl font-black tracking-tight text-[var(--color-text)]">{formatCurrencyBRL(product.price)}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </Card>
  );
}
