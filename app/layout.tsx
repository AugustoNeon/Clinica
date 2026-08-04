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
  // Titulo e descricao reais desde 2026-08-04 (questionario respondido).
  title: {
    default: "Dra. Ariane Vaz Storrer – Odontologia Clínica e Estética",
    template: "%s | Dra. Ariane Vaz Storrer – Odontologia Clínica e Estética",
  },
  description:
    "Odontologia clínica e estética em Araucária (PR), com atendimento humanizado e personalizado em todas as especialidades.",
  // O site segue fora dos indices ate ter as imagens reais da clinica.
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
