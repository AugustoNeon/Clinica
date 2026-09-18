"use client";

import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Último recurso: só aparece quando o PRÓPRIO layout raiz falha (por
 * exemplo, header/footer sem conseguir ler o banco). Precisa renderizar
 * `<html>`/`<body>` sozinho e não pode importar nada que dependa de dado.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-ink">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            O site está indisponível agora
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Estamos com uma instabilidade. Tente de novo em instantes — e, se
            precisar falar com a clínica, o telefone e o WhatsApp continuam
            funcionando normalmente.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-dark px-5 py-2.5 text-sm font-medium text-white hover:brightness-90"
          >
            Tentar de novo
          </button>
          {error.digest && (
            <p className="mt-6 text-xs text-ink-muted">
              Código do erro: <code>{error.digest}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
