import { requireAdminApiSession } from "@/lib/admin-auth";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { updateProductSchema } from "@/lib/validations";
import { productService } from "@/services/product-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    const body = await request.json();
    const payload = updateProductSchema.parse({ flavors: [], ...body });
    return jsonSuccess(await productService.update(Number(id), payload));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    return jsonSuccess(await productService.deactivate(Number(id)));
  } catch (error) {
    return handleRouteError(error);
  }
}
