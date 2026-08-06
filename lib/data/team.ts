import { getSupabaseServerClient, getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/types";
import type { AdminTeamMemberValues } from "@/lib/validation/adminTeamMember";

/**
 * Camada de dados de `team_members`.
 *
 * IMPLEMENTACAO: query real no Supabase (Fase 5 PR1, issue #16). O conteudo
 * real (Dra. Ariane Vaz Storrer) foi migrado para
 * `supabase/migrations/0003_seed_conteudo_real.sql`.
 */

/** Membros de equipe publicados, ja ordenados por `order`. */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) throw new Error(`Falha ao buscar team_members: ${error.message}`);
  return data as TeamMember[];
}

/** Um membro de equipe publicado pelo id, ou `null` se nao existir. */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar team_member por id: ${error.message}`);
  return data as TeamMember | null;
}

/**
 * MUTATIONS DO PAINEL ADMIN (Fase 5 PR3b, issue #20).
 *
 * Usam `getSupabaseServerComponentClient()` (cookie-aware), NAO
 * `getSupabaseAdminClient()`: a RLS de `team_members_admin_write`
 * (`supabase/migrations/0006_admin_write_policies_team.sql`) e a camada de
 * autorizacao real — o cliente precisa carregar a sessao do usuario logado
 * pra RLS autorizar.
 */

/** Todos os membros de equipe (publicados ou nao), para a listagem do admin. */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("team_members").select("*").order("order");

  if (error) throw new Error(`Falha ao buscar team_members (admin): ${error.message}`);
  return data as TeamMember[];
}

/** Um membro de equipe pelo id (publicado ou nao), para a tela de edicao. */
export async function getTeamMemberByIdAdmin(id: string): Promise<TeamMember | null> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar team_member por id (admin): ${error.message}`);
  return data as TeamMember | null;
}

export async function createTeamMember(input: AdminTeamMemberValues): Promise<TeamMember> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("team_members").insert(input).select().single();

  if (error) throw new Error(`Falha ao criar team_member: ${error.message}`);
  return data as TeamMember;
}

export async function updateTeamMember(
  id: string,
  input: AdminTeamMemberValues,
): Promise<TeamMember> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("team_members")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Falha ao atualizar team_member: ${error.message}`);
  return data as TeamMember;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir team_member: ${error.message}`);
}
