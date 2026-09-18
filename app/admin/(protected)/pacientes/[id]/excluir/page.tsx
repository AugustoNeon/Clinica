import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Notice } from "@/components/admin/Notice";
import { buttonClasses } from "@/components/ui/Button";
import { IconTrash } from "@/components/ui/icons";
import { getAppointmentsForPatient } from "@/lib/data/appointments";
import { getPatientById } from "@/lib/data/patients";
import { formatShortDate } from "@/lib/utils/dates";
import { appointmentStatusLabels } from "@/lib/validation/adminAppointment";
import { confirmDeletePatientAction } from "./actions";

export const metadata: Metadata = {
  title: "Excluir paciente",
  robots: { index: false, follow: false },
};

/**
 * Tela de confirmacao dedicada (nao botao direto): excluir paciente apaga
 * as consultas dele em cascata (`patient_id on delete cascade`, migration
 * 0013) — decisao do /grill foi avisar o que vai junto antes de deixar
 * confirmar, nao bloquear nem apagar sem aviso.
 */
export default async function DeletePatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const appointments = await getAppointmentsForPatient(id);
  const confirmDelete = confirmDeletePatientAction.bind(null, id);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Excluir paciente"
        back={{ href: `/admin/pacientes/${id}/editar`, label: patient.name }}
      />

      <div className="rounded-2xl border border-red-600/20 bg-surface p-6 shadow-sm shadow-ink/5">
        <p className="text-lg">
          Excluir <strong>{patient.name}</strong> do cadastro?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          O cadastro some de vez. Se a pessoa voltar a ser atendida, será preciso cadastrar de novo.
        </p>

        {appointments.length > 0 && (
          <Notice tone="warning" title={`${appointments.length} ${appointments.length === 1 ? "consulta vai" : "consultas vão"} junto`} className="mt-5">
            <ul className="mt-1 space-y-1">
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  {formatShortDate(appointment.date)} às {appointment.time} —{" "}
                  {appointmentStatusLabels[appointment.status]}
                </li>
              ))}
            </ul>
          </Notice>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <form action={confirmDelete}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-medium text-white transition ease-out hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              <IconTrash width={16} height={16} />
              Sim, excluir paciente
            </button>
          </form>
          <Link href={`/admin/pacientes/${id}/editar`} className={buttonClasses("secondary")} autoFocus>
            Não, voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
