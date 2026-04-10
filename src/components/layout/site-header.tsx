import Link from "next/link";
import { CartButton } from "@/components/cart/cart-button";

type SiteHeaderProps = {
  storeName: string;
};

export function SiteHeader({ storeName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(248,245,239,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="text-lg font-black tracking-tight text-[var(--color-text)]">
            {storeName}
          </Link>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Catálogo e pedidos por WhatsApp</p>
        </div>
        <nav className="flex items-center gap-2">
          <Link href="/produtos" className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:bg-black/5">
            Produtos
          </Link>
          <Link href="/admin" className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:bg-black/5">
            Admin
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
