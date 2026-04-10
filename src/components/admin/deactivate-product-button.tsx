"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";

export function DeactivateProductButton({ productId }: { productId: number }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={async () => {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          window.alert(await getErrorMessage(response));
          return;
        }

        router.refresh();
      }}
    >
      Desativar
    </Button>
  );
}
