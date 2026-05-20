import { requireAdminApiSession } from "@/lib/admin-auth";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { reorderHighlightsSchema } from "@/lib/validations";
import { highlightService } from "@/services/highlight-service";

export async function PUT(request: Request) {
  try {
    await requireAdminApiSession();
    const payload = reorderHighlightsSchema.parse(await request.json());
    return jsonSuccess(await highlightService.reorder(payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
