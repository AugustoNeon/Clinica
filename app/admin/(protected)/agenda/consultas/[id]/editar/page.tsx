import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { DangerZone, EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { getAppointmentById } from "@/lib/data/appointments";
import { getAllPatients } from "@/lib/data/patients";
import { getAllServices } from "@/lib/data/services";
import { formatShortDate } from "@/lib/utils/dates";
import { deleteAppointmentAction, updateAppointmentAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar consulta",
  robots: { index: false, follow: false },
};

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  const [patients, services] = await Promise.all([getAllPatients(), getAllServices()]);
  const patient = patients.find((candidate) => candidate.id === appointment.patient_id);
  const updateWithId = updateAppointmentAction.bind(null, id);
  const deleteWithId = deleteAppointmentAction.bind(null, id);

  return (
    <EditorLayout
      title={`Consulta de ${formatShortDate(appointment.date)} às ${appointment.time}`}
      description={patient ? patient.name : "Paciente removido"}
      back={{ href: "/admin/agenda", label: "Agenda" }}
      aside={
        <>
          <Tips
            items={[
              "Para desmarcar, troque o status para “Cancelada” — o horário volta a ficar livre e o histórico do paciente continua registrado.",
              "“Concluída” é para marcar depois do atendimento.",
            ]}
          />
          <DangerZone text="Excluir apaga a consulta do histórico. Prefira cancelar.">
            <ConfirmAction
              action={deleteWithId}
              label="Excluir consulta"
              question="Excluir esta consulta do histórico?"
            />
          </DangerZone>
        </>
      }
    >
      <AppointmentForm
        appointment={appointment}
        patients={patients}
        services={services}
        showStatus
        action={updateWithId}
        submitLabel="Salvar alterações"
      />
    </EditorLayout>
  );
}
