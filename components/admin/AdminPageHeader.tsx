import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowLeft } from "@/components/ui/icons";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /** Botoes/links a direita do titulo (ex.: "Novo serviço"). */
  actions?: ReactNode;
  /** Link de volta para a listagem, nas telas de criar/editar. */
  back?: { href: string; label: string };
}

/** Cabecalho padrao das telas do painel: titulo, contexto e acoes principais. */
export function AdminPageHeader({ title, description, actions, back }: AdminPageHeaderProps) {
  return (
    <header className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-dark underline-offset-4 hover:underline"
        >
          <IconArrowLeft width={16} height={16} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-2 text-base leading-relaxed text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
