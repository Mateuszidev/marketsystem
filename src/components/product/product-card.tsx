"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductPrice } from "@/components/product/product-price";
import { useCartStore } from "@/store/cart-store";
import type { ProductFlavorDTO, PublicProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: PublicProductListItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavorDTO | null>(null);
  const [added, setAdded] = useState(false);
  const hasFlavors = product.flavors.length > 0;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscrollBehavior;
    };
  }, [isOpen]);

  const openDetails = () => {
    if (!product.available) {
      return;
    }

    setIsOpen(true);
  };

  const closeDetails = () => {
    setIsOpen(false);
    setSelectedFlavor(null);
  };

  const handleAdd = () => {
    if (hasFlavors && !selectedFlavor) {
      return;
    }

    addItem(product, selectedFlavor);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
    closeDetails();
  };

  return (
    <>
      <Card
        className="bp-product-card h-full p-0"
        onClick={openDetails}
        role="button"
        tabIndex={product.available ? 0 : -1}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDetails();
          }
        }}
      >
        <div
          className="bp-product-img"
          style={{
            background: product.imageUrl
              ? "var(--img-bg)"
              : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="bp-product-image h-full w-full object-contain" />
          ) : (
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">Sem imagem</div>
          )}
          {!product.available ? (
            <span className="bp-product-tag" style={{ background: "rgba(239,68,68,.1)", color: "#dc2626" }}>Sem estoque</span>
          ) : null}
        </div>
        <div className="bp-product-body flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="bp-product-unit">{product.categoryName}</p>
              <h3 className="bp-product-name">{product.name}</h3>
            </div>
            {product.available ? <Badge className="badge badge--yellow shrink-0">Disponível</Badge> : null}
          </div>
          {hasFlavors ? (
            <p className="mt-1.5 text-xs font-semibold text-[var(--color-brand)]">{product.flavors.length} sabores</p>
          ) : null}
          {product.description ? <p className="bp-product-desc mt-2 line-clamp-2 text-sm leading-relaxed">{product.description}</p> : null}
          <div className="bp-product-footer mt-auto">
            <ProductPrice price={product.price} originalPrice={product.originalPrice} />
            <Button
              className="shrink-0 px-4 py-2 text-xs"
              variant={product.available ? "primary" : "secondary"}
              disabled={!product.available}
              onClick={(event) => {
                event.stopPropagation();
                openDetails();
              }}
            >
              {!product.available ? "Indisponível" : added ? "✓ Adicionado" : hasFlavors ? "Escolher" : "Adicionar"}
            </Button>
          </div>
        </div>
      </Card>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[1000] flex items-end overflow-hidden overscroll-none bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:justify-center"
          onClick={closeDetails}
          style={{ animation: "fadeIn 150ms ease" }}
        >
          <div
            className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`product-details-${product.id}`}
            onClick={(event) => event.stopPropagation()}
            style={{ animation: "slideInRight 220ms cubic-bezier(.22,1,.36,1)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand)]">{product.categoryName}</p>
                <h2 id={`product-details-${product.id}`} className="mt-1 text-xl font-black text-[var(--color-text)]">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-alt)] text-[var(--color-soft-text)] transition hover:bg-[var(--color-border-strong)]"
                onClick={closeDetails}
                aria-label="Fechar"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="1" x2="13" y2="13" />
                  <line x1="13" y1="1" x2="1" y2="13" />
                </svg>
              </button>
            </div>

            {product.description ? <p className="mt-3 text-sm leading-relaxed text-[var(--color-soft-text)]">{product.description}</p> : null}
            <div className="mt-4"><ProductPrice price={product.price} originalPrice={product.originalPrice} /></div>

            {hasFlavors ? (
              <div className="mt-5">
                <p className="text-sm font-bold text-[var(--color-text)]">Escolha um sabor</p>
                <div className="mt-3 grid max-h-[50vh] gap-2 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2">
                  {product.flavors.map((flavor) => {
                    const isSelected = selectedFlavor?.id === flavor.id;

                    return (
                      <button
                        key={flavor.id}
                        type="button"
                        className={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition ${
                          isSelected
                            ? "border-[var(--color-accent)] bg-[var(--color-surface-warm)] text-[var(--color-text)]"
                            : "border-[rgba(0,0,0,0.06)] bg-[var(--color-surface-alt)] text-[var(--color-soft-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                        }`}
                        onClick={() => setSelectedFlavor(flavor)}
                      >
                        {flavor.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <Button className="mt-6 w-full" disabled={hasFlavors && !selectedFlavor} onClick={handleAdd}>
              {added ? "✓ Adicionado ao carrinho" : "Adicionar ao carrinho"}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
