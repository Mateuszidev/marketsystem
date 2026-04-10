import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-[var(--color-accent)] text-[var(--color-brand-dark)] shadow-[0_3px_0_var(--color-accent-dark)] hover:-translate-y-px hover:shadow-[0_5px_0_var(--color-accent-dark)]",
  secondary: "bg-white text-[var(--color-text)] border-2 border-[rgba(0,0,0,0.08)] hover:bg-[var(--color-surface-alt)]",
  ghost: "bg-transparent text-[var(--color-brand)] hover:bg-[rgba(217,43,43,0.07)]",
  danger: "bg-[var(--color-brand)] text-white shadow-[0_3px_0_#7f1717] hover:-translate-y-px hover:shadow-[0_5px_0_#7f1717]",
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center rounded-[var(--radius-pill)] px-5 py-3 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
