import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost" | "accent" | "outline-inverse";
export type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark";

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

/*
 * Cores da tabela do DESIGN.md. O primario e branco sobre `--blue-dark`, nao
 * sobre `--blue`: o rotulo do botao e `text-sm` (14px) `font-medium` (500), que
 * nao se qualifica como texto grande pelo WCAG (exige 18px normal ou 14px
 * bold/700+), entao vale o piso de 4.5:1 — branco sobre `--blue` da 3.3:1, e
 * sobre `--blue-dark` da 5.9:1 (par documentado no DESIGN.md). Mesmo raciocinio
 * do rodape. No hover o botao sobe 2px e ganha sombra da propria cor (so com
 * mouse: o `hover:` do Tailwind 4 ja ignora toque); no clique volta ao lugar.
 * O `transition-*` respeita `prefers-reduced-motion` pela regra global de globals.css.
 *
 * `inverse` e o par invertido para fundo azul (faixa de CTA, hero, rodape):
 * botao branco com texto `--blue-dark` (5.9:1, mesmo par ao contrario).
 * `outline-inverse` e o secundario sobre azul: borda e texto brancos.
 * `accent` e o terracota preenchido com tinta por cima (5.8:1) — a acao
 * secundaria "quente", nunca o WhatsApp (que e sempre azul, DESIGN.md).
 * `ghost` e o link-botao sem borda, para acao terciaria ao lado de um primario.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-dark text-white hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-lg hover:shadow-blue-dark/30 active:translate-y-0",
  secondary:
    "border border-ink/20 bg-surface text-ink hover:-translate-y-0.5 hover:border-blue hover:bg-surface-tint active:translate-y-0",
  inverse:
    "bg-surface text-blue-dark hover:-translate-y-0.5 hover:bg-surface-tint hover:shadow-lg hover:shadow-blue-deep/40 active:translate-y-0 focus-visible:outline-white",
  "outline-inverse":
    "border border-white/40 text-white hover:-translate-y-0.5 hover:border-white hover:bg-white/10 active:translate-y-0 focus-visible:outline-white",
  accent:
    "bg-terracotta text-ink hover:-translate-y-0.5 hover:brightness-95 hover:shadow-lg hover:shadow-terracotta/40 active:translate-y-0",
  ghost: "text-blue-dark hover:bg-surface-tint",
};

/** Classes do botao, para reaproveitar em `<Link>`/`<a>` sem duplicar estilo. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  className = "",
  size: ButtonSize = "md",
): string {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className, size)} {...props} />;
}
