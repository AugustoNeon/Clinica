import type { ReactNode } from "react";
import { AdminPageHeader } from "./AdminPageHeader";

interface EditorLayoutProps {
  title: string;
  description?: string;
  back: { href: string; label: string };
  /** O formulario. */
  children: ReactNode;
  /** Coluna lateral: dicas, link "ver no site", zona de perigo. */
  aside?: ReactNode;
  actions?: ReactNode;
}

/** Tela de criar/editar: formulario a esquerda, contexto e acoes perigosas a direita. */
export function EditorLayout({ title, description, back, children, aside, actions }: EditorLayoutProps) {
  return (
    <div>
      <AdminPageHeader title={title} description={description} back={back} actions={actions} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <div>{children}</div>
        {aside && <div className="grid gap-4 lg:sticky lg:top-8">{aside}</div>}
      </div>
    </div>
  );
}

interface TipsProps {
  title?: string;
  items: ReactNode[];
}

/** Painel de dicas curtas na coluna lateral do editor. */
export function Tips({ title = "Dicas", items }: TipsProps) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm shadow-ink/5">
      <h2 className="font-display text-base font-medium">{title}</h2>
      <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-muted">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2.5">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface DangerZoneProps {
  children: ReactNode;
  text?: string;
}

/** Painel de acoes destrutivas, separado do resto para nao virar clique acidental. */
export function DangerZone({ children, text }: DangerZoneProps) {
  return (
    <section className="rounded-2xl border border-red-600/20 bg-surface p-5">
      <h2 className="font-display text-base font-medium text-red-800">Zona de perigo</h2>
      {text && <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{text}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}
