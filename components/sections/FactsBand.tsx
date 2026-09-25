"use client";

import { useEffect, useRef, useState } from "react";
import { IconWhatsApp } from "@/components/ui/icons";

interface FactsBandProps {
  /** Fatos confirmados pela clinica, na ordem de exibicao. */
  facts: string[];
  /** Numero do WhatsApp exibido no botao de urgencia. */
  whatsapp: string;
  /** Link do WhatsApp ja montado (mensagem de urgencia). */
  whatsappHref: string | null;
}

/** Segundos por fato: mantem a velocidade constante, com poucos ou muitos fatos. */
const SECONDS_PER_FACT = 6;

/**
 * Faixa coral logo abaixo do hero (issue #71; volta otimizada na #73 a
 * pedido do usuario, que gostava do movimento).
 *
 * Os fatos correm em loop (conteudo duplicado, a segunda copia
 * `aria-hidden`) e o botao de urgencia com o WhatsApp fica parado ao lado:
 * a informacao mais util nao anda. Otimizacoes em relacao a versao antiga:
 * - pausa sem botao visivel (o usuario achou que o botao enfeiava a faixa):
 *   para com o mouse em cima, com um toque (toque de novo retoma) e com o
 *   foco do teclado (a faixa entra na ordem de Tab). Com isso o requisito
 *   de pausar movimento automatico (WCAG 2.2.2) continua atendido;
 * - pausa sozinha quando a faixa sai da tela (IntersectionObserver), para
 *   nao gastar bateria animando o que ninguem ve;
 * - duracao proporcional ao numero de fatos: velocidade constante;
 * - so `transform` animado (compositor), nada de layout.
 * Com `prefers-reduced-motion` a faixa fica parada e quebra em linhas
 * (regras em globals.css).
 *
 * Fonte: Lexend (a do texto) em peso medio, nao a dos titulos: numa faixa
 * que anda, letra mais simples se le melhor.
 *
 * Coral cheio com tinta por cima (6.1:1).
 */
export function FactsBand({ facts, whatsapp, whatsappHref }: FactsBandProps) {
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(band);
    return () => observer.disconnect();
  }, []);

  if (facts.length === 0) return null;
  const loop = [...facts, ...facts];

  return (
    <div ref={bandRef} className="bg-terracotta text-ink">
      <div className="flex flex-col gap-3 py-4 sm:py-5 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex min-w-0 flex-1 items-center">
          <div
            className="ticker min-w-0 flex-1 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
            role="group"
            aria-label="Fatos sobre a clínica. Toque ou pressione Enter para pausar."
            tabIndex={0}
            onClick={() => setPaused((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setPaused((current) => !current);
              }
            }}
            data-paused={paused || undefined}
            data-offscreen={offscreen || undefined}
            style={{ "--ticker-duration": `${facts.length * SECONDS_PER_FACT}s` } as React.CSSProperties}
          >
            <ul className="ticker-track items-center gap-x-10 gap-y-2 px-4 sm:gap-x-14">
              {loop.map((fact, index) => {
                const copy = index >= facts.length;
                return (
                  <li
                    key={`${fact}-${index}`}
                    aria-hidden={copy || undefined}
                    className={`flex items-center gap-4 sm:gap-5 ${copy ? "ticker-copy" : ""}`}
                  >
                    <svg aria-hidden viewBox="0 0 24 12" className="h-3 w-6 shrink-0 text-ink/70" fill="none">
                      <path d="M2 2c5 10 15 10 20 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span className="whitespace-nowrap text-base font-medium tracking-[0.01em] sm:text-lg">{fact}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Urgência pelo WhatsApp: ${whatsapp}`}
            className="mx-4 inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-base font-semibold text-surface transition-colors ease-out hover:bg-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:mx-6 lg:mx-0 lg:mr-8 lg:self-auto xl:mr-12"
          >
            <IconWhatsApp width={20} height={20} />
            <span>
              Urgência: <span className="whitespace-nowrap">{whatsapp}</span>
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
