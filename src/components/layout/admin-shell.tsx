import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { getAdminSession } from "@/lib/admin-auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/configuracoes", label: "Configuracoes" },
];

export async function AdminShell({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.25)]">
          <Link href="/" className="text-lg font-black tracking-tight text-[var(--color-text)]">
            Mercado System
          </Link>
          <p className="mt-2 text-sm text-stone-500">Painel simples para operacao manual do catalogo.</p>
          <div className="mt-6 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
            <p className="font-semibold text-[var(--color-text)]">{session?.username || "Admin"}</p>
            <p>Sessao administrativa ativa</p>
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAdmin} className="mt-8">
            <Button type="submit" variant="secondary" className="w-full">
              Sair
            </Button>
          </form>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
