import { getSupabaseServerClient, getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { Service } from "@/types";
import type { AdminServiceValues } from "@/lib/validation/adminService";

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

/**
 * MUTATIONS DO PAINEL ADMIN (Fase 5 PR3a, issue #20).
 *
 * Usam `getSupabaseServerComponentClient()` (cookie-aware), NAO
 * `getSupabaseAdminClient()`: a RLS de `services_admin_write`
 * (`supabase/migrations/0005_admin_write_policies_services.sql`) e a
 * camada de autorizacao real — o cliente precisa carregar a sessao do
 * usuario logado pra RLS autorizar.
 */

/** Todos os servicos (publicados ou nao), para a listagem do admin. */
export async function getAllServices(): Promise<Service[]> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("services").select("*").order("order");

  if (error) throw new Error(`Falha ao buscar services (admin): ${error.message}`);
  return data as Service[];
}

/** Um servico pelo id (publicado ou nao), para a tela de edicao. */
export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(`Falha ao buscar service por id: ${error.message}`);
  return data as Service | null;
}

export async function createService(input: AdminServiceValues): Promise<Service> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("services").insert(input).select().single();

  if (error) throw new Error(`Falha ao criar service: ${error.message}`);
  return data as Service;
}

export async function updateService(id: string, input: AdminServiceValues): Promise<Service> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("services")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Falha ao atualizar service: ${error.message}`);
  return data as Service;
}

export async function deleteService(id: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir service: ${error.message}`);
}
