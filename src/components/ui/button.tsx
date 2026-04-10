import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]",
  secondary: "bg-white text-[var(--color-text)] ring-1 ring-black/10 hover:bg-stone-50",
  ghost: "bg-transparent text-[var(--color-text)] hover:bg-black/5",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
