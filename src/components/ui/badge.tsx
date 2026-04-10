import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-600",
        className,
      )}
      {...props}
    />
  );
}
