"use client";

import { useState } from "react";

interface TrustStripProps {
  insurance: string;
  serviceCount: number;
  openingHours?: string;
}

/** Quantos fatos aparecem no celular, onde a faixa fica parada e quebra em linhas. */
const MOBILE_LIMIT = 4;

/**
 * Faixa de fatos logo abaixo do hero (issue #65; ticker na #71). Cada item
 * e um FATO confirmado pela clinica (questionario 2026-08-04/05 e
 * AGENTS.md), nunca numero inflado — "mostrar, nao prometer" (PRODUCT.md,
 * principio 2).
 *
 * Terracota cheio com tinta por cima (5.8:1). No desktop os itens andam em
 * loop (`.ticker` em globals.css) e o botao a direita pausa/retoma — WCAG
 * 2.2.2 pede controle para movimento automatico de mais de 5 s; pausar so
 * no hover nao atende toque nem teclado. No celular e com
 * `prefers-reduced-motion` a faixa fica parada, quebra em linhas e mostra
 * so os primeiros fatos.
 */
export function TrustStrip({ insurance, serviceCount, openingHours }: TrustStripProps) {
  const [paused, setPaused] = useState(false);

  const items = [
    "Uma profissional, do início ao fim",
    `${serviceCount} especialidades em um só lugar`,
    "Urgências pelo WhatsApp",
    insurance ? `Particular e convênio ${insurance}` : "Atendimento particular",
    "Pix, dinheiro, débito e crédito",
    openingHours ? `Atendimento ${openingHours}` : null,
    "Araucária, PR",
  ].filter((item): item is string => Boolean(item));

  const loop = [...items, ...items];

  return (
    <div className="relative bg-terracotta text-ink">
      <div className="ticker py-4 sm:py-5 sm:pr-16" data-paused={paused || undefined}>
        <ul className="ticker-track items-center gap-x-10 gap-y-2 px-4 sm:gap-x-14" aria-label="Fatos sobre a clínica">
          {loop.map((item, index) => {
            const copy = index >= items.length;
            const beyondMobile = !copy && index >= MOBILE_LIMIT;
            return (
              <li
                key={`${item}-${index}`}
                aria-hidden={copy || undefined}
                className={`flex items-center gap-4 sm:gap-5 ${copy ? "ticker-copy" : ""} ${
                  beyondMobile ? "max-sm:hidden" : ""
                }`}
              >
                <svg aria-hidden viewBox="0 0 24 12" className="h-3 w-6 shrink-0 text-ink/70" fill="none">
                  <path d="M2 2c5 10 15 10 20 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span className="font-display text-base font-medium sm:whitespace-nowrap sm:text-xl">{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((current) => !current)}
        aria-pressed={paused}
        aria-label={paused ? "Retomar a faixa de fatos" : "Pausar a faixa de fatos"}
        className="ticker-toggle absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/10 text-ink transition-colors ease-out hover:bg-ink/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:inline-flex"
      >
        {paused ? (
          <svg aria-hidden viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
          </svg>
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1.25" />
            <rect x="14" y="5" width="4" height="14" rx="1.25" />
          </svg>
        )}
      </button>
    </div>
  );
}
