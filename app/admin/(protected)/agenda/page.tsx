import type { Metadata } from "next";
import Link from "next/link";
import { getScheduleExceptionsForMonth, isDefaultWorkday } from "@/lib/data/scheduleExceptions";
import { getConnectionStatus, getFreeSlotsForDate } from "@/lib/data/googleCalendar";
import { toggleScheduleExceptionAction } from "./actions";

export const metadata: Metadata = {
  title: "Agenda",
  robots: { index: false, follow: false },
};

interface AgendaPageProps {
  searchParams: Promise<{ mes?: string; google?: string; data?: string }>;
}

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Ano/mes vindos de `?mes=AAAA-MM`; cai pro mes corrente (UTC) se ausente/invalido. */
function resolveYearMonth(mes: string | undefined): { year: number; month: number } {
  const match = mes?.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) return { year, month };
  }
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

function adjacentMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const total = year * 12 + (month - 1) + delta;
  return { year: Math.floor(total / 12), month: (total % 12) + 1 };
}

/** Grid de semanas (segunda a domingo), com `null` de preenchimento fora do mes. */
function buildCalendarWeeks(year: number, month: number): (string | null)[][] {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // getUTCDay(): 0 = domingo. Convertido pra offset com semana comecando na segunda.
  const firstWeekday = (firstDay.getUTCDay() + 6) % 7;

  const cells: (string | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${year}-${pad2(month)}-${pad2(day)}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default async function AdminAgendaPage({ searchParams }: AgendaPageProps) {
  const { mes, google, data: selectedDate } = await searchParams;
  const { year, month } = resolveYearMonth(mes);

  const connected = await getConnectionStatus();

  const validSelectedDate =
    selectedDate && DATE_PARAM_PATTERN.test(selectedDate) ? selectedDate : null;
  let freeSlots: string[] | null = null;
  let freeSlotsError = false;
  if (validSelectedDate && connected) {
    try {
      freeSlots = await getFreeSlotsForDate(validSelectedDate);
    } catch (error) {
      console.error("Falha ao calcular horarios livres:", error);
      freeSlotsError = true;
    }
  }

  const exceptions = await getScheduleExceptionsForMonth(year, month);
  const exceptionByDate = new Map(exceptions.map((exception) => [exception.date, exception]));

  const weeks = buildCalendarWeeks(year, month);
  const prev = adjacentMonth(year, month, -1);
  const next = adjacentMonth(year, month, 1);
  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Agenda</h1>
      <p className="mt-2 text-sm opacity-80">
        Padrão: trabalha de segunda a sexta. Clique num dia pra marcar uma exceção (folga num dia
        útil, ou disponibilidade extra num fim de semana); clique de novo pra desfazer.
      </p>

      <section className="mt-6 rounded-md border border-black/10 p-4 dark:border-white/15">
        <h2 className="font-medium">Google Calendar</h2>
        {google === "conectado" && (
          <p className="mt-2 text-sm text-green-700 dark:text-green-400">Conectado com sucesso.</p>
        )}
        {google === "erro" && (
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">
            Não foi possível conectar. Tente de novo.
          </p>
        )}
        <p className="mt-2 text-sm opacity-80">
          {connected
            ? "Conectado — os horários livres abaixo já cruzam com a agenda pessoal dela."
            : "Não conectado. Sem isso, a lista de horários livres não funciona."}
        </p>
        {!connected && (
          <Link
            href="/admin/agenda/google/conectar"
            prefetch={false}
            className="mt-2 inline-block text-sm underline underline-offset-2"
          >
            Conectar Google Calendar
          </Link>
        )}
      </section>

      <section className="mt-6 rounded-md border border-black/10 p-4 dark:border-white/15">
        <h2 className="font-medium">Horários livres</h2>
        <form method="get" className="mt-2 flex flex-wrap items-end gap-2">
          <input type="hidden" name="mes" value={`${year}-${pad2(month)}`} />
          <label className="text-sm">
            <span className="block opacity-80">Data</span>
            <input
              type="date"
              name="data"
              defaultValue={validSelectedDate ?? undefined}
              className="mt-1 rounded-md border border-black/20 px-2 py-1 dark:border-white/25 dark:bg-transparent"
            />
          </label>
          <button type="submit" className="text-sm underline underline-offset-2">
            Ver horários
          </button>
        </form>
        {validSelectedDate && !connected && (
          <p className="mt-2 text-sm opacity-80">Conecte o Google Calendar acima primeiro.</p>
        )}
        {validSelectedDate && connected && freeSlotsError && (
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">
            Falha ao consultar o Google Calendar. Tente de novo.
          </p>
        )}
        {validSelectedDate && connected && !freeSlotsError && freeSlots && freeSlots.length === 0 && (
          <p className="mt-2 text-sm opacity-80">Nenhum horário livre nesse dia.</p>
        )}
        {validSelectedDate && connected && !freeSlotsError && freeSlots && freeSlots.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {freeSlots.map((slot) => (
              <li key={slot} className="rounded-md border border-black/10 px-2 py-1 dark:border-white/15">
                {slot}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/admin/agenda?mes=${prev.year}-${pad2(prev.month)}`}
          className="text-sm underline underline-offset-2"
        >
          ← Mês anterior
        </Link>
        <p className="font-medium capitalize">{monthLabel}</p>
        <Link
          href={`/admin/agenda?mes=${next.year}-${pad2(next.month)}`}
          className="text-sm underline underline-offset-2"
        >
          Próximo mês →
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs opacity-70">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {weeks.flatMap((week, weekIndex) =>
          week.map((dateStr, dayIndex) => {
            if (!dateStr) {
              return <div key={`${weekIndex}-${dayIndex}`} />;
            }

            const exception = exceptionByDate.get(dateStr);
            const defaultAvailable = isDefaultWorkday(dateStr);
            const effectiveAvailable = exception ? exception.is_available : defaultAvailable;
            const dayNumber = Number(dateStr.slice(-2));
            const toggleForDate = toggleScheduleExceptionAction.bind(null, dateStr);

            return (
              <form
                key={dateStr}
                action={toggleForDate}
                className={`flex flex-col items-center gap-1 rounded-md border p-2 text-xs ${
                  effectiveAvailable
                    ? "border-black/10 dark:border-white/15"
                    : "border-black/10 bg-black/5 dark:border-white/15 dark:bg-white/5"
                }`}
              >
                <span className="font-medium">{dayNumber}</span>
                <span className="opacity-80">{effectiveAvailable ? "Trabalha" : "Não trabalha"}</span>
                {exception && <span className="opacity-60">(exceção)</span>}
                <button type="submit" className="mt-1 underline underline-offset-2">
                  {exception
                    ? "Desfazer"
                    : defaultAvailable
                      ? "Marcar folga"
                      : "Marcar disponível"}
                </button>
              </form>
            );
          }),
        )}
      </div>
    </div>
  );
}
