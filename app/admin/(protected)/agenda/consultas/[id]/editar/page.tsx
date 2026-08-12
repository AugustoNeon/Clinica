import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { getAppointmentById } from "@/lib/data/appointments";
import { getAllPatients } from "@/lib/data/patients";
import { getAllServices } from "@/lib/data/services";
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
  const updateWithId = updateAppointmentAction.bind(null, id);
  const deleteWithId = deleteAppointmentAction.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar consulta</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="text-sm text-red-600 underline underline-offset-2 dark:text-red-400"
          >
            Excluir
          </button>
        </form>
      </div>
      <div className="mt-6">
        <AppointmentForm
          appointment={appointment}
          patients={patients}
          services={services}
          showStatus
          action={updateWithId}
          submitLabel="Salvar alteracoes"
        />
      </div>
    </div>
  );
}
