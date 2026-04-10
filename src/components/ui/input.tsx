import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none ring-0 transition placeholder:text-stone-400 focus:border-[var(--color-brand)]",
        className,
      )}
      {...props}
    />
  );
}
