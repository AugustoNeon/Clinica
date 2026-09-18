import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404 global: URL que nao bate com nenhuma rota. Renderiza so dentro do
 * layout raiz (sem grupo de rotas), por isso monta o header/rodape aqui
 * mesmo — o `notFound()` disparado dentro do site usa
 * `app/(site)/not-found.tsx`, que ja herda o chrome.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
