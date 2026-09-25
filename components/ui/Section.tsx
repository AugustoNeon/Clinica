import type { ReactNode } from "react";
import { Container } from "./Container";

export type SectionTone = "default" | "tint" | "dark" | "deep";

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  /** Fundo da faixa: branco (padrao), azul diluido, azul escuro ou azul profundo com texto branco. */
  tone?: SectionTone;
  className?: string;
  id?: string;
}

const TONES: Record<SectionTone, string> = {
  default: "bg-surface",
  tint: "bg-surface-tint",
  dark: "bg-blue-dark text-white",
  deep: "bg-blue-deep text-white",
};

/**
 * Bloco vertical de pagina, com titulo e subtitulo opcionais.
 *
 * O respiro vertical cresce com a tela (DESIGN.md → Layout, "fluid spacing"):
 * 3.5rem no celular ate 6rem no desktop, para as secoes nao ficarem
 * coladas em tela grande nem espacadas demais no celular. Os tons escuros
 * recebem a textura de arcos da marca por cima do fundo (issue #71).
 */
export function Section({
  children,
  title,
  description,
  tone = "default",
  className = "",
  id,
}: SectionProps) {
  const onDark = tone === "dark" || tone === "deep";
  const muted = onDark ? "text-white/90" : "text-ink-muted";

  return (
    <section id={id} className={`relative py-14 sm:py-20 lg:py-24 ${TONES[tone]} ${className}`}>
      {onDark && <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />}
      <Container className="relative">
        {(title || description) && (
          <header className="mb-10 max-w-2xl sm:mb-12">
            {title && (
              <h2 className={`text-3xl font-bold sm:text-4xl ${onDark ? "text-white" : ""}`}>
                {title}
              </h2>
            )}
            {description && <p className={`mt-4 text-lg leading-relaxed ${muted}`}>{description}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
