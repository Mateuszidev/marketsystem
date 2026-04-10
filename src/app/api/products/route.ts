import { createProductSchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { productService } from "@/services/product-service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const includeInactive = url.searchParams.get("includeInactive") === "true";

    return jsonSuccess(
      await productService.list({
        search,
        categorySlug: category,
        includeInactive,
      }),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = createProductSchema.parse(await request.json());
    return jsonSuccess(await productService.create(payload), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
