import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "@/components/ui/icons";

interface ListRowProps {
  /** Rota de edicao — o titulo inteiro vira link. */
  href: string;
  title: string;
  /** Linha secundaria: slug, cargo, telefone... */
  meta?: ReactNode;
  /** Badges de status, a direita do titulo. */
  badges?: ReactNode;
  /** Acoes extras (link "ver no site", botao de excluir...). */
  actions?: ReactNode;
  /** Bloco a esquerda (avatar, data grande...). */
  leading?: ReactNode;
}

/** Linha padrao das listagens do painel: titulo clicavel, meta, badges e acoes. */
export function ListRow({ href, title, meta, badges, actions, leading }: ListRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 sm:flex-nowrap">
      {leading}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={href}
            className="font-medium text-ink underline-offset-4 hover:text-blue-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
          >
            {title}
          </Link>
          {badges}
        </div>
        {meta && <div className="mt-0.5 text-sm text-ink-muted">{meta}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {actions}
        <Link
          href={href}
          aria-label={`Editar ${title}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors ease-out hover:bg-surface-sunken hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
        >
          <IconArrowRight width={18} height={18} />
        </Link>
      </div>
    </li>
  );
}
