import { formatCurrencyBRL } from "@/lib/currency";
import type { CreateOrderInput } from "@/lib/validations";
import type { OrderItemSnapshotForMessage } from "@/types/order";

type MessageParams = {
  customer: Omit<CreateOrderInput, "items">;
  items: OrderItemSnapshotForMessage[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export const buildWhatsappMessage = ({
  customer,
  items,
  subtotal,
  deliveryFee,
  total,
}: MessageParams) => {
  const lines = [
    "Olá! Gostaria de fazer este pedido:",
    "",
    ...items.map((item) => {
      const flavorLine = item.flavorName ? `\n  Sabor: ${item.flavorName}` : "";

      return `- ${item.quantity}x ${item.productName}${flavorLine}\n  ${formatCurrencyBRL(item.subtotal)} (${formatCurrencyBRL(item.unitPrice)} cada)`;
    }),
    "",
    `Subtotal: ${formatCurrencyBRL(subtotal)}`,
    `Taxa de entrega: ${formatCurrencyBRL(deliveryFee)}`,
    `Total: ${formatCurrencyBRL(total)}`,
    "",
    `Modalidade: ${customer.fulfillmentType === "pickup" ? "Retirada" : "Entrega"}`,
    `Nome: ${customer.customerName}`,
    `Telefone: ${customer.customerPhone}`,
    `Endereço: ${customer.fulfillmentType === "pickup" ? "-" : customer.customerAddress || "-"}`,
    `Bairro: ${customer.fulfillmentType === "pickup" ? "-" : customer.customerNeighborhood || "-"}`,
    `Referência: ${customer.fulfillmentType === "pickup" ? "-" : customer.customerReference || "-"}`,
    `Observação: ${customer.notes || "-"}`,
  ];

  return lines.join("\n");
};

export const buildWhatsappUrl = (phone: string, message: string) => {
  const sanitizedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
};
