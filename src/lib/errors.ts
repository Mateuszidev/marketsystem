import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const jsonError = (message: string, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

export const jsonSuccess = <T>(data: T, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

export const handleRouteError = (error: unknown) => {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return jsonError(error.issues[0]?.message || "Dados inválidos.", 422);
  }

  console.error(error);
  return jsonError("Erro interno do servidor.", 500);
};

export const getErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || "Ocorreu um erro inesperado.";
  } catch {
    return "Ocorreu um erro inesperado.";
  }
};
