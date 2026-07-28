import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdminApiSession } from "@/lib/admin-auth";
import { ApiError, handleRouteError, jsonSuccess } from "@/lib/errors";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  try {
    await requireAdminApiSession();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ApiError("Envie um arquivo de imagem.", 400);
    }

    const extension = ALLOWED_IMAGE_TYPES.get(file.type);

    if (!extension) {
      throw new ApiError("Formato de imagem nao permitido.", 415);
    }

    if (file.size <= 0) {
      throw new ApiError("O arquivo enviado esta vazio.", 400);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ApiError("A imagem deve ter no maximo 5MB.", 413);
    }

    const filename = `${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer, { flag: "wx" });

    return jsonSuccess({ url: `/uploads/${filename}` }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
