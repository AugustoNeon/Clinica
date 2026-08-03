import type { SiteSetting } from "@/types";

/**
 * Camada de dados de `site_settings` (endereco, telefone, horario, redes).
 *
 * IMPLEMENTACAO ATUAL: dados de PLACEHOLDER em memoria — ver o comentario
 * de cabecalho de `lib/data/services.ts` para o contrato de substituicao.
 *
 * TODOS os valores abaixo sao placeholders declarados. Nenhum endereco,
 * telefone ou razao social plausivel foi inventado: o dado real vem do
 * questionario da cliente.
 */

const PLACEHOLDER_SETTINGS: SiteSetting[] = [
  { key: "clinic_name", value: "Nome da Clinica (placeholder)" },
  { key: "clinic_tagline", value: "Slogan da clinica (placeholder)" },
  { key: "address", value: "Endereco (placeholder)" },
  { key: "phone", value: "Telefone (placeholder)" },
  { key: "whatsapp", value: "WhatsApp (placeholder)" },
  { key: "email", value: "E-mail (placeholder)" },
  { key: "opening_hours", value: "Horario de atendimento (placeholder)" },
  { key: "instagram_url", value: "" },
  { key: "facebook_url", value: "" },
  { key: "maps_url", value: "" },
];

/** Todas as configuracoes institucionais. */
export async function getSiteSettings(): Promise<SiteSetting[]> {
  return PLACEHOLDER_SETTINGS;
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
