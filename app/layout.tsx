import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME, SITE_URL } from "@/lib/config/site";
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
  // `metadataBase` transforma as URLs relativas de Open Graph/canonical em
  // absolutas (obrigatorio para preview de link no WhatsApp/Instagram).
  metadataBase: new URL(SITE_URL),
  // Titulo e descricao reais desde 2026-08-04 (questionario respondido). O
  // template das paginas internas usa o nome curto: "Serviços | Dra. Ariane
  // Vaz Storrer" cabe na aba e no resultado de busca; o nome completo
  // (64 caracteres) so entra no titulo da Home.
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_SHORT_NAME,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  // Indexacao liberada em 2026-08-12 (issue #52): o conteudo institucional
  // ja e real (nome, endereco, servicos, equipe) desde a Fase 5 PR1 -
  // decisao do usuario de nao esperar as fotos pendentes (#10) pra
  // indexar. `/admin` continua noindex (override proprio em
  // app/admin/layout.tsx, o Metadata de rota filha vence o da raiz).
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Cor da barra do navegador no celular: azul da marca em tom AA.
  themeColor: "#1d6a96",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
