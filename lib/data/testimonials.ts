import { getSupabaseServerClient, getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types";
import type { AdminTestimonialValues } from "@/lib/validation/adminTestimonial";

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

/**
 * MUTATIONS DO PAINEL ADMIN (Fase 5 PR3d, issue #20).
 *
 * Usam `getSupabaseServerComponentClient()` (cookie-aware), NAO
 * `getSupabaseAdminClient()`: a RLS de `testimonials_admin_write`
 * (`supabase/migrations/0008_admin_write_policies_testimonials.sql`) e a
 * camada de autorizacao real — o cliente precisa carregar a sessao do
 * usuario logado pra RLS autorizar.
 */

/** Todos os depoimentos (publicados ou nao, com ou sem consentimento), para a listagem do admin. */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("patient_name");

  if (error) throw new Error(`Falha ao buscar testimonials (admin): ${error.message}`);
  return data as Testimonial[];
}

/** Um depoimento pelo id (qualquer estado), para a tela de edicao. */
export async function getTestimonialByIdAdmin(id: string): Promise<Testimonial | null> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar testimonial por id (admin): ${error.message}`);
  return data as Testimonial | null;
}

export async function createTestimonial(input: AdminTestimonialValues): Promise<Testimonial> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("testimonials").insert(input).select().single();

  if (error) throw new Error(`Falha ao criar testimonial: ${error.message}`);
  return data as Testimonial;
}

export async function updateTestimonial(
  id: string,
  input: AdminTestimonialValues,
): Promise<Testimonial> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("testimonials")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Falha ao atualizar testimonial: ${error.message}`);
  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir testimonial: ${error.message}`);
}
