import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { Notice } from "@/components/admin/Notice";
import { StatusBadge, type BadgeTone } from "@/components/admin/StatusBadge";
import { inputClasses } from "@/components/admin/form";
import { buttonClasses } from "@/components/ui/Button";
import { IconArrowLeft, IconArrowRight, IconPlus } from "@/components/ui/icons";
import { getAppointmentsForMonth } from "@/lib/data/appointments";
import { getConnectionStatus, getFreeSlotsForDate } from "@/lib/data/googleCalendar";
import { getAllPatients } from "@/lib/data/patients";
import { getScheduleExceptionsForMonth, isDefaultWorkday } from "@/lib/data/scheduleExceptions";
import { getAllServices } from "@/lib/data/services";
import { formatShortDate, todayInClinicTimeZone } from "@/lib/utils/dates";
import { appointmentStatusLabels } from "@/lib/validation/adminAppointment";
import type { AppointmentStatus } from "@/types";
import { cancelAppointmentAction, toggleScheduleExceptionAction } from "./actions";

export const metadata: Metadata = {
  title: "Agenda",
  robots: { index: false, follow: false },
};

interface AgendaPageProps {
  searchParams: Promise<{ mes?: string; google?: string; data?: string }>;
}

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const STATUS_TONE: Record<AppointmentStatus, BadgeTone> = {
  confirmada: "success",
  cancelada: "neutral",
  concluida: "info",
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Ano/mes vindos de `?mes=AAAA-MM`; cai pro mes corrente se ausente/invalido. */
function resolveYearMonth(mes: string | undefined): { year: number; month: number } {
  const match = mes?.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) return { year, month };
  }
  const [year, month] = todayInClinicTimeZone().split("-").map(Number);
  return { year, month };
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

/**
 * Agenda (Fase B #35, Fase C #36, issue #37; visual da #67). Calendario do
 * mes com dias de trabalho/folga (padrao segunda a sexta + excecoes),
 * consultas do mes, horarios livres cruzados com o Google Calendar.
 */
