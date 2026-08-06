import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Layout raiz da area `/admin` (Fase 5 PR2, issue #18).
 *
 * Passthrough deliberado: o shell de verdade (header com logout, checagem
 * de sessao redundante) vive em `app/admin/(protected)/layout.tsx`, que
 * NAO envolve `/admin/login` (route group evita loop de redirect).
 *
 * O header/footer publico (SiteHeader/SiteFooter) continua vindo do
 * RootLayout — Next.js so suporta multiplos root layout via route groups
 * top-level dedicados, refatoracao maior que nao entra neste PR.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
