import { requireAdminApiSession } from "@/lib/admin-auth";
import { createOrderSchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { assertRateLimit } from "@/lib/rate-limit";
import { orderService } from "@/services/order-service";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export async function GET(request: Request) {
  try {
    await requireAdminApiSession();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") as "pending" | "confirmed" | "cancelled" | "delivered" | null;
    return jsonSuccess(
      await orderService.list({
        status: status || undefined,
        page: parsePositiveInt(url.searchParams.get("page"), 1),
        limit: parsePositiveInt(url.searchParams.get("limit"), 50),
      }),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertRateLimit(request, {
      keyPrefix: "orders:create",
      limit: 10,
      windowMs: 60_000,
      message: "Muitos pedidos enviados deste endereco. Aguarde um minuto e tente novamente.",
    });
    const payload = createOrderSchema.parse(await request.json());
    return jsonSuccess(await orderService.create(payload), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
