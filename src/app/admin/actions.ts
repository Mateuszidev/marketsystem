"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSession,
  isValidAdminCredentials,
  sanitizeAdminRedirect,
} from "@/lib/admin-auth";

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

export async function loginAdmin(_: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
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
    return {
      message: "Usuario ou senha invalidos.",
    };
  }

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
