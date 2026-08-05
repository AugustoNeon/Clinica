import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

const BASE =
  "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark";

/*
 * Cores da tabela do DESIGN.md. O primario e branco sobre `--blue-dark`, nao
 * sobre `--blue`: o rotulo do botao e `text-sm` (14px) `font-medium` (500), que
 * nao se qualifica como texto grande pelo WCAG (exige 18px normal ou 14px
 * bold/700+), entao vale o piso de 4.5:1 — branco sobre `--blue` da 3.3:1, e
 * sobre `--blue-dark` da 5.9:1 (par documentado no DESIGN.md). Mesmo raciocinio
 * do rodape. O hover/active escurece por `brightness` em vez de trocar de token:
 * nao existe `--blue-darker` e clarear reabriria o problema de contraste. O
 * `transition-*` respeita `prefers-reduced-motion` pela regra global de globals.css.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-blue-dark text-white hover:brightness-90 active:brightness-90",
  secondary: "border border-ink/20 text-ink hover:bg-surface-tint hover:border-blue",
};

/** Classes do botao, para reaproveitar em `<Link>` sem duplicar estilo. */
export function buttonClasses(variant: ButtonVariant = "primary", className = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
