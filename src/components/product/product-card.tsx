import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/currency";
import type { PublicProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: PublicProductListItem }) {
  return (
    <Card className="bp-product-card h-full p-0">
      <div
        className="bp-product-img"
        style={{
          background: product.imageUrl
            ? "var(--img-bg)"
            : "linear-gradient(135deg, rgba(255,111,0,0.16) 0%, rgba(26,41,96,0.95) 100%)",
        }}
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="bp-product-image h-full w-full object-contain" />
        ) : (
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--orange2)]">Sem imagem</div>
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
        {product.description ? <p className="bp-product-desc mt-3 text-sm leading-6">{product.description}</p> : null}
        <div className="bp-product-footer mt-auto">
          <p className="bp-product-price">{formatCurrencyBRL(product.price)}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </Card>
  );
}
