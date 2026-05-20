"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="bp-mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {isOpen ? (
            <>
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </>
          ) : (
            <>
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </>
          )}
        </svg>
      </button>

      {isOpen ? (
        <div className="bp-mobile-menu" onClick={() => setIsOpen(false)}>
          <div className="bp-mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <nav className="bp-mobile-nav">
              <Link href="/" className="bp-mobile-nav-link" onClick={() => setIsOpen(false)}>
                Início
              </Link>
              <Link href="/produtos" className="bp-mobile-nav-link" onClick={() => setIsOpen(false)}>
                Produtos
              </Link>
              <Link href="/carrinho" className="bp-mobile-nav-link" onClick={() => setIsOpen(false)}>
                Carrinho
              </Link>
              <Link href="/admin" className="bp-mobile-nav-link" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
