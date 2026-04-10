import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-brand)]",
        className,
      )}
      {...props}
    />
  );
}
