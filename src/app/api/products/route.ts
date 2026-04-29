import { getAdminSession, requireAdminApiSession } from "@/lib/admin-auth";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { assertRateLimit } from "@/lib/rate-limit";
import { createProductSchema } from "@/lib/validations";
import { productService } from "@/services/product-service";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export async function GET(request: Request) {
  try {
    assertRateLimit(request, {
      keyPrefix: "products:list",
      limit: 120,
      windowMs: 60_000,
      message: "Muitas consultas ao catalogo. Aguarde um minuto e tente novamente.",
    });
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const includeInactive =
      url.searchParams.get("includeInactive") === "true" && Boolean(await getAdminSession());

    return jsonSuccess(
      await productService.listPublic({
        search,
        categorySlug: category,
        includeInactive,
        page: parsePositiveInt(url.searchParams.get("page"), 1),
        limit: parsePositiveInt(url.searchParams.get("limit"), 48),
      }),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminApiSession();
    const body = await request.json();
    const payload = createProductSchema.parse({ flavors: [], ...body });
    return jsonSuccess(await productService.create(payload), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
