"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";

type HighlightActionsProps = {
  highlightId: number;
  active: boolean;
  order: number;
};

export function HighlightActions({ highlightId, active, order }: HighlightActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const loading = isPending || busy;

  const handleToggle = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/highlights/${highlightId}`, { method: "PATCH" });

      if (!response.ok) {
        window.alert(await getErrorMessage(response));
        return;
      }

      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Deseja remover este destaque? Esta ação não pode ser desfeita.")) {
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`/api/highlights/${highlightId}`, { method: "DELETE" });

      if (!response.ok) {
        window.alert(await getErrorMessage(response));
        return;
      }

      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  };

  const handleReorder = async (direction: "up" | "down") => {
    setBusy(true);
    try {
      const response = await fetch("/api/highlights");
      if (!response.ok) {
        window.alert(await getErrorMessage(response));
        return;
      }

      const payload = (await response.json()) as { data: Array<{ id: number; order: number }> };
      const sorted = [...payload.data].sort((a, b) => a.order - b.order);
      const currentIndex = sorted.findIndex((h) => h.id === highlightId);

      if (currentIndex === -1) {
        return;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= sorted.length) {
        return;
      }

      const reordered = [...sorted];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, moved);

      const reorderResponse = await fetch("/api/highlights/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((h) => h.id) }),
      });

      if (!reorderResponse.ok) {
        window.alert(await getErrorMessage(reorderResponse));
        return;
      }

      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => handleReorder("up")}
        disabled={loading || order === 0}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Mover para cima"
        title="Mover para cima"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => handleReorder("down")}
        disabled={loading}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Mover para baixo"
        title="Mover para baixo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`ml-1 rounded-xl px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          active
            ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        {active ? "Desativar" : "Ativar"}
      </button>

      <Link
        href={`/admin/destaques/${highlightId}`}
        className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200"
      >
        Editar
      </Link>

      <Button
        type="button"
        variant="ghost"
        className="text-xs text-rose-600 hover:bg-rose-50"
        onClick={handleDelete}
        disabled={loading}
      >
        Remover
      </Button>
    </div>
  );
}
