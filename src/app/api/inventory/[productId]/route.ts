import { updateInventorySchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { inventoryService } from "@/services/inventory-service";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { productId } = await params;
    return jsonSuccess(await inventoryService.getByProductId(Number(productId)));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { productId } = await params;
    const payload = updateInventorySchema.parse(await request.json());
    return jsonSuccess(await inventoryService.update(Number(productId), payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
