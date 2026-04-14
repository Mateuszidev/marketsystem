import { requireAdminApiSession } from "@/lib/admin-auth";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { updateOrderStatusSchema } from "@/lib/validations";
import { orderService } from "@/services/order-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    return jsonSuccess(await orderService.getById(Number(id)));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    const payload = updateOrderStatusSchema.parse(await request.json());
    return jsonSuccess(await orderService.updateStatus(Number(id), payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
