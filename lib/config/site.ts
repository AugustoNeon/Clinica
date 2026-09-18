/**
 * URL pública canônica do site, sem barra final.
 *
 * Base de `metadataBase` (Open Graph, canonical), do `sitemap.xml` e do
 * `robots.txt`. Hoje é o subdomínio `*.workers.dev` do Cloudflare (única
 * hospedagem real desde 2026-08-10); quando o domínio próprio entrar
 * (issue #54), basta setar `NEXT_PUBLIC_SITE_URL` no ambiente — nenhum
 * outro arquivo precisa mudar.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://clinica-site.augustoneonvazryba.workers.dev";

/** Nome completo da clínica, como aparece no `<title>` e no Open Graph. */
export const SITE_NAME = "Dra. Ariane Vaz Storrer – Odontologia Clínica e Estética";

/** Versão curta, para o template de título das páginas internas e o manifest. */
export const SITE_SHORT_NAME = "Dra. Ariane Vaz Storrer";

/** Descrição padrão (meta description e Open Graph) — texto do questionário da cliente. */
export const SITE_DESCRIPTION =
  "Odontologia clínica e estética em Araucária (PR), com atendimento humanizado e personalizado em todas as especialidades.";
