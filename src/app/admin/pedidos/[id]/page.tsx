import { OrderStatusForm } from "@/components/admin/order-status-form";
import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/currency";
import { orderService } from "@/services/order-service";

type PedidoDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PedidoDetailPage({ params }: PedidoDetailPageProps) {
  const { id } = await params;
  const order = await orderService.getById(Number(id));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Pedido #{order.id}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Itens do pedido</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.productName}`} className="flex items-center justify-between border-b border-black/5 pb-3">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  {item.flavorName ? <p className="text-sm text-stone-500">Sabor: {item.flavorName}</p> : null}
                  <p className="text-sm text-stone-500">
                    {item.quantity} x {formatCurrencyBRL(item.unitPrice)}
                  </p>
                </div>
                <strong>{formatCurrencyBRL(item.subtotal)}</strong>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Cliente</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-stone-500">Modalidade</dt>
                <dd>{order.fulfillmentType === "pickup" ? "Retirada" : "Entrega"}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Nome</dt>
                <dd>{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Telefone</dt>
                <dd>{order.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Endereço</dt>
                <dd>{order.customerAddress || "-"}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Bairro</dt>
                <dd>{order.customerNeighborhood || "-"}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Referência</dt>
                <dd>{order.customerReference || "-"}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Observação</dt>
                <dd>{order.notes || "-"}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Totais</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{formatCurrencyBRL(order.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>{order.fulfillmentType === "pickup" ? "Retirada" : "Entrega"}</dt>
                <dd>{formatCurrencyBRL(order.deliveryFee)}</dd>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatCurrencyBRL(order.total)}</dd>
              </div>
            </dl>
          </Card>

          <OrderStatusForm orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}
