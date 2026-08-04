import type { SiteSetting } from "@/types";

/**
 * Camada de dados de `site_settings` (endereco, telefone, horario, redes).
 *
 * IMPLEMENTACAO ATUAL: dados em memoria — ver o comentario de cabecalho de
 * `lib/data/services.ts` para o contrato de substituicao por Supabase.
 *
 * CONTEUDO: dados REAIS, vindos do questionario respondido pela cliente em
 * 2026-08-04. `facebook_url` e `maps_url` seguem vazios de proposito: a
 * clinica nao informou esses links e nada plausivel pode ser inventado aqui.
 * `opening_hours` traz so a faixa de horario porque os dias da semana nao
 * foram informados.
 */

const SITE_SETTINGS: SiteSetting[] = [
  { key: "clinic_name", value: "Dra. Ariane Vaz Storrer – Odontologia Clínica e Estética" },
  { key: "clinic_tagline", value: "Te ajudo a sorrir com confiança" },
  { key: "address", value: "Rua Pedro Druszcz, 195 — Araucária, PR" },
  { key: "phone", value: "(41) 3031-6454" },
  { key: "whatsapp", value: "(41) 3031-6454" },
  { key: "email", value: "arianevstorrer@gmail.com" },
  { key: "opening_hours", value: "09h00 às 19h00" },
  { key: "instagram_url", value: "https://instagram.com/arianevstorrer" },
  { key: "facebook_url", value: "" },
  { key: "maps_url", value: "" },
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
