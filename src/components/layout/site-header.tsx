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
      <div className="bp-container bp-header-inner">
        <Link href="/" className="bp-logo" aria-label={`Ir para a home da loja ${displayName}`}>
          <div className="bp-logo-icon p-1">
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

        <form action="/produtos" className="bp-header-search" role="search">
          <input
            name="busca"
            type="search"
            className="bp-header-search-input"
            placeholder="Buscar pods, juices e acessorios"
            aria-label="Buscar produtos"
          />
          <button type="submit" className="bp-header-search-button">
            Buscar
          </button>
        </form>

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
