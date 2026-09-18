import type { ReactNode } from "react";
import { Container } from "./Container";

export type SectionTone = "default" | "tint" | "dark";

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  /** Fundo da faixa: branco (padrao), azul diluido ou azul solido com texto branco. */
  tone?: SectionTone;
  className?: string;
  id?: string;
}

const TONES: Record<SectionTone, string> = {
  default: "bg-surface",
  tint: "bg-surface-tint",
  dark: "bg-blue-dark text-white",
};

/**
 * Bloco vertical de pagina, com titulo e subtitulo opcionais.
 *
 * O respiro vertical cresce com a tela (DESIGN.md → Layout, "fluid spacing"):
 * 3.5rem no celular ate 6rem no desktop, para as secoes nao ficarem
 * coladas em tela grande nem espacadas demais no celular.
 */
export function Section({
  children,
  title,
  description,
  tone = "default",
  className = "",
  id,
}: SectionProps) {
  const muted = tone === "dark" ? "text-white/90" : "text-ink-muted";

  return (
    <section id={id} className={`py-14 sm:py-20 lg:py-24 ${TONES[tone]} ${className}`}>
      <Container>
        {(title || description) && (
          <header className="mb-10 max-w-2xl sm:mb-12">
            {title && (
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            )}
            {description && <p className={`mt-4 text-lg leading-relaxed ${muted}`}>{description}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
