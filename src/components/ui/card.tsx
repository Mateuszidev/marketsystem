import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("card shadow-[0_18px_34px_-24px_rgba(169,30,30,0.22)]", className)}
      {...props}
    />
  );
}
