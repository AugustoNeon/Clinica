import type { SiteSetting } from "@/types";

/**
 * Camada de dados de `site_settings` (endereco, telefone, horario, redes).
 *
 * IMPLEMENTACAO ATUAL: dados em memoria — ver o comentario de cabecalho de
 * `lib/data/services.ts` para o contrato de substituicao por Supabase.
 *
 * CONTEUDO: dados REAIS, vindos do questionario respondido pela cliente em
 * 2026-08-04 e completados por ela em 2026-08-05 (mapa, convenio, formas de
 * pagamento e o numero de WhatsApp correto — antes estava duplicando o
 * telefone fixo por engano). `facebook_url` segue vazio de proposito: a
 * clinica nao tem esse link e nada plausivel pode ser inventado aqui.
 * `opening_hours` traz so a faixa de horario porque os dias da semana nao
 * foram informados.
 */

const SITE_SETTINGS: SiteSetting[] = [
  { key: "clinic_name", value: "Dra. Ariane Vaz Storrer – Odontologia Clínica e Estética" },
  { key: "clinic_tagline", value: "Te ajudo a sorrir com confiança" },
  { key: "address", value: "Rua Pedro Druszcz, 195 — Araucária, PR" },
  { key: "phone", value: "(41) 3031-6454" },
  { key: "whatsapp", value: "(41) 99998-1033" },
  { key: "email", value: "arianevstorrer@gmail.com" },
  { key: "opening_hours", value: "09h00 às 19h00" },
  { key: "instagram_url", value: "https://instagram.com/arianevstorrer" },
  { key: "facebook_url", value: "" },
  { key: "maps_url", value: "https://maps.app.goo.gl/gYf86VX6W6BLMug59" },
  // URL de embed do Google Maps (iframe). Precisa do `frame-src
  // https://www.google.com` liberado no CSP de `next.config.ts`.
  {
    key: "maps_embed_url",
    value:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5476.634405728805!2d-49.39740764909308!3d-25.58935385739973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dd03d097843589%3A0xe9bc058baf9783d8!2sConsult%C3%B3rio%20Odontol%C3%B3gico%20Ariane%20Vaz%20Storrer!5e1!3m2!1spt-BR!2sbr!4v1785946063105!5m2!1spt-BR!2sbr",
  },
  { key: "payment_methods", value: "Dinheiro, Pix, Cartão (débito e crédito)" },
  { key: "insurance", value: "SINTRACIMENTO" },
];

/** Todas as configuracoes institucionais. */
export async function getSiteSettings(): Promise<SiteSetting[]> {
  return SITE_SETTINGS;
}

/**
 * Configuracoes como mapa `key -> value`, formato mais comodo para layout
 * e rodape do que percorrer a lista.
 */
export async function getSiteSettingsMap(): Promise<Record<string, string>> {
  const settings = await getSiteSettings();
  return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
}

/** Uma configuracao pela chave, ou `null` se nao existir. */
export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const settings = await getSiteSettings();
  return settings.find((setting) => setting.key === key) ?? null;
}
