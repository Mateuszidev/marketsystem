"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";
import type { ProductFlavorDTO, PublicProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: PublicProductListItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavorDTO | null>(null);
  const [added, setAdded] = useState(false);
  const hasFlavors = product.flavors.length > 0;

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
              : "linear-gradient(135deg, rgba(255,111,0,0.16) 0%, rgba(26,41,96,0.95) 100%)",
          }}
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="bp-product-image h-full w-full object-contain" />
          ) : (
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--orange2)]">Sem imagem</div>
          )}
          {!product.available ? <span className="bp-product-tag">Sem estoque</span> : <span className="bp-product-tag">Destaque</span>}
        </div>
        <div className="bp-product-body flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="bp-product-unit">{product.categoryName}</p>
              <h3 className="bp-product-name">{product.name}</h3>
            </div>
            {product.available ? <Badge className="badge badge--yellow">Disponivel</Badge> : null}
          </div>
          {hasFlavors ? (
            <p className="mt-2 text-xs font-semibold text-[var(--orange2)]">{product.flavors.length} sabores disponiveis</p>
          ) : null}
          {product.description ? <p className="bp-product-desc mt-3 text-sm leading-6">{product.description}</p> : null}
          <div className="bp-product-footer mt-auto">
            <p className="bp-product-price">{formatCurrencyBRL(product.price)}</p>
            <Button
              className="w-full"
              variant={product.available ? "primary" : "secondary"}
              disabled={!product.available}
              onClick={(event) => {
                event.stopPropagation();
                openDetails();
              }}
            >
              {!product.available ? "Indisponivel" : hasFlavors ? "Escolher sabor" : "Adicionar"}
            </Button>
          </div>
        </div>
      </Card>

      {isOpen ? (
        <div className="fixed inset-0 z-[1000] flex items-end bg-black/60 p-3 sm:items-center sm:justify-center" onClick={closeDetails}>
          <div
            className="w-full max-w-lg rounded-[var(--radius)] bg-white p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`product-details-${product.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">{product.categoryName}</p>
                <h2 id={`product-details-${product.id}`} className="mt-1 text-2xl font-black text-[var(--color-text)]">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-bold text-[var(--color-text)]"
                onClick={closeDetails}
                aria-label="Fechar"
              >
                X
              </button>
            </div>

            {product.description ? <p className="mt-3 text-sm leading-6 text-stone-600">{product.description}</p> : null}
            <p className="mt-4 text-2xl font-black text-[var(--orange)]">{formatCurrencyBRL(product.price)}</p>

            {hasFlavors ? (
              <div className="mt-5">
                <p className="text-sm font-bold text-[var(--color-text)]">Escolha um sabor para continuar</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.flavors.map((flavor) => {
                    const isSelected = selectedFlavor?.id === flavor.id;

                    return (
                      <button
                        key={flavor.id}
                        type="button"
                        className={`rounded-[var(--radius-sm)] border px-4 py-3 text-left text-sm font-semibold transition ${
                          isSelected
                            ? "border-[var(--orange)] bg-[var(--color-surface-warm)] text-[var(--color-text)]"
                            : "border-black/10 bg-white text-stone-700 hover:border-[var(--orange)]"
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
              {added ? "Adicionado" : "Adicionar ao carrinho"}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
