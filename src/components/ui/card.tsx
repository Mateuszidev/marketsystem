import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-3xl border border-black/8 bg-white/95 p-6 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.25)]", className)}
      {...props}
    />
  );
}
