import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "min-h-24 w-full rounded-xl border border-black/8 bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:bg-white focus:ring-2 focus:ring-[rgba(37,99,235,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
