import type { Metadata } from "next";
import Link from "next/link";
import { getScheduleExceptionsForMonth, isDefaultWorkday } from "@/lib/data/scheduleExceptions";
import { getAppointmentsForMonth } from "@/lib/data/appointments";
import { getAllPatients } from "@/lib/data/patients";
import { getAllServices } from "@/lib/data/services";
import { appointmentStatusLabels } from "@/lib/validation/adminAppointment";
import { toggleScheduleExceptionAction, cancelAppointmentAction } from "./actions";

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

  const [appointments, patients, services] = await Promise.all([
    getAppointmentsForMonth(year, month),
    getAllPatients(),
    getAllServices(),
  ]);
  const patientById = new Map(patients.map((patient) => [patient.id, patient]));
  const serviceById = new Map(services.map((service) => [service.id, service]));
  const appointmentsByDate = new Map<string, typeof appointments>();
  for (const appointment of appointments) {
    const list = appointmentsByDate.get(appointment.date) ?? [];
    list.push(appointment);
    appointmentsByDate.set(appointment.date, list);
  }

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <Link href="/admin/agenda/consultas/nova" className="text-sm underline underline-offset-2">
          + Nova consulta
        </Link>
      </div>
      <p className="mt-2 text-sm opacity-80">
        Padrão: trabalha de segunda a sexta. Clique num dia pra marcar uma exceção (folga num dia
        útil, ou disponibilidade extra num fim de semana); clique de novo pra desfazer. Clique no
        número do dia pra marcar uma consulta naquela data.
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
            const dayAppointments = appointmentsByDate.get(dateStr) ?? [];
            const activeCount = dayAppointments.filter((a) => a.status !== "cancelada").length;

            return (
              <div
                key={dateStr}
                className={`flex flex-col items-center gap-1 rounded-md border p-2 text-xs ${
                  effectiveAvailable
                    ? "border-black/10 dark:border-white/15"
                    : "border-black/10 bg-black/5 dark:border-white/15 dark:bg-white/5"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <Link
                    href={`/admin/agenda/consultas/nova?data=${dateStr}`}
                    className="font-medium underline underline-offset-2"
                  >
                    {dayNumber}
                  </Link>
                  {activeCount > 0 && (
                    <span className="rounded-full bg-blue/10 px-1.5 text-[10px] text-blue dark:bg-blue/20">
                      {activeCount}
                    </span>
                  )}
                </div>
                <span className="opacity-80">{effectiveAvailable ? "Trabalha" : "Não trabalha"}</span>
                {exception && <span className="opacity-60">(exceção)</span>}
                <form action={toggleForDate}>
                  <button type="submit" className="mt-1 underline underline-offset-2">
                    {exception
                      ? "Desfazer"
                      : defaultAvailable
                        ? "Marcar folga"
                        : "Marcar disponível"}
                  </button>
                </form>
              </div>
            );
          }),
        )}
      </div>

      <h2 className="mt-8 font-medium">Consultas de {monthLabel}</h2>
      {appointments.length === 0 ? (
        <p className="mt-2 text-sm opacity-70">Nenhuma consulta marcada neste mês.</p>
      ) : (
        <ul className="mt-2 divide-y divide-black/10 dark:divide-white/15">
          {appointments.map((appointment) => {
            const patient = patientById.get(appointment.patient_id);
            const service = appointment.service_id ? serviceById.get(appointment.service_id) : null;
            const cancelThis = cancelAppointmentAction.bind(null, appointment.id);

            return (
              <li key={appointment.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">
                    {appointment.date} às {appointment.time} — {patient?.name ?? "Paciente removido"}
                  </p>
                  <p className="opacity-70">
                    {service ? `${service.title} — ` : ""}
                    {appointmentStatusLabels[appointment.status]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {appointment.status === "confirmada" && (
                    <form action={cancelThis}>
                      <button type="submit" className="underline underline-offset-2">
                        Cancelar
                      </button>
                    </form>
                  )}
                  <Link
                    href={`/admin/agenda/consultas/${appointment.id}/editar`}
                    className="underline underline-offset-2"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
