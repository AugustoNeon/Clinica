import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DangerZone, EditorLayout } from "@/components/admin/EditorLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PatientForm } from "@/components/sections/PatientForm";
import { buttonClasses } from "@/components/ui/Button";
import { IconCalendar, IconTrash, IconWhatsApp } from "@/components/ui/icons";
import { getAppointmentsForPatient } from "@/lib/data/appointments";
import { getPatientById } from "@/lib/data/patients";
import { formatShortDate } from "@/lib/utils/dates";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { appointmentStatusLabels } from "@/lib/validation/adminAppointment";
import { updatePatientAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar paciente",
  robots: { index: false, follow: false },
};

const HISTORY_LIMIT = 6;

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const appointments = await getAppointmentsForPatient(id);
  const history = [...appointments]
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .slice(0, HISTORY_LIMIT);
  const updateWithId = updatePatientAction.bind(null, id);
  const firstName = patient.name.trim().split(/\s+/)[0];

  return (
    <EditorLayout
      title={patient.name}
      back={{ href: "/admin/pacientes", label: "Pacientes" }}
      actions={
        <>
          <a
            href={buildWhatsAppUrl(patient.phone, `Olá, ${firstName}! Aqui é a Dra. Ariane.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("secondary")}
          >
            <IconWhatsApp width={18} height={18} />
            WhatsApp
          </a>
          <Link href={`/admin/agenda/consultas/nova?paciente=${id}`} className={buttonClasses("primary")}>
            <IconCalendar width={18} height={18} />
            Marcar consulta
          </Link>
        </>
      }
      aside={
        <>
          <section className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm shadow-ink/5">
            <h2 className="font-display text-base font-medium">Consultas</h2>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">Nenhuma consulta marcada ainda.</p>
            ) : (
              <ul className="mt-3 divide-y divide-ink/10 text-sm">
                {history.map((appointment) => (
                  <li key={appointment.id} className="flex items-center justify-between gap-3 py-2.5">
                    <Link
                      href={`/admin/agenda/consultas/${appointment.id}/editar`}
                      className="font-medium underline-offset-4 hover:text-blue-dark hover:underline"
                    >
                      {formatShortDate(appointment.date)} · {appointment.time}
                    </Link>
                    <StatusBadge
                      tone={
                        appointment.status === "confirmada"
                          ? "success"
                          : appointment.status === "cancelada"
                            ? "neutral"
                            : "info"
                      }
                    >
                      {appointmentStatusLabels[appointment.status]}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
            {appointments.length > HISTORY_LIMIT && (
              <p className="mt-2 text-xs text-ink-muted">Mostrando as {HISTORY_LIMIT} mais recentes.</p>
            )}
          </section>
          <DangerZone text="Excluir apaga o cadastro e todas as consultas dele. A confirmação é feita em uma tela própria.">
            <Link
              href={`/admin/pacientes/${id}/excluir`}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-700 transition-colors ease-out hover:bg-red-50"
            >
              <IconTrash width={16} height={16} />
              Excluir paciente
            </Link>
          </DangerZone>
        </>
      }
    >
      <PatientForm patient={patient} action={updateWithId} submitLabel="Salvar alterações" />
    </EditorLayout>
  );
}
