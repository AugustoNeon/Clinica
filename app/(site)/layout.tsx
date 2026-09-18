import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

/**
 * Chrome do site publico (issue #67): header + rodape + link "pular para
 * o conteudo". Vive no grupo de rotas `(site)` para que `/admin` tenha o
 * shell proprio (barra lateral) sem herdar o menu publico — antes o
 * painel renderizava DENTRO do header/rodape do site.
 *
 * O `<html>`/`<body>`, fontes e metadata continuam em `app/layout.tsx`.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
