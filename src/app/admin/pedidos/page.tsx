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
  const orders = await orderService.list({ status });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Pedidos</h1>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <form className="flex flex-wrap items-center gap-3">
          <select name="status" defaultValue={status || ""} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-blue-400 focus:bg-white">
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="cancelled">Cancelado</option>
            <option value="delivered">Entregue</option>
          </select>
          <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">Filtrar</button>
        </form>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="Nenhum pedido encontrado." description="Os pedidos criados no checkout aparecerão aqui." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-stone-900">Pedido #{order.id}</h2>
                  <Badge>{order.status}</Badge>
                </div>
                <p className="mt-0.5 text-sm text-stone-500">
                  {order.customerName} • {order.fulfillmentType === "pickup" ? "Retirada" : "Entrega"} • {order.itemCount} item(ns) • {formatCurrencyBRL(order.total)}
                </p>
              </div>
              <Link href={`/admin/pedidos/${order.id}`} className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200">
                Ver detalhes
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
