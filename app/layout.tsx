import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

/*
 * Tipografia (DESIGN.md): Fraunces nos titulos, Inter no corpo. Self-hosted
 * com `next/font/local` a partir dos .woff2 versionados em `app/fonts/` — o
 * build continua sem depender de rede de terceiro, que era a objecao que
 * tinha barrado `next/font/google` em 2026-08-03.
 */
const fraunces = localFont({
  src: "./fonts/Fraunces-Variable.woff2",
  variable: "--font-fraunces",
  weight: "400 700",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  // Titulo e descricao reais desde 2026-08-04 (questionario respondido).
  title: {
    default: "Dra. Ariane Vaz Storrer – Odontologia Clínica e Estética",
    template: "%s | Dra. Ariane Vaz Storrer – Odontologia Clínica e Estética",
  },
  description:
    "Odontologia clínica e estética em Araucária (PR), com atendimento humanizado e personalizado em todas as especialidades.",
  // Indexacao liberada em 2026-08-12 (issue #52): o conteudo institucional
  // ja e real (nome, endereco, servicos, equipe) desde a Fase 5 PR1 -
  // decisao do usuario de nao esperar as fotos pendentes (#10) pra
  // indexar. `/admin` continua noindex (override proprio em
  // app/admin/layout.tsx, o Metadata de rota filha vence o da raiz).
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
