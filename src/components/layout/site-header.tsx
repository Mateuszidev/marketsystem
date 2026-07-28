import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/cart/cart-button";
import { MobileMenu } from "@/components/layout/mobile-menu";

type SiteHeaderProps = {
  storeName: string;
};

export function SiteHeader({ storeName }: SiteHeaderProps) {
  const displayName = storeName.trim() || "MarketSystem";

  return (
    <header className="bp-header">
      <div className="bp-container bp-header-inner">
        <Link href="/" className="bp-logo" aria-label={`Ir para a home da loja ${displayName}`}>
          <div className="bp-logo-icon">
            <Image
              src="/images/logo.png"
              alt={`Logo da loja ${displayName}`}
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <div className="bp-logo-text">
            <span className="bp-logo-main">{displayName}</span>
            <span className="bp-logo-sub">catálogo e pedidos</span>
          </div>
        </Link>

        <form action="/produtos" className="bp-header-search" role="search">
          <input
            name="busca"
            type="search"
            className="bp-header-search-input"
            placeholder="Buscar produtos..."
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
          <MobileMenu />
        </nav>
      </div>
    </header>
  );
}
