import { Card } from "@/components/ui/card";
import { orderService } from "@/services/order-service";

export default async function AdminDashboardPage() {
  const stats = await orderService.getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-stone-500">Pedidos totais</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{stats.totalOrders}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">Pedidos pendentes</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{stats.pendingOrders}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">Produtos ativos</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{stats.activeProducts}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">Estoque baixo</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{stats.lowStockProducts}</p>
        </Card>
      </div>
    </div>
  );
}
