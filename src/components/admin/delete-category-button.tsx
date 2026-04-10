"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";

export function DeleteCategoryButton({ categoryId }: { categoryId: number }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={async () => {
        const confirmed = window.confirm("Deseja remover esta categoria?");

        if (!confirmed) {
          return;
        }

        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          window.alert(await getErrorMessage(response));
          return;
        }

        router.refresh();
      }}
    >
      Remover
    </Button>
  );
}
