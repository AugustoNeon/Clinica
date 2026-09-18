"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

interface TiltFrameProps {
  children: ReactNode;
  className?: string;
  /** Inclinacao maxima, em graus. Pouco: e profundidade, nao brinquedo. */
  max?: number;
}

/**
 * Moldura com leve inclinacao 3D seguindo o mouse + brilho que acompanha o
 * ponteiro (variaveis CSS `--tilt-*`/`--glare-*`, estilos em globals.css).
 *
 * So reage a mouse (`pointerType === "mouse"`): no toque nao faz nada, e
 * com `prefers-reduced-motion` a transicao e instantanea pela regra global
 * — o efeito vira "nenhum". Sem JS, e uma div comum: nada depende dele.
 */
export function TiltFrame({ children, className = "", max = 6 }: TiltFrameProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--tilt-x", `${(-y * max).toFixed(2)}deg`);
    element.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
    element.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    element.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    element.style.setProperty("--glare-opacity", "1");
  }

  function reset() {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--tilt-x", "0deg");
    element.style.setProperty("--tilt-y", "0deg");
    element.style.setProperty("--glare-opacity", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={`tilt ${className}`}
    >
      {children}
    </div>
  );
}
