import { getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { ScheduleException } from "@/types";

/**
 * Camada de dados de `schedule_exceptions` (Fase B, issue #35).
 *
 * Regra padrao (segunda a sexta) NAO mora no banco — e a constante
 * `DEFAULT_WORKDAYS` abaixo. A tabela guarda so as EXCECOES a essa regra;
 * um dia sem linha aqui segue o padrao. So o admin (`authenticated`) le e
 * escreve — nenhum consumidor publico ainda (Fase C/D, issues #36/#37).
 */

/** `Date#getUTCDay()`: 0 = domingo ... 6 = sabado. Segunda a sexta = 1-5. */
const DEFAULT_WORKDAYS = [1, 2, 3, 4, 5];

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** `dateStr` no formato YYYY-MM-DD. Interpretado como UTC (coluna `date` do Postgres nao tem hora). */
export function isDefaultWorkday(dateStr: string): boolean {
  const day = new Date(`${dateStr}T00:00:00Z`).getUTCDay();
  return DEFAULT_WORKDAYS.includes(day);
}

function monthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${pad2(month)}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const end = `${year}-${pad2(month)}-${pad2(lastDay)}`;
  return { start, end };
}

/**
 * Se um dia especifico e de trabalho (padrao OU excecao) — usado pela Fase C
 * (issue #36) pra decidir se vale a pena consultar o Google Calendar antes
 * de gastar uma chamada de API num dia que ja e folga por definicao.
 */
export async function isDateAvailable(dateStr: string): Promise<boolean> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("schedule_exceptions")
    .select("is_available")
    .eq("date", dateStr)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar excecao: ${error.message}`);
  return data ? data.is_available : isDefaultWorkday(dateStr);
}

/** Excecoes do mes (1-12), ordenadas por data — intervalo do mes ja limita o resultado. */
export async function getScheduleExceptionsForMonth(
  year: number,
  month: number,
): Promise<ScheduleException[]> {
  const { start, end } = monthRange(year, month);
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("schedule_exceptions")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date");

  if (error) throw new Error(`Falha ao buscar schedule_exceptions: ${error.message}`);
  return data as ScheduleException[];
}

/**
 * Alterna a excecao de um dia: se ja existe linha pra `dateStr`, remove
 * (volta ao padrao); se nao existe, cria invertendo o padrao daquele dia
 * (marca folga se e dia util, marca disponibilidade extra se nao e).
 */
export async function toggleScheduleException(dateStr: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();

  const { data: existing, error: selectError } = await supabase
    .from("schedule_exceptions")
    .select("id")
    .eq("date", dateStr)
    .maybeSingle();

  if (selectError) throw new Error(`Falha ao buscar excecao: ${selectError.message}`);

  if (existing) {
    const { error: deleteError } = await supabase
      .from("schedule_exceptions")
      .delete()
      .eq("date", dateStr);
    if (deleteError) throw new Error(`Falha ao remover excecao: ${deleteError.message}`);
    return;
  }

  const { error: insertError } = await supabase
    .from("schedule_exceptions")
    .insert({ date: dateStr, is_available: !isDefaultWorkday(dateStr) });
  if (insertError) throw new Error(`Falha ao criar excecao: ${insertError.message}`);
}
