import type { Metadata } from "next";
import { EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { getAllPatients } from "@/lib/data/patients";
import { getAllServices } from "@/lib/data/services";
import { createAppointmentAction } from "./actions";

export const metadata: Metadata = {
  title: "Nova consulta",
  robots: { index: false, follow: false },
};

interface NewAppointmentPageProps {
  searchParams: Promise<{ data?: string; paciente?: string }>;
}

export default async function NewAppointmentPage({ searchParams }: NewAppointmentPageProps) {
  const { data, paciente } = await searchParams;
  const [patients, services] = await Promise.all([getAllPatients(), getAllServices()]);
  const defaultPatientId = patients.some((patient) => patient.id === paciente) ? paciente : undefined;

  return (
    <EditorLayout
      title="Nova consulta"
      description="Toda consulta nasce confirmada. O horário precisa estar livre — o sistema não deixa marcar duas no mesmo."
      back={{ href: "/admin/agenda", label: "Agenda" }}
      aside={
        <Tips
          items={[
            "Consultas duram 1 hora e começam em hora cheia.",
            "Se o Google Calendar estiver conectado, confira os horários livres na agenda antes de marcar.",
            "Paciente novo? Cadastre em Pacientes e ele aparece na lista.",
          ]}
        />
      }
    >
      <AppointmentForm
        patients={patients}
        services={services}
        defaultDate={data}
        defaultPatientId={defaultPatientId}
        action={createAppointmentAction}
        submitLabel="Marcar consulta"
      />
    </EditorLayout>
  );
}
