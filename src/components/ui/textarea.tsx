import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "min-h-28 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-stone-400 focus:border-[var(--color-brand)]",
        className,
      )}
      {...props}
    />
  );
}
