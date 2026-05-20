import { getAdminSession, requireAdminApiSession } from "@/lib/admin-auth";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { createHighlightSchema } from "@/lib/validations";
import { highlightService } from "@/services/highlight-service";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (session) {
      return jsonSuccess(await highlightService.listAdmin());
    }

    return jsonSuccess(await highlightService.listPublic());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminApiSession();
    const payload = createHighlightSchema.parse(await request.json());
    return jsonSuccess(await highlightService.create(payload), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
