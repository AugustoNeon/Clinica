import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { IconArrowLeft } from "./icons";

interface PageHeroProps {
  title: string;
  /** Frase de apoio abaixo do titulo — uma ou duas linhas, sem parede de texto. */
  lead?: string;
  /** Link de volta (ex.: pagina de servico → lista de servicos). */
  back?: { href: string; label: string };
  /** Linha pequena acima do titulo — categoria ou contexto, nunca decorativa. */
  kicker?: string;
  children?: ReactNode;
}

/**
 * Abertura padrao das paginas internas: faixa azul diluida com h1 grande.
 * Da identidade a cada pagina sem repetir o hero da Home.
 */
export function PageHero({ title, lead, back, kicker, children }: PageHeroProps) {
  return (
    <div className="bg-surface-tint">
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          {back && (
            <Link
              href={back.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-dark underline-offset-4 hover:underline"
            >
              <IconArrowLeft width={16} height={16} />
              {back.label}
            </Link>
          )}
          {kicker && <p className={`text-sm font-medium text-terracotta-text ${back ? "mt-6" : ""}`}>{kicker}</p>}
          <h1
            className={`text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl ${
              back || kicker ? "mt-3" : ""
            }`}
          >
            {title}
          </h1>
          {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{lead}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </Container>
    </div>
  );
}
