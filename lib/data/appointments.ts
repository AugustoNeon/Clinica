import { getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { Appointment, AppointmentStatus } from "@/types";
import type { AdminAppointmentValues } from "@/lib/validation/adminAppointment";

/**
 * Camada de dados de `appointments` (issue #37 revisada).
 *
 * Dado pessoal (via `patients`): nunca logar nome/telefone/e-mail do
 * paciente relacionado.
 */

/** Postgres devolve a coluna `time` como "HH:mm:ss" — normaliza pra "HH:mm". */
function normalizeAppointmentTime(appointment: Appointment): Appointment {
  return { ...appointment, time: appointment.time.slice(0, 5) };
}

function monthRange(year: number, month: number): { start: string; end: string } {
  const pad2 = (value: number) => String(value).padStart(2, "0");
  const start = `${year}-${pad2(month)}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const end = `${year}-${pad2(month)}-${pad2(lastDay)}`;
  return { start, end };
}

/** Consultas do mes (1-12), ordenadas por data+hora — intervalo do mes ja limita o resultado. */
export async function getAppointmentsForMonth(year: number, month: number): Promise<Appointment[]> {
  const { start, end } = monthRange(year, month);
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date")
    .order("time");

  if (error) throw new Error(`Falha ao buscar appointments do mes: ${error.message}`);
  return (data as Appointment[]).map(normalizeAppointmentTime);
}

/** Consultas de um paciente, mais recentes primeiro — usado na tela de confirmacao de exclusao do paciente. */
export async function getAppointmentsForPatient(patientId: string): Promise<Appointment[]> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .order("date", { ascending: false });

  if (error) throw new Error(`Falha ao buscar appointments do paciente: ${error.message}`);
  return (data as Appointment[]).map(normalizeAppointmentTime);
}

/** Uma consulta pelo id, ou `null` se nao existir. */
export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("appointments").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(`Falha ao buscar appointment por id: ${error.message}`);
  return data ? normalizeAppointmentTime(data as Appointment) : null;
}

/**
 * `true` se ja existe consulta ATIVA (nao cancelada) no mesmo dia+hora.
 * `excludeId` ignora a propria consulta ao editar (senao ela colidiria
 * consigo mesma). Checagem amigavel antes do insert/update — o indice
 * unico parcial no banco (migration 0013) e a garantia final contra
 * corrida, mas devolve erro cru de constraint, nao mensagem amigavel.
 */
export async function isSlotTaken(date: string, time: string, excludeId?: string): Promise<boolean> {
  const supabase = await getSupabaseServerComponentClient();
  let query = supabase
    .from("appointments")
    .select("id")
    .eq("date", date)
    .eq("time", time)
    .neq("status", "cancelada");

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.limit(1);
  if (error) throw new Error(`Falha ao checar conflito de horario: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

/** Cria a consulta como "confirmada" (toda consulta nasce assim, decisao do /grill). Lanca erro com mensagem amigavel se o slot ja estiver ocupado. */
export async function createAppointment(input: AdminAppointmentValues): Promise<Appointment> {
  if (await isSlotTaken(input.date, input.time)) {
    throw new Error("Ja existe uma consulta ativa nesse dia e horario.");
  }

  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert({ ...input, status: "confirmada" })
    .select()
    .single();

  if (error) throw new Error(`Falha ao criar appointment: ${error.message}`);
  return normalizeAppointmentTime(data as Appointment);
}

/** Atualiza a consulta (inclusive status) — usado so na tela de edicao. Reaplica a checagem de conflito se dia/hora mudaram. */
export async function updateAppointment(
  id: string,
  input: AdminAppointmentValues,
  status: AppointmentStatus,
): Promise<Appointment> {
  if (status !== "cancelada" && (await isSlotTaken(input.date, input.time, id))) {
    throw new Error("Ja existe uma consulta ativa nesse dia e horario.");
  }

  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("appointments")
    .update({ ...input, status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Falha ao atualizar appointment: ${error.message}`);
  return normalizeAppointmentTime(data as Appointment);
}

/** Cancela sem abrir a tela de edicao inteira (mesmo espirito do update de status de leads) — nunca colide, cancelar sempre libera o slot. */
export async function cancelAppointment(id: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.from("appointments").update({ status: "cancelada" }).eq("id", id);

  if (error) throw new Error(`Falha ao cancelar appointment: ${error.message}`);
}

/** Exclusao direta (sem cascata pra proteger, diferente de excluir paciente). */
export async function deleteAppointment(id: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir appointment: ${error.message}`);
}
