import { requireAdminApiSession } from "@/lib/admin-auth";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { updateHighlightSchema } from "@/lib/validations";
import { highlightService } from "@/services/highlight-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    return jsonSuccess(await highlightService.getById(Number(id)));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    const payload = updateHighlightSchema.parse(await request.json());
    return jsonSuccess(await highlightService.update(Number(id), payload));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(_: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    return jsonSuccess(await highlightService.toggleActive(Number(id)));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    await highlightService.remove(Number(id));
    return jsonSuccess({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
