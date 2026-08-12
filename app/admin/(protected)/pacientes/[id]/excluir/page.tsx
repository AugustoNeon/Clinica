import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatientById } from "@/lib/data/patients";
import { getAppointmentsForPatient } from "@/lib/data/appointments";
import { confirmDeletePatientAction } from "./actions";

export const metadata: Metadata = {
  title: "Excluir paciente",
  robots: { index: false, follow: false },
};

const statusLabels: Record<string, string> = {
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  concluida: "Concluida",
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
    <div>
      <h1 className="text-2xl font-semibold">Excluir paciente</h1>
      <p className="mt-2 text-sm opacity-80">
        Tem certeza que quer excluir <strong>{patient.name}</strong>?
      </p>

      {appointments.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm">
          <p className="font-medium">
            Este paciente tem {appointments.length}{" "}
            {appointments.length === 1 ? "consulta" : "consultas"} — excluir o paciente exclui
            essas consultas junto:
          </p>
          <ul className="mt-2 list-disc pl-5">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                {appointment.date} às {appointment.time} — {statusLabels[appointment.status]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <form action={confirmDelete}>
          <button
            type="submit"
            className="text-sm text-red-600 underline underline-offset-2 dark:text-red-400"
          >
            Confirmar exclusão
          </button>
        </form>
        <Link href={`/admin/pacientes/${id}/editar`} className="text-sm underline underline-offset-2">
          Cancelar
        </Link>
      </div>
    </div>
  );
}
