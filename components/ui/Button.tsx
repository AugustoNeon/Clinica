import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

const BASE =
  "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:opacity-90",
  secondary: "border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10",
};

/**
 * Classes do botao, para reaproveitar em `<Link>` sem duplicar estilo.
 * A paleta definitiva entra na Fase 3 (identidade visual da clinica).
 */
export function buttonClasses(variant: ButtonVariant = "primary", className = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
