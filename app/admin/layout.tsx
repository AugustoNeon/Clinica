import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Layout raiz da area `/admin` (Fase 5 PR2, issue #18; shell proprio desde
 * a issue #67).
 *
 * Passthrough deliberado: o shell de verdade (barra lateral, checagem de
 * sessao redundante) vive em `app/admin/(protected)/layout.tsx`, que NAO
 * envolve `/admin/login` nem `/admin/mfa` (route group evita loop de
 * redirect). Desde a #67 o painel nao herda mais o header/rodape do site
 * publico: esse chrome ficou em `app/(site)/layout.tsx`.
 */
export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-surface-sunken">{children}</div>;
}
