import { requireAdminApiSession } from "@/lib/admin-auth";
import { createOrderSchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { orderService } from "@/services/order-service";

export async function GET(request: Request) {
  try {
    await requireAdminApiSession();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") as "pending" | "confirmed" | "cancelled" | "delivered" | null;
    return jsonSuccess(await orderService.list(status || undefined));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = createOrderSchema.parse(await request.json());
    return jsonSuccess(await orderService.create(payload), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
