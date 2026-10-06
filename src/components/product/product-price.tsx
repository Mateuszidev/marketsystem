import { formatCurrencyBRL } from "@/lib/currency";
import { discountPercentage } from "@/lib/promotion";

export function ProductPrice({ price, originalPrice }: { price: number; originalPrice: number | null }) {
  const discount = discountPercentage(price, originalPrice);
  return (
    <div className="bp-product-pricing">
      {discount !== null ? (
        <div className="bp-product-promotion">
          <del aria-label={`Preco anterior: ${formatCurrencyBRL(originalPrice!)}`}>{formatCurrencyBRL(originalPrice!)}</del>
          <span className="bp-discount-badge">{discount > 0 ? `${discount}% OFF` : "Oferta"}</span>
        </div>
      ) : null}
      <p className="bp-product-price">{formatCurrencyBRL(price)}</p>
    </div>
  );
}
