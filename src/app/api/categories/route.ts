import { createCategorySchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { categoryService } from "@/services/category-service";

export async function GET() {
  try {
    return jsonSuccess(await categoryService.list());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = createCategorySchema.parse(await request.json());
    return jsonSuccess(await categoryService.create(payload), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
