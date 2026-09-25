import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { IconArrowLeft } from "./icons";
import { SmileDivider } from "./SmileDivider";

interface PageHeroProps {
  title: string;
  /** Frase de apoio abaixo do titulo — uma ou duas linhas, sem parede de texto. */
  lead?: string;
  /** Link de volta (ex.: pagina de servico → lista de servicos). */
  back?: { href: string; label: string };
  /** Linha pequena acima do titulo — categoria ou contexto, nunca decorativa. */
  kicker?: string;
  /** Botoes abaixo do lead (usar as variantes `inverse`/`outline-inverse`: o fundo e azul). */
  children?: ReactNode;
  /** Elemento visual a direita do texto (icone grande, foto...), opcional. */
  visual?: ReactNode;
}

type Vars = React.CSSProperties;

/**
 * Abertura padrao das paginas internas: faixa azul profunda com h1 grande,
 * a textura de arcos da marca e o arco do sorriso sob o titulo (issue #71).
 * Da identidade a cada pagina sem repetir o hero da Home — e sorri para a
 * secao seguinte pelo divisor curvo.
 */
export function PageHero({ title, lead, back, kicker, children, visual }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-blue-deep text-white">
      <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="drift pointer-events-none absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-blue-dark/80 blur-3xl"
        style={{ "--drift-from": "0px", "--drift-to": "-60px" } as Vars}
      />
      <Container className="relative grid items-center gap-10 pb-14 pt-12 sm:pb-16 sm:pt-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:pb-20 lg:pt-20">
        <div className="max-w-3xl">
          {back && (
            <Link
              href={back.href}
              className="rise-in inline-flex items-center gap-1.5 text-sm font-medium text-blue-glow underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <IconArrowLeft width={16} height={16} />
              {back.label}
            </Link>
          )}
          {kicker && (
            <p className={`rise-in text-sm font-medium text-terracotta-soft ${back ? "mt-6" : ""}`}>{kicker}</p>
          )}
          <h1
            className={`rise-in text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl ${
              back || kicker ? "mt-3" : ""
            }`}
            style={{ "--rise-delay": "60ms" } as Vars}
          >
            {title}
          </h1>
          <svg aria-hidden viewBox="0 0 240 40" className="mt-3 h-5 w-36 text-terracotta-soft sm:w-44" fill="none">
            <path
              className="smile-arc"
              d="M8 8c40 34 184 34 224 0"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1}
            />
          </svg>
          {lead && (
            <p
              className="rise-in mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
              style={{ "--rise-delay": "140ms" } as Vars}
            >
              {lead}
            </p>
          )}
          {children && (
            <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ "--rise-delay": "220ms" } as Vars}>
              {children}
            </div>
          )}
        </div>
        {visual && <div className="rise-in relative hidden lg:block" style={{ "--rise-delay": "120ms" } as Vars}>{visual}</div>}
      </Container>
      <SmileDivider className="relative text-surface" />
    </div>
  );
}
