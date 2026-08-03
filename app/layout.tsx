import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

/*
 * Tipografia: pilha de fontes do sistema de proposito. A fonte definitiva
 * entra na Fase 3 (identidade visual), junto da paleta. Evita tambem que o
 * build dependa de baixar fonte de terceiro.
 */

export const metadata: Metadata = {
  // PLACEHOLDER: titulo e descricao reais entram com o conteudo da clinica.
  title: {
    default: "Nome da Clinica (placeholder)",
    template: "%s | Nome da Clinica (placeholder)",
  },
  description:
    "Site institucional em construcao. Conteudo de placeholder ate a definicao do material real da clinica.",
  // Enquanto tudo e placeholder, o site nao pode ser indexado.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
