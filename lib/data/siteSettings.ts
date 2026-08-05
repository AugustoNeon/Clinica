import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteSetting } from "@/types";

/**
 * Camada de dados de `site_settings` (endereco, telefone, horario, redes).
 *
 * IMPLEMENTACAO: query real no Supabase (Fase 5 PR1, issue #16). Conteudo
 * real (questionario da cliente, 2026-08-04/05) foi migrado para
 * `supabase/migrations/0003_seed_conteudo_real.sql`.
 */

/** Todas as configuracoes institucionais. */
export async function getSiteSettings(): Promise<SiteSetting[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) throw new Error(`Falha ao buscar site_settings: ${error.message}`);
  return data as SiteSetting[];
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
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar site_setting por key: ${error.message}`);
  return data as SiteSetting | null;
}
