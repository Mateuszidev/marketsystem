import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bp-footer">
      <div className="bp-container bp-footer-inner">
        <div>
          <p className="bp-footer-highlight">MarketSystem</p>
          <p className="bp-footer-copy">Catálogo digital com experiência premium para seus clientes.</p>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/produtos" className="bp-footer-copy transition hover:text-white">Produtos</Link>
          <Link href="/carrinho" className="bp-footer-copy transition hover:text-white">Carrinho</Link>
        </nav>
      </div>
    </footer>
  );
}
