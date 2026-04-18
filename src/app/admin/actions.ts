"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSession,
  isValidAdminCredentials,
  sanitizeAdminRedirect,
} from "@/lib/admin-auth";
import {
  clearAdminLoginFailures,
  getAdminLoginIdentifier,
  getAdminLoginLock,
  registerAdminLoginFailure,
} from "@/lib/admin-login-rate-limit";

const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Informe o usuario."),
  password: z.string().min(1, "Informe a senha."),
  from: z.string().trim().optional(),
});

export type AdminLoginState = {
  message?: string;
  fieldErrors?: {
    username?: string[];
    password?: string[];
  };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginAdmin(_: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const requestHeaders = await headers();
  const loginIdentifier = getAdminLoginIdentifier(requestHeaders);
  const lock = getAdminLoginLock(loginIdentifier);

  if (lock) {
    return {
      message: `Muitas tentativas de login. Tente novamente em ${lock.retryAfterSeconds} segundos.`,
    };
  }

  const parsed = adminLoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    from: formData.get("from"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { username, password, from } = parsed.data;
  const redirectTo = sanitizeAdminRedirect(from);

  if (!isValidAdminCredentials(username, password)) {
    const nextLock = registerAdminLoginFailure(loginIdentifier);
    await delay(400);

    return {
      message: nextLock
        ? `Muitas tentativas de login. Tente novamente em ${nextLock.retryAfterSeconds} segundos.`
        : "Usuario ou senha invalidos.",
    };
  }

  clearAdminLoginFailures(loginIdentifier);
  await createAdminSession(username);
  redirect(redirectTo);
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function redirectAuthenticatedAdmin(from?: string | null) {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  redirect(sanitizeAdminRedirect(from));
}
