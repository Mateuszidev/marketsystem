import { Card } from "@/components/ui/card";
import { orderService } from "@/services/order-service";

export default async function AdminDashboardPage() {
  const stats = await orderService.getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex flex-col">
          <p className="text-xs font-medium text-stone-500">Pedidos totais</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-stone-900">{stats.totalOrders}</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-medium text-stone-500">Pedidos pendentes</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-orange-600">{stats.pendingOrders}</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-medium text-stone-500">Produtos ativos</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-stone-900">{stats.activeProducts}</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-medium text-stone-500">Estoque baixo</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-red-600">{stats.lowStockProducts}</p>
        </Card>
      </div>
    </div>
  );
}
