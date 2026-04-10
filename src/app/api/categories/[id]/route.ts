import { updateCategorySchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { categoryService } from "@/services/category-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const payload = updateCategorySchema.parse(await request.json());
    return jsonSuccess(await categoryService.update(Number(id), payload));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await categoryService.remove(Number(id));
    return jsonSuccess({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
