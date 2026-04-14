import type { ReactNode } from "react";
import { headers } from "next/headers";
import { AdminShell } from "@/components/layout/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-admin-pathname");

  if (pathname === "/admin/login") {
    return children;
  }

  return <AdminShell>{children}</AdminShell>;
}
