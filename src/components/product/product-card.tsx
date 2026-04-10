import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/currency";
import type { ProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Card className="bp-product-card h-full p-0">
      <div
        className="bp-product-img"
        style={{
          background: product.imageUrl
            ? "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(135deg, rgba(247,194,0,0.2) 0%, rgba(217,43,43,0.08) 100%)",
        }}
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand)]">Sem imagem</div>
        )}
        {!product.available ? <span className="bp-product-tag">Sem estoque</span> : <span className="bp-product-tag">Destaque</span>}
      </div>
      <div className="bp-product-body flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="bp-product-unit">{product.categoryName}</p>
            <h3 className="bp-product-name">{product.name}</h3>
          </div>
          {product.available ? <Badge className="badge badge--yellow">Disponivel</Badge> : null}
        </div>
        {product.description ? <p className="mt-3 text-sm leading-6 text-stone-600">{product.description}</p> : null}
        <div className="bp-product-footer mt-auto">
          <p className="bp-product-price">{formatCurrencyBRL(product.price)}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </Card>
  );
}
