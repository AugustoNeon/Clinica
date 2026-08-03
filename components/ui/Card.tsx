import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Superficie basica de conteudo (servico, membro da equipe, post). */
export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-black/10 p-6 dark:border-white/15 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-medium">{children}</h3>;
}

export function CardBody({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed opacity-80">{children}</p>;
}
