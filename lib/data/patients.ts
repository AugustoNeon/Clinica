import { getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { Patient } from "@/types";
import type { AdminPatientValues } from "@/lib/validation/adminPatient";

/**
 * Camada de dados de `patients` (issue #37 revisada). RLS `authenticated`
 * (migration 0013) — sempre via `getSupabaseServerComponentClient`
 * (cookie-aware), nunca `service_role`, mesmo padrao do resto do admin.
 *
 * Dado pessoal: nunca logar `name`/`phone`/`email`/`notes` (mesma regra de
 * `contact_leads`).
 */

/** Todos os pacientes, ordenados por nome — usado na lista do admin e no seletor do formulario de consulta. */
export async function getAllPatients(): Promise<Patient[]> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("patients").select("*").order("name");

  if (error) throw new Error(`Falha ao buscar patients: ${error.message}`);
  return data as Patient[];
}

/** Um paciente pelo id, ou `null` se nao existir. */
export async function getPatientById(id: string): Promise<Patient | null> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(`Falha ao buscar patient por id: ${error.message}`);
  return data as Patient | null;
}

export async function createPatient(input: AdminPatientValues): Promise<Patient> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("patients").insert(input).select().single();

  if (error) throw new Error(`Falha ao criar patient: ${error.message}`);
  return data as Patient;
}

export async function updatePatient(id: string, input: AdminPatientValues): Promise<Patient> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("patients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Falha ao atualizar patient: ${error.message}`);
  return data as Patient;
}

/** Apaga o paciente — `on delete cascade` (migration 0013) apaga as consultas dele junto. */
export async function deletePatient(id: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.from("patients").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir patient: ${error.message}`);
}
