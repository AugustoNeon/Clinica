import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Respiro lateral padrao de todas as paginas.
 *
 * O container ocupa quase toda a largura da tela: nao existe limite maximo de
 * largura, so um respiro lateral que cresce por breakpoint: 16px no mobile,
 * 24px a partir de `sm`, 32px a partir de `lg` e 48px a partir de `xl`.
 *
 * Decisao de 2026-08-04, validada com o usuario num comparador visual que
 * simulava varias larguras de tela: `max-w-5xl` (1024px) deixava vazio demais
 * nas laterais em telas grandes. O comportamento abaixo de `lg` nao mudou.
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 ${className}`}>{children}</div>
  );
}
