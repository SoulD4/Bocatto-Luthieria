import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type Variant = "solid" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3 text-sm tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  solid:
    "bg-gradient-to-br from-gold-light via-gold to-gold-deep text-ink font-medium hover:brightness-110 hover:shadow-[0_6px_30px_rgba(201,162,39,0.28)] hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-gold/60 text-gold hover:bg-gold/10 hover:border-gold hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-cream/80 hover:text-gold-light",
};

export function ButtonLink({
  variant = "solid",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; className?: string }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function Button({
  variant = "solid",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
