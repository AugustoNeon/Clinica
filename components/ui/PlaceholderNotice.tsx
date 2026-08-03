import type { ReactNode } from "react";

interface PlaceholderNoticeProps {
  children?: ReactNode;
}

/**
 * Aviso visivel de conteudo provisorio.
 *
 * Todo texto do site hoje e placeholder: o conteudo real depende das
 * respostas do questionario da cliente. Este componente existe para que
 * ninguem (cliente, dev, revisor) confunda placeholder com conteudo
 * aprovado. Some do codigo quando o conteudo real entrar.
 */
export function PlaceholderNotice({ children }: PlaceholderNoticeProps) {
  return (
    <div className="rounded-lg border border-dashed border-amber-500/60 bg-amber-500/10 p-4 text-sm">
      <p className="font-semibold uppercase tracking-wide">Conteudo de placeholder</p>
      <p className="mt-1 opacity-90">
        {children ??
          "Nada nesta pagina e conteudo definitivo. Textos, nomes e dados sao provisorios e serao substituidos pelo material real da clinica."}
      </p>
    </div>
  );
}
