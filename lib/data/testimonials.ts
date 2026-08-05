import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types";

/**
 * Camada de dados de `testimonials`.
 *
 * IMPLEMENTACAO: query real no Supabase (Fase 5 PR1, issue #16). Conteudo
 * ainda e PLACEHOLDER (migrado para `supabase/migrations/0003_seed_conteudo_real.sql`).
 *
 * LGPD: depoimento de paciente so vai ao ar com consentimento por escrito
 * (PLANEJAMENTO.md secao 7). O filtro por `consent_confirmed` fica AQUI,
 * alem de `published` — publicar sem consentimento nao pode depender so da
 * RLS (que hoje e ampla para esta tabela) nem de alguem lembrar de marcar a
 * flag certa.
 */

/** Depoimentos publicados E com consentimento confirmado. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .eq("consent_confirmed", true);

  if (error) throw new Error(`Falha ao buscar testimonials: ${error.message}`);
  return data as Testimonial[];
}