export default async function AdminAgendaPage({ searchParams }: AgendaPageProps) {
  const { mes, google, data: selectedDate } = await searchParams;
  const { year, month } = resolveYearMonth(mes);
  const today = todayInClinicTimeZone();

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
  const sortedAppointments = [...appointments].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
  );

  const weeks = buildCalendarWeeks(year, month);
  const prev = adjacentMonth(year, month, -1);
  const next = adjacentMonth(year, month, 1);
  const rawMonthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  // "setembro de 2026" → "Setembro de 2026" (so a primeira letra; `capitalize` do CSS pegava o "De").
  const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1);
  const monthParam = `${year}-${pad2(month)}`;
  const activeCount = appointments.filter((appointment) => appointment.status !== "cancelada").length;

  return (
    <div>
      <AdminPageHeader
        title="Agenda"
        description="Padrão: atende de segunda a sexta. Marque folga num dia útil ou disponibilidade extra num fim de semana clicando no dia; o número do dia abre uma consulta nova naquela data."
        actions={
          <Link href="/admin/agenda/consultas/nova" className={buttonClasses("primary")}>
            <IconPlus width={18} height={18} />
            Nova consulta
          </Link>
        }
      />

      {google === "conectado" && (
        <Notice tone="success" className="mb-6">
          Google Calendar conectado. Os horários livres já cruzam com a sua agenda pessoal.
        </Notice>
      )}
      {google === "erro" && (
        <Notice tone="error" className="mb-6">
          Não foi possível conectar ao Google Calendar. Tente de novo.
        </Notice>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)]">
        <AdminPanel flush>
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 sm:px-5">
            <Link
              href={`/admin/agenda?mes=${prev.year}-${pad2(prev.month)}`}
              aria-label="Mês anterior"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors ease-out hover:bg-surface-sunken hover:text-ink"
            >
              <IconArrowLeft />
            </Link>
            <h2 className="font-display text-xl font-medium">{monthLabel}</h2>
            <Link
              href={`/admin/agenda?mes=${next.year}-${pad2(next.month)}`}
              aria-label="Próximo mês"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors ease-out hover:bg-surface-sunken hover:text-ink"
            >
              <IconArrowRight />
            </Link>
          </div>

          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-ink-muted sm:gap-2">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="py-1">
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-1.5 grid grid-cols-7 gap-1.5 sm:gap-2">
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
                  const active = dayAppointments.filter((a) => a.status !== "cancelada").length;
                  const isToday = dateStr === today;
                  const isPast = dateStr < today;

                  return (
                    <div
                      key={dateStr}
                      className={`flex min-h-24 flex-col rounded-xl border p-1.5 text-xs sm:min-h-28 sm:p-2 ${
                        effectiveAvailable
                          ? "border-ink/10 bg-surface"
                          : "border-ink/5 bg-surface-sunken text-ink-muted"
                      } ${isToday ? "ring-2 ring-blue" : ""} ${isPast ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/admin/agenda/consultas/nova?data=${dateStr}`}
                          title="Marcar consulta neste dia"
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-display text-sm font-medium transition-colors ease-out hover:bg-blue-dark hover:text-white ${
                            isToday ? "bg-blue-dark text-white" : ""
                          }`}
                        >
                          {dayNumber}
                        </Link>
                        {active > 0 && (
                          <span
                            className="inline-flex min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-semibold text-ink"
                            title={`${active} ${active === 1 ? "consulta" : "consultas"}`}
                          >
                            {active}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 hidden leading-tight sm:block">
                        {effectiveAvailable ? "Atende" : "Folga"}
                        {exception && <span className="text-ink-muted"> · exceção</span>}
                      </p>

                      <form action={toggleForDate} className="mt-auto">
                        <button
                          type="submit"
                          className="w-full rounded-lg px-1 py-1 text-left text-[11px] font-medium text-blue-dark transition-colors ease-out hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-dark"
                        >
                          {exception ? "Desfazer" : defaultAvailable ? "Marcar folga" : "Abrir dia"}
                        </button>
                      </form>
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </AdminPanel>

        <div className="grid content-start gap-6">
          <AdminPanel
            title="Google Calendar"
            action={
              <StatusBadge tone={connected ? "success" : "neutral"}>
                {connected ? "Conectado" : "Não conectado"}
              </StatusBadge>
            }
          >
            <p className="text-sm leading-relaxed text-ink-muted">
              {connected
                ? "Os horários livres abaixo descontam os compromissos da sua agenda pessoal."
                : "Conecte a sua conta Google para a lista de horários livres considerar a sua agenda pessoal."}
            </p>
            {!connected && (
              <Link
                href="/admin/agenda/google/conectar"
                prefetch={false}
                className={buttonClasses("secondary", "mt-4")}
              >
                Conectar Google Calendar
              </Link>
            )}
          </AdminPanel>

          <AdminPanel title="Horários livres" description="Escolha um dia para ver as horas cheias sem compromisso.">
            <form method="get" className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="mes" value={monthParam} />
              <div className="flex-1">
                <label htmlFor="data" className="mb-1.5 block text-sm font-medium">
                  Data
                </label>
                <input
                  id="data"
                  type="date"
                  name="data"
                  defaultValue={validSelectedDate ?? undefined}
                  className={inputClasses}
                />
              </div>
              <button type="submit" className={buttonClasses("secondary")}>
                Ver horários
              </button>
            </form>

            {validSelectedDate && !connected && (
              <p className="mt-3 text-sm text-ink-muted">Conecte o Google Calendar acima primeiro.</p>
            )}
            {validSelectedDate && connected && freeSlotsError && (
              <Notice tone="error" className="mt-3">
                Falha ao consultar o Google Calendar. Tente de novo.
              </Notice>
            )}
            {validSelectedDate && connected && !freeSlotsError && freeSlots && freeSlots.length === 0 && (
              <p className="mt-3 text-sm text-ink-muted">
                Nenhum horário livre em {formatShortDate(validSelectedDate)}.
              </p>
            )}
            {validSelectedDate && connected && !freeSlotsError && freeSlots && freeSlots.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">{formatShortDate(validSelectedDate)}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {freeSlots.map((slot) => (
                    <li key={slot}>
                      <Link
                        href={`/admin/agenda/consultas/nova?data=${validSelectedDate}`}
                        className="inline-flex rounded-full border border-blue/40 bg-surface-tint px-3 py-1 text-sm font-medium text-blue-dark transition-colors ease-out hover:bg-blue-dark hover:text-white"
                      >
                        {slot}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AdminPanel>
        </div>
      </div>

      <div className="mt-6">
        <AdminPanel
          title={`Consultas de ${monthLabel}`}
          description={`${activeCount} ${activeCount === 1 ? "ativa" : "ativas"} (canceladas continuam listadas).`}
          flush
        >
          {sortedAppointments.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">Nenhuma consulta marcada neste mês.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {sortedAppointments.map((appointment) => {
                const patient = patientById.get(appointment.patient_id);
                const service = appointment.service_id ? serviceById.get(appointment.service_id) : null;
                const cancelThis = cancelAppointmentAction.bind(null, appointment.id);

                return (
                  <li
                    key={appointment.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 sm:flex-nowrap"
                  >
                    <div className="w-28 shrink-0">
                      <p className="text-sm font-medium">
                        {appointment.date === today ? "Hoje" : formatShortDate(appointment.date)}
                      </p>
                      <p className="text-xs text-ink-muted">{appointment.time}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/agenda/consultas/${appointment.id}/editar`}
                        className="font-medium underline-offset-4 hover:text-blue-dark hover:underline"
                      >
                        {patient?.name ?? "Paciente removido"}
                      </Link>
                      <p className="truncate text-sm text-ink-muted">
                        {service?.title ?? "Sem serviço definido"}
                      </p>
                    </div>
                    <StatusBadge tone={STATUS_TONE[appointment.status]}>
                      {appointmentStatusLabels[appointment.status]}
                    </StatusBadge>
                    {appointment.status === "confirmada" && (
                      <ConfirmAction
                        action={cancelThis}
                        label="Cancelar"
                        question={`Cancelar a consulta de ${patient?.name ?? "paciente"} às ${appointment.time}?`}
                        confirmLabel="Sim, cancelar"
                        tone="neutral"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
