import type { ReactNode } from "react";
import { IconAlert, IconCheck } from "@/components/ui/icons";

type NoticeTone = "success" | "error" | "warning" | "info";

interface NoticeProps {
  children: ReactNode;
  tone?: NoticeTone;
  title?: string;
  className?: string;
}

const TONES: Record<NoticeTone, { box: string; icon: ReactNode }> = {
  // Verde aqui e cor de estado (sucesso), nao acento de marca.
  success: {
    box: "border-emerald-600/30 bg-emerald-50 text-emerald-900", // avoid-ai-design-ignore: SD8
    icon: <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-emerald-700" />,
  },
  error: {
    box: "border-red-600/30 bg-red-50 text-red-900",
    icon: <IconAlert width={18} height={18} className="mt-0.5 shrink-0 text-red-700" />,
  },
  warning: {
    box: "border-amber-600/30 bg-amber-50 text-amber-900",
    icon: <IconAlert width={18} height={18} className="mt-0.5 shrink-0 text-amber-700" />,
  },
  info: {
    box: "border-blue/30 bg-surface-tint text-ink",
    icon: null,
  },
};

/** Aviso inline (sucesso de salvar, erro de validacao, alerta LGPD...). */
export function Notice({ children, tone = "info", title, className = "" }: NoticeProps) {
  const { box, icon } = TONES[tone];
  const role = tone === "error" ? "alert" : "status";
  return (
    <div role={role} className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${box} ${className}`}>
      {icon}
      <div>
        {title && <p className="font-medium">{title}</p>}
        <div className={title ? "mt-0.5" : ""}>{children}</div>
      </div>
    </div>
  );
}
