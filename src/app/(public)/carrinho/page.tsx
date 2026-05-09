import { CartItems } from "@/components/cart/cart-items";

export default function CarrinhoPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Carrinho</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Seu pedido</h1>
      </div>
      <CartItems />
    </div>
  );
}
