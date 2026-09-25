import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME, SITE_URL } from "@/lib/config/site";
import "./globals.css";

/*
 * Tipografia (DESIGN.md, issue #73): Bricolage Grotesque nos titulos (eixo de
 * tamanho optico + peso) e Lexend no texto (desenhada para facilitar a
 * leitura, com zero comum nos telefones e horarios). Trocou
 * Fraunces + Inter, que as skills de revisao anti-IA apontam como a dupla
 * padrao de sites gerados. Self-hosted com `next/font/local` a partir dos
 * .woff2 versionados em `app/fonts/` (licencas OFL ao lado): o build nao
 * depende de rede de terceiro (decisao de 2026-08-03).
 */
const heading = localFont({
  src: "./fonts/BricolageGrotesque-Variable.woff2",
  variable: "--font-heading",
  weight: "200 800",
  display: "swap",
});

const body = localFont({
  src: "./fonts/Lexend-Variable.woff2",
  variable: "--font-body",
  weight: "100 900",
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
  themeColor: "#0067ab",
};

/**
 * Layout raiz: so `<html>`/`<body>`, fontes, metadata e CSS global. O
 * chrome do site publico esta em `app/(site)/layout.tsx`; o shell do
 * painel, em `app/admin/(protected)/layout.tsx` (issue #67).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${body.variable} ${heading.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
