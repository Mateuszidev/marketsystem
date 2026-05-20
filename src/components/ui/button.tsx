import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-[var(--color-accent)] text-white shadow-[0_4px_16px_-4px_rgba(249,115,22,0.5)] hover:-translate-y-px hover:bg-[var(--color-accent-dark)] hover:shadow-[0_8px_24px_-6px_rgba(249,115,22,0.6)]",
  secondary: "bg-[var(--color-surface-alt)] text-[var(--color-text)] border border-[rgba(0,0,0,0.08)] hover:bg-white hover:border-[rgba(0,0,0,0.12)]",
  ghost: "bg-transparent text-[var(--color-brand)] hover:bg-[rgba(37,99,235,0.06)]",
  danger: "bg-[var(--color-brand)] text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.4)] hover:-translate-y-px hover:bg-[var(--color-brand-dark)]",
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center rounded-[var(--radius-pill)] px-5 py-3 text-sm font-bold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
