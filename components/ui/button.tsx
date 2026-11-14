import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-5 py-3 font-display text-base font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-ink",
  secondary: "border-2 border-ink text-ink hover:bg-ink hover:text-bg",
  // On a dark ground (the lake on the home screen).
  inverse: "border-b-4 border-accent bg-bg text-ink hover:bg-accent hover:text-accent-ink",
  ghost: "text-ink underline underline-offset-4 hover:text-accent",
};

// One primary button per view.
export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
