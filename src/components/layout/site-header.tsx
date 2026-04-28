import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/cart/cart-button";
import { MARKET_DISPLAY_NAME } from "@/lib/brand";

type SiteHeaderProps = {
  storeName: string;
};

export function SiteHeader({ storeName }: SiteHeaderProps) {
  const displayName = MARKET_DISPLAY_NAME.trim() || storeName;

  return (
    <header className="bp-header">
      <div className="bp-container flex items-center justify-between gap-4">
        <Link href="/" className="bp-logo" aria-label={`Ir para a home da loja ${displayName}`}>
          <div className="bp-logo-icon rounded-xl border-2 border-white/35 bg-white p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
            <Image
              src="/images/logo.png"
              alt={`Logo da loja ${displayName}`}
              width={46}
              height={46}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="bp-logo-text">
            <span className="bp-logo-main">{displayName}</span>
            <span className="bp-logo-sub">catalogo e pedidos</span>
          </div>
        </Link>

        <nav className="bp-nav">
          <Link href="/produtos" className="bp-nav-link">
            Produtos
          </Link>
          <Link href="/admin" className="bp-nav-link">
            Admin
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
