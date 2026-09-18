interface TrustStripProps {
  insurance: string;
  serviceCount: number;
  openingHours?: string;
}

/**
 * Faixa de fatos logo abaixo do hero (issue #65; ticker na #71). Cada item
 * e um FATO confirmado pela clinica (questionario 2026-08-04/05 e
 * AGENTS.md), nunca numero inflado — "mostrar, nao prometer" (PRODUCT.md,
 * principio 2).
 *
 * Terracota cheio com tinta por cima (5.8:1): e o unico lugar da Home em
 * que o acento ocupa uma faixa inteira — a "alegria" da marca em cor. Os
 * itens andam em loop continuo (`.ticker` em globals.css), separados pelo
 * arco do sorriso; com `prefers-reduced-motion` a faixa para e quebra em
 * linhas, e a copia do loop some.
 */
export function TrustStrip({ insurance, serviceCount, openingHours }: TrustStripProps) {
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
    <div className="bg-terracotta text-ink">
      <div className="ticker py-4 sm:py-5">
        <ul className="ticker-track items-center gap-x-10 gap-y-3 px-4 sm:gap-x-14" aria-label="Fatos sobre a clínica">
          {loop.map((item, index) => {
            const copy = index >= items.length;
            return (
              <li
                key={`${item}-${index}`}
                aria-hidden={copy || undefined}
                className={`flex items-center gap-4 sm:gap-5 ${copy ? "ticker-copy" : ""}`}
              >
                <svg aria-hidden viewBox="0 0 24 12" className="h-3 w-6 shrink-0 text-ink/70" fill="none">
                  <path d="M2 2c5 10 15 10 20 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span className="whitespace-nowrap font-display text-lg font-medium sm:text-xl">{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
