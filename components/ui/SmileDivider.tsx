interface SmileDividerProps {
  /**
   * Cor do divisor via classe de texto (`text-surface`, `text-blue-deep`...):
   * o SVG usa `currentColor`, entao o divisor e pintado com a cor da secao
   * que vem DEPOIS dele (ou antes, se `flip`).
   */
  className?: string;
  /** Curva para cima (sorriso invertido) em vez de para baixo. */
  flip?: boolean;
}

/**
 * Transicao curva entre secoes (issue #71): a borda inferior de uma faixa
 * azul "sorri" para a secao seguinte. E o mesmo arco do logo esticado na
 * largura da tela — o motivo grafico do site aplicado a estrutura, nao um
 * "wave divider" generico. `preserveAspectRatio="none"` deixa a curva
 * acompanhar qualquer largura sem distorcer a altura fixa.
 */
export function SmileDivider({ className = "", flip = false }: SmileDividerProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      className={`block h-8 w-full sm:h-12 lg:h-[4.5rem] ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path d="M0 0c360 72 1080 72 1440 0v72H0Z" fill="currentColor" />
    </svg>
  );
}
