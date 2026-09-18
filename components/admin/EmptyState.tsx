import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  text?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

/** Estado vazio de lista: diz o que falta e oferece o proximo passo. */
export function EmptyState({ title, text, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {icon && (
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-tint text-blue-dark">
          {icon}
        </span>
      )}
      <p className="font-display text-xl font-medium">{title}</p>
      {text && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
