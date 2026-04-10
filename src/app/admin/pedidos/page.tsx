import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrencyBRL } from "@/lib/currency";
import { orderService } from "@/services/order-service";

type AdminPedidosPageProps = {
  searchParams: Promise<{ status?: "pending" | "confirmed" | "cancelled" | "delivered" }>;
};

export default async function AdminPedidosPage({ searchParams }: AdminPedidosPageProps) {
  const { status } = await searchParams;
  const orders = await orderService.list(status);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Pedidos</h1>
      </div>

      <form className="rounded-3xl border border-black/8 bg-white p-5 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.25)]">
        <select name="status" defaultValue={status || ""} className="rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none">
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="cancelled">Cancelado</option>
          <option value="delivered">Entregue</option>
        </select>
        <button className="ml-3 rounded-2xl bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white">Filtrar</button>
      </form>

      {orders.length === 0 ? (
        <EmptyState title="Nenhum pedido encontrado." description="Os pedidos criados no checkout aparecerão aqui." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
                  <Badge>{order.status}</Badge>
                </div>
                <p className="text-sm text-stone-500">
                  {order.customerName} • {order.fulfillmentType === "pickup" ? "Retirada" : "Entrega"} • {order.itemCount} item(ns) • {formatCurrencyBRL(order.total)}
                </p>
              </div>
              <Link href={`/admin/pedidos/${order.id}`} className="rounded-2xl bg-stone-100 px-4 py-2 text-sm font-semibold">
                Ver detalhes
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
