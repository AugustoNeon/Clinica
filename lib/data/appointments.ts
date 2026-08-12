import { getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { Appointment } from "@/types";

/**
 * Camada de dados de `appointments` (issue #37 revisada).
 *
 * ESTADO PARCIAL DE PROPOSITO: este arquivo comeca so com o necessario
 * pra tela de exclusao de paciente (listar consultas vinculadas antes de
 * apagar em cascata) — o resto (criar/editar consulta, checagem de
 * conflito de horario, listagem por mes) entra na proxima fatia (PR3),
 * que integra consultas no calendario de `/admin/agenda`.
 *
 * Dado pessoal (via `patients`): nunca logar nome/telefone/e-mail do
 * paciente relacionado.
 */

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

/** Postgres devolve a coluna `time` como "HH:mm:ss" — normaliza pra "HH:mm". */
function normalizeAppointmentTime(appointment: Appointment): Appointment {
  return { ...appointment, time: appointment.time.slice(0, 5) };
}
