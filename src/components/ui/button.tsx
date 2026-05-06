import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-[var(--color-accent)] text-white shadow-[0_16px_28px_-22px_rgba(249,115,22,0.95)] hover:-translate-y-px hover:bg-[var(--color-accent-dark)]",
  secondary: "bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]",
  ghost: "bg-transparent text-[var(--color-brand)] hover:bg-[rgba(37,99,235,0.08)]",
  danger: "bg-[var(--color-brand)] text-white shadow-[0_16px_28px_-22px_rgba(37,99,235,0.75)] hover:-translate-y-px hover:bg-[var(--color-brand-dark)]",
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
