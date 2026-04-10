export type OrderStatus = "pending" | "confirmed" | "cancelled" | "delivered";
export type FulfillmentType = "delivery" | "pickup";

export type OrderItemSnapshotForMessage = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type OrderSummary = {
  id: number;
  fulfillmentType: FulfillmentType;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
};

export type OrderDetail = OrderSummary & {
  customerAddress: string | null;
  customerNeighborhood: string | null;
  customerReference: string | null;
  notes: string | null;
  whatsappMessage: string;
  items: OrderItemSnapshotForMessage[];
};

export type StoreSettingsDTO = {
  id: number;
  storeName: string;
  whatsappNumber: string;
  deliveryFee: number;
  minimumOrderValue: number;
  acceptsPickup: boolean;
  acceptsDelivery: boolean;
  createdAt: string;
  updatedAt: string;
};
