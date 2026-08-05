import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/types";

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
