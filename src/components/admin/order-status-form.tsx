"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/errors";
import type { OrderStatus } from "@/types/order";

export function OrderStatusForm({ orderId, currentStatus }: { orderId: number; currentStatus: OrderStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setLoading(false);

    if (!response.ok) {
      setError(await getErrorMessage(response));
      return;
    }

    router.refresh();
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">Status do pedido</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="cancelled">Cancelado</option>
          <option value="delivered">Entregue</option>
        </Select>
        <Button onClick={updateStatus} disabled={loading}>
          {loading ? "Atualizando..." : "Salvar status"}
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </Card>
  );
}
