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
  const credentials = getAdminCredentials();

  return safeCompare(username, credentials.username) && safeCompare(password, credentials.password);
};

export const createAdminSession = async (username: string) => {
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
