import type { ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  id?: string;
}

/** Bloco vertical de pagina, com titulo e subtitulo opcionais. */
export function Section({ children, title, description, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`py-12 sm:py-16 ${className}`}>
      <Container>
        {(title || description) && (
          <header className="mb-8 max-w-2xl">
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            )}
            {description && <p className="mt-3 text-base opacity-80">{description}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
