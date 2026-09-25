import type { ReactNode } from "react";

interface AdminPanelProps {
  children: ReactNode;
  title?: string;
  description?: string;
  /** Acao no canto do cabecalho do painel (link "ver todas", botao...). */
  action?: ReactNode;
  className?: string;
  /** Sem padding interno — para listas que ja tem o proprio espacamento por linha. */
  flush?: boolean;
}

/**
 * Superficie branca do painel admin, sobre o fundo rebaixado do shell. O
 * cabecalho tem fundo levemente rebaixado (issue #71): o titulo do bloco
 * se destaca do conteudo sem precisar de linha grossa.
 */
export function AdminPanel({
  children,
  title,
  description,
  action,
  className = "",
  flush = false,
}: AdminPanelProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-md shadow-blue-deep/5 ${className}`}
    >
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 bg-surface-sunken/70 px-5 py-4">
          <div>
            {title && <h2 className="font-display text-lg font-medium">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}
