import { updateProductSchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { productService } from "@/services/product-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const payload = updateProductSchema.parse(await request.json());
    return jsonSuccess(await productService.update(Number(id), payload));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    return jsonSuccess(await productService.deactivate(Number(id)));
  } catch (error) {
    return handleRouteError(error);
  }
}
