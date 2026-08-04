import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isDev = process.env.NODE_ENV === "development";

// Da acesso a bindings do wrangler.jsonc (ex.: env vars) durante `next dev`.
// So afeta o servidor de desenvolvimento local; nao muda o build de producao.
initOpenNextCloudflareForDev();

/**
 * Content-Security-Policy — checklist de seguranca do PLANEJAMENTO.md (secao 6).
 *
 * LIMITACAO CONHECIDA: `script-src` e `style-src` precisam de
 * 'unsafe-inline' porque o Next.js injeta script e estilo inline no
 * streaming do App Router. O endurecimento correto e CSP por NONCE gerado
 * em middleware, tarefa da Fase 7 (seguranca e performance) — nao da para
 * fechar antes de saber quais terceiros o site realmente carrega.
 *
 * QUANDO ENTRAREM OS TERCEIROS, liberar explicitamente:
 * - Cloudflare Turnstile: `https://challenges.cloudflare.com` em script-src e frame-src
 * - Supabase Storage/API:  `https://<projeto>.supabase.co` em connect-src e img-src
 * - Google Maps embed:     `https://www.google.com` em frame-src
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Redundante com frame-ancestors do CSP, mas cobre navegador antigo.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // HSTS: a hospedagem ja forca HTTPS, mas o cabecalho precisa ser validado
  // em producao (PLANEJAMENTO.md secao 6). `preload` so depois de confirmar
  // que TODOS os subdominios servem HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // O otimizador padrao do next/image e Vercel-only. Nenhum componente usa
    // next/image hoje (site ainda e placeholder) — desligar aqui evita que o
    // primeiro uso quebre em producao no Cloudflare Workers. Reavaliar loader
    // customizado (Cloudflare Images) so quando houver volume real de imagem.
    unoptimized: true,
  },
};

export default nextConfig;
