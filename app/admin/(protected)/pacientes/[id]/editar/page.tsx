import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PatientForm } from "@/components/sections/PatientForm";
import { getPatientById } from "@/lib/data/patients";
import { updatePatientAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar paciente",
  robots: { index: false, follow: false },
};

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const updateWithId = updatePatientAction.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar paciente</h1>
        <Link
          href={`/admin/pacientes/${id}/excluir`}
          className="text-sm text-red-600 underline underline-offset-2 dark:text-red-400"
        >
          Excluir
        </Link>
      </div>
      <div className="mt-6">
        <PatientForm patient={patient} action={updateWithId} submitLabel="Salvar alteracoes" />
      </div>
    </div>
  );
}
