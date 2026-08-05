import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Service } from "@/types";

/**
 * Camada de dados de `services`.
 *
 * IMPLEMENTACAO: query real no Supabase (Fase 5 PR1, issue #16). O conteudo
 * (15 especialidades reais + descricao generica de cada uma) foi migrado
 * para `supabase/migrations/0003_seed_conteudo_real.sql` — ver ali para o
 * historico e a fundamentacao (questionario da cliente, 2026-08-04/05).
 */

/** Servicos publicados, ja ordenados por `order`. */
export async function getServices(): Promise<Service[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) throw new Error(`Falha ao buscar services: ${error.message}`);
  return data as Service[];
}

/** Um servico publicado pelo slug, ou `null` se nao existir. */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar service por slug: ${error.message}`);
  return data as Service | null;
}
