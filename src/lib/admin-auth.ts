import "server-only";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/errors";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  verifyAdminSessionToken,
  type AdminSession,
} from "@/lib/admin-auth-session";

const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const MIN_ADMIN_PASSWORD_LENGTH = 12;
const MIN_SESSION_SECRET_LENGTH = 32;
const INSECURE_ADMIN_VALUES = new Set(["admin", "123456", "password", "sua-senha", "changeme"]);

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const getAdminCredentials = () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME e ADMIN_PASSWORD precisam estar configurados.");
  }

  return { username, password };
};

const hasStrongAdminPassword = (value: string) =>
  value.length >= MIN_ADMIN_PASSWORD_LENGTH &&
  /[a-z]/i.test(value) &&
  /\d/.test(value) &&
  /[^a-z0-9]/i.test(value) &&
  !INSECURE_ADMIN_VALUES.has(value.toLowerCase());

const hasStrongSessionSecret = (value: string) =>
  value.length >= MIN_SESSION_SECRET_LENGTH && !INSECURE_ADMIN_VALUES.has(value.toLowerCase());

const assertSecureAdminConfig = () => {
  const { password } = getAdminCredentials();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error("ADMIN_SESSION_SECRET nao configurado.");
  }

  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (!hasStrongAdminPassword(password)) {
    throw new Error("ADMIN_PASSWORD precisa ter pelo menos 12 caracteres e incluir letras, numeros e simbolos.");
  }

  if (!hasStrongSessionSecret(sessionSecret)) {
    throw new Error("ADMIN_SESSION_SECRET precisa ter pelo menos 32 caracteres e nao pode usar valores previsiveis.");
  }
};

export const sanitizeAdminRedirect = (value?: string | null) => {
  if (!value || !value.startsWith("/admin")) {
    return "/admin";
  }

  if (value.startsWith("/admin/login")) {
    return "/admin";
  }

  return value;
};

export const getAdminSession = async (): Promise<AdminSession | null> => {
  assertSecureAdminConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return verifyAdminSessionToken(token);
};

export const requireAdminSession = async () => {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
};

export const requireAdminApiSession = async () => {
  const session = await getAdminSession();

  if (!session) {
    throw new ApiError("Voce precisa entrar para acessar a area admin.", 401);
  }

  return session;
};

export const isValidAdminCredentials = (username: string, password: string) => {
  assertSecureAdminConfig();
  const credentials = getAdminCredentials();

  return safeCompare(username, credentials.username) && safeCompare(password, credentials.password);
};

export const createAdminSession = async (username: string) => {
  assertSecureAdminConfig();
  const cookieStore = await cookies();
  const token = createAdminSessionToken(username);

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
};
