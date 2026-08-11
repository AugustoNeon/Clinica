import type { Metadata } from "next";
import Link from "next/link";
import { getScheduleExceptionsForMonth, isDefaultWorkday } from "@/lib/data/scheduleExceptions";
import { toggleScheduleExceptionAction } from "./actions";

export const metadata: Metadata = {
  title: "Agenda",
  robots: { index: false, follow: false },
};

interface AgendaPageProps {
  searchParams: Promise<{ mes?: string }>;
}

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
  const { mes } = await searchParams;
  const { year, month } = resolveYearMonth(mes);

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
