export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
}

/*
 * Cores de estado do painel. Verde/ambar/vermelho sao semanticos (nao
 * fazem parte da paleta da marca, que e azul + terracota) e por isso so
 * aparecem aqui, em texto pequeno com fundo tintado — todos acima de
 * 4.5:1 sobre o proprio fundo.
 */
const TONES: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-800 ring-amber-600/25",
  danger: "bg-red-50 text-red-800 ring-red-600/20",
  info: "bg-surface-tint text-blue-dark ring-blue/30",
  neutral: "bg-surface-sunken text-ink-muted ring-ink/10",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
