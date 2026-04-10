import { updateStoreSettingsSchema } from "@/lib/validations";
import { handleRouteError, jsonSuccess } from "@/lib/errors";
import { storeService } from "@/services/store-service";

export async function GET() {
  try {
    return jsonSuccess(await storeService.get());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const payload = updateStoreSettingsSchema.parse(await request.json());
    return jsonSuccess(await storeService.update(payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
