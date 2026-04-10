"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import type { ProductListItem } from "@/types/product";

export function AddToCartButton({ product }: { product: ProductListItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (!product.available) {
    return (
      <Button className="w-full" variant="secondary" disabled>
        Indisponível
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Adicionado" : "Adicionar"}
    </Button>
  );
}
